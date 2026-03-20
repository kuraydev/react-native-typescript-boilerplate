import {
  AIError,
  type AIChatResponse,
  type AIConfig,
  type AIMessage,
  type AIStreamCallbacks,
  type IAIProvider,
} from "../types";

interface AnthropicErrorBody {
  error?: { message?: string };
}

const ANTHROPIC_VERSION = "2023-06-01";

export class AnthropicProvider implements IAIProvider {
  async sendMessage(
    messages: AIMessage[],
    config: AIConfig,
  ): Promise<AIChatResponse> {
    const baseURL = config.baseURL ?? "https://api.anthropic.com/v1";

    // Anthropic keeps system prompt separate from the messages array
    const systemMessage = messages.find((m) => m.role === "system");
    const conversation = messages
      .filter((m) => m.role !== "system")
      .map(({ role, content }) => ({ role, content }));

    const response = await fetch(`${baseURL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.maxTokens ?? 1024,
        ...(systemMessage ? { system: systemMessage.content } : {}),
        messages: conversation,
      }),
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await response.json()) as any;
    const content = (data.content?.[0]?.text ?? "") as string;

    return {
      message: {
        id: (data.id ?? `anthropic-${Date.now()}`) as string,
        role: "assistant",
        content,
        timestamp: Date.now(),
      },
      usage: data.usage
        ? {
            promptTokens: data.usage.input_tokens as number,
            completionTokens: data.usage.output_tokens as number,
            totalTokens:
              (data.usage.input_tokens as number) +
              (data.usage.output_tokens as number),
          }
        : undefined,
      finishReason: data.stop_reason as string | undefined,
    };
  }

  async streamMessage(
    messages: AIMessage[],
    config: AIConfig,
    callbacks: AIStreamCallbacks,
  ): Promise<void> {
    const baseURL = config.baseURL ?? "https://api.anthropic.com/v1";

    const systemMessage = messages.find((m) => m.role === "system");
    const conversation = messages
      .filter((m) => m.role !== "system")
      .map(({ role, content }) => ({ role, content }));

    try {
      const response = await fetch(`${baseURL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.apiKey,
          "anthropic-version": ANTHROPIC_VERSION,
        },
        body: JSON.stringify({
          model: config.model,
          max_tokens: config.maxTokens ?? 1024,
          ...(systemMessage ? { system: systemMessage.content } : {}),
          messages: conversation,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new AIError(
          `Anthropic stream request failed (${response.status})`,
          "anthropic",
          response.status,
        );
      }

      const reader = response.body?.getReader();
      if (!reader) throw new AIError("No response body", "anthropic");

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
            if (
              json.type === "content_block_delta" &&
              json.delta?.type === "text_delta"
            ) {
              const token = (json.delta.text ?? "") as string;
              if (token) {
                fullContent += token;
                callbacks.onToken?.(token);
              }
            }
          } catch {
            // skip malformed SSE chunks
          }
        }
      }

      callbacks.onComplete?.({
        message: {
          id: `anthropic-stream-${Date.now()}`,
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
