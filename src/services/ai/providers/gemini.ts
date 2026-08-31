import { streamSSE } from "../sse";
import {
  AIError,
  toAIError,
  type AIChatResponse,
  type AIConfig,
  type AIMessage,
  type AIStreamCallbacks,
  type IAIProvider,
} from "../types";

// ─── Wire types ─────────────────────────────────────────────────────────────

interface GeminiErrorBody {
  error?: { message?: string };
}

interface GeminiCandidate {
  content?: { parts?: Array<{ text?: string }> };
  finishReason?: string;
}

interface GeminiResponseBody {
  candidates?: GeminiCandidate[];
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
}

const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export class GeminiProvider implements IAIProvider {
  async sendMessage(
    messages: AIMessage[],
    config: AIConfig,
  ): Promise<AIChatResponse> {
    const url = `${this.modelsURL(config)}/${config.model}:generateContent?key=${config.apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.buildRequestBody(messages, config)),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as GeminiErrorBody;
      throw new AIError(
        body.error?.message ?? `Gemini request failed (${response.status})`,
        "gemini",
        response.status,
      );
    }

    const data = (await response.json()) as GeminiResponseBody;
    const candidate = data.candidates?.[0];
    const content = candidate?.content?.parts?.[0]?.text ?? "";

    return {
      message: {
        id: `gemini-${Date.now()}`,
        role: "assistant",
        content,
        timestamp: Date.now(),
      },
      usage: data.usageMetadata
        ? {
            promptTokens: data.usageMetadata.promptTokenCount ?? 0,
            completionTokens: data.usageMetadata.candidatesTokenCount ?? 0,
            totalTokens: data.usageMetadata.totalTokenCount ?? 0,
          }
        : undefined,
      finishReason: candidate?.finishReason,
    };
  }

  async streamMessage(
    messages: AIMessage[],
    config: AIConfig,
    callbacks: AIStreamCallbacks,
  ): Promise<void> {
    // streamGenerateContent returns server-sent events when alt=sse is set.
    const url = `${this.modelsURL(config)}/${config.model}:streamGenerateContent?alt=sse&key=${config.apiKey}`;
    let fullContent = "";

    try {
      await streamSSE({
        url,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.buildRequestBody(messages, config)),
        onData: (data) => {
          try {
            const json = JSON.parse(data) as GeminiResponseBody;
            const token = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
            if (token) {
              fullContent += token;
              callbacks.onToken?.(token);
            }
          } catch {
            // skip malformed SSE chunks
          }
        },
      });

      callbacks.onComplete?.({
        message: {
          id: `gemini-stream-${Date.now()}`,
          role: "assistant",
          content: fullContent,
          timestamp: Date.now(),
        },
      });
    } catch (error) {
      callbacks.onError?.(toAIError(error, "gemini", "Gemini stream failed"));
    }
  }

  private modelsURL(config: AIConfig): string {
    const baseURL = config.baseURL ?? DEFAULT_BASE_URL;
    return `${baseURL}/models`;
  }

  private buildContents(messages: AIMessage[]) {
    return messages
      .filter((m) => m.role !== "system")
      .map(({ role, content }) => ({
        // Gemini uses "model" instead of "assistant"
        role: role === "assistant" ? "model" : "user",
        parts: [{ text: content }],
      }));
  }

  private buildRequestBody(messages: AIMessage[], config: AIConfig) {
    const systemMessage = messages.find((m) => m.role === "system");
    return {
      contents: this.buildContents(messages),
      ...(systemMessage
        ? {
            system_instruction: {
              parts: [{ text: systemMessage.content }],
            },
          }
        : {}),
      generationConfig: {
        temperature: config.temperature ?? 0.7,
        maxOutputTokens: config.maxTokens ?? 1024,
      },
    };
  }
}
