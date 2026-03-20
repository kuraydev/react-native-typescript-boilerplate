import {
  AIError,
  type AIChatResponse,
  type AIConfig,
  type AIMessage,
  type AIStreamCallbacks,
  type IAIProvider,
} from "../types";

interface GeminiErrorBody {
  error?: { message?: string };
}

export class GeminiProvider implements IAIProvider {
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

  async sendMessage(
    messages: AIMessage[],
    config: AIConfig,
  ): Promise<AIChatResponse> {
    const geminiBase =
      "https://generativelanguage.googleapis.com/v1beta/models";
    const url = `${geminiBase}/${config.model}:generateContent?key=${config.apiKey}`;

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await response.json()) as any;
    const content = (data.candidates?.[0]?.content?.parts?.[0]?.text ??
      "") as string;

    return {
      message: {
        id: `gemini-${Date.now()}`,
        role: "assistant",
        content,
        timestamp: Date.now(),
      },
      usage: data.usageMetadata
        ? {
            promptTokens: (data.usageMetadata.promptTokenCount ?? 0) as number,
            completionTokens: (data.usageMetadata.candidatesTokenCount ??
              0) as number,
            totalTokens: (data.usageMetadata.totalTokenCount ?? 0) as number,
          }
        : undefined,
      finishReason: data.candidates?.[0]?.finishReason as string | undefined,
    };
  }

  async streamMessage(
    messages: AIMessage[],
    config: AIConfig,
    callbacks: AIStreamCallbacks,
  ): Promise<void> {
    // streamGenerateContent returns server-sent events
    const geminiBase =
      "https://generativelanguage.googleapis.com/v1beta/models";
    const url = `${geminiBase}/${config.model}:streamGenerateContent?alt=sse&key=${config.apiKey}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.buildRequestBody(messages, config)),
      });

      if (!response.ok) {
        throw new AIError(
          `Gemini stream request failed (${response.status})`,
          "gemini",
          response.status,
        );
      }

      const reader = response.body?.getReader();
      if (!reader) throw new AIError("No response body", "gemini");

      const decoder = new TextDecoder();
      let fullContent = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const json = JSON.parse(line.slice(6)) as any;
            const token = (json.candidates?.[0]?.content?.parts?.[0]?.text ??
              "") as string;
            if (token) {
              fullContent += token;
              callbacks.onToken?.(token);
            }
          } catch {
            // skip malformed SSE chunks
          }
        }
      }

      callbacks.onComplete?.({
        message: {
          id: `gemini-stream-${Date.now()}`,
          role: "assistant",
          content: fullContent,
          timestamp: Date.now(),
        },
      });
    } catch (error) {
      const e = error instanceof Error ? error : new Error(String(error));
      callbacks.onError?.(e);
    }
  }
}
