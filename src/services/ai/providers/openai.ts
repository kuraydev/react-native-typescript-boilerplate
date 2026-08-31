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

interface OpenAIErrorBody {
  error?: { message?: string };
}

interface OpenAIChoice {
  message?: { content?: string };
  finish_reason?: string;
}

interface OpenAIResponseBody {
  id?: string;
  choices: OpenAIChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface OpenAIStreamChunk {
  choices?: Array<{ delta?: { content?: string } }>;
}

const DEFAULT_BASE_URL = "https://api.openai.com/v1";

export class OpenAIProvider implements IAIProvider {
  async sendMessage(
    messages: AIMessage[],
    config: AIConfig,
  ): Promise<AIChatResponse> {
    const baseURL = config.baseURL ?? DEFAULT_BASE_URL;

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(this.buildBody(messages, config, false)),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as OpenAIErrorBody;
      throw new AIError(
        body.error?.message ?? `OpenAI request failed (${response.status})`,
        "openai",
        response.status,
      );
    }

    const data = (await response.json()) as OpenAIResponseBody;
    const [choice] = data.choices;

    return {
      message: {
        id: data.id ?? `openai-${Date.now()}`,
        role: "assistant",
        content: choice?.message?.content ?? "",
        timestamp: Date.now(),
      },
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
      finishReason: choice?.finish_reason,
    };
  }

  async streamMessage(
    messages: AIMessage[],
    config: AIConfig,
    callbacks: AIStreamCallbacks,
  ): Promise<void> {
    const baseURL = config.baseURL ?? DEFAULT_BASE_URL;
    let fullContent = "";

    try {
      await streamSSE({
        url: `${baseURL}/chat/completions`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(this.buildBody(messages, config, true)),
        onData: (data) => {
          if (data === "[DONE]") return;
          try {
            const json = JSON.parse(data) as OpenAIStreamChunk;
            const token = json.choices?.[0]?.delta?.content ?? "";
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
          id: `openai-stream-${Date.now()}`,
          role: "assistant",
          content: fullContent,
          timestamp: Date.now(),
        },
      });
    } catch (error) {
      callbacks.onError?.(toAIError(error, "openai", "OpenAI stream failed"));
    }
  }

  private buildBody(messages: AIMessage[], config: AIConfig, stream: boolean) {
    return {
      model: config.model,
      messages: messages.map(({ role, content }) => ({ role, content })),
      temperature: config.temperature ?? 0.7,
      max_tokens: config.maxTokens ?? 1024,
      ...(stream ? { stream: true } : {}),
    };
  }
}
