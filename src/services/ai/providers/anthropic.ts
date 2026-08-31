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

interface AnthropicErrorBody {
  error?: { message?: string };
}

interface AnthropicResponseBody {
  id?: string;
  content?: Array<{ text?: string }>;
  stop_reason?: string;
  usage?: { input_tokens: number; output_tokens: number };
}

interface AnthropicStreamEvent {
  type?: string;
  delta?: { type?: string; text?: string };
}

const DEFAULT_BASE_URL = "https://api.anthropic.com/v1";
const ANTHROPIC_VERSION = "2023-06-01";

export class AnthropicProvider implements IAIProvider {
  async sendMessage(
    messages: AIMessage[],
    config: AIConfig,
  ): Promise<AIChatResponse> {
    const baseURL = config.baseURL ?? DEFAULT_BASE_URL;

    const response = await fetch(`${baseURL}/messages`, {
      method: "POST",
      headers: this.headers(config),
      body: JSON.stringify(this.buildBody(messages, config, false)),
    });

    if (!response.ok) {
      const body = (await response
        .json()
        .catch(() => ({}))) as AnthropicErrorBody;
      throw new AIError(
        body.error?.message ?? `Anthropic request failed (${response.status})`,
        "anthropic",
        response.status,
      );
    }

    const data = (await response.json()) as AnthropicResponseBody;
    const content = data.content?.[0]?.text ?? "";

    return {
      message: {
        id: data.id ?? `anthropic-${Date.now()}`,
        role: "assistant",
        content,
        timestamp: Date.now(),
      },
      usage: data.usage
        ? {
            promptTokens: data.usage.input_tokens,
            completionTokens: data.usage.output_tokens,
            totalTokens: data.usage.input_tokens + data.usage.output_tokens,
          }
        : undefined,
      finishReason: data.stop_reason,
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
        url: `${baseURL}/messages`,
        headers: this.headers(config),
        body: JSON.stringify(this.buildBody(messages, config, true)),
        onData: (data) => {
          try {
            const json = JSON.parse(data) as AnthropicStreamEvent;
            if (
              json.type === "content_block_delta" &&
              json.delta?.type === "text_delta"
            ) {
              const token = json.delta.text ?? "";
              if (token) {
                fullContent += token;
                callbacks.onToken?.(token);
              }
            }
          } catch {
            // skip malformed SSE chunks
          }
        },
      });

      callbacks.onComplete?.({
        message: {
          id: `anthropic-stream-${Date.now()}`,
          role: "assistant",
          content: fullContent,
          timestamp: Date.now(),
        },
      });
    } catch (error) {
      callbacks.onError?.(
        toAIError(error, "anthropic", "Anthropic stream failed"),
      );
    }
  }

  private headers(config: AIConfig): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
    };
  }

  private buildBody(messages: AIMessage[], config: AIConfig, stream: boolean) {
    // Anthropic keeps the system prompt separate from the messages array.
    const systemMessage = messages.find((m) => m.role === "system");
    const conversation = messages
      .filter((m) => m.role !== "system")
      .map(({ role, content }) => ({ role, content }));

    return {
      model: config.model,
      max_tokens: config.maxTokens ?? 1024,
      ...(systemMessage ? { system: systemMessage.content } : {}),
      messages: conversation,
      ...(stream ? { stream: true } : {}),
    };
  }
}
