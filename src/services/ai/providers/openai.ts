import {
  AIError,
  type AIChatResponse,
  type AIConfig,
  type AIMessage,
  type AIStreamCallbacks,
  type IAIProvider,
} from "../types";

interface OpenAIErrorBody {
  error?: { message?: string };
}

export class OpenAIProvider implements IAIProvider {
  async sendMessage(
    messages: AIMessage[],
    config: AIConfig,
  ): Promise<AIChatResponse> {
    const baseURL = config.baseURL ?? "https://api.openai.com/v1";

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages.map(({ role, content }) => ({ role, content })),
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens ?? 1024,
      }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as OpenAIErrorBody;
      throw new AIError(
        body.error?.message ?? `OpenAI request failed (${response.status})`,
        "openai",
        response.status,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await response.json()) as any;
    const [choice] = data.choices;

    return {
      message: {
        id: data.id ?? `openai-${Date.now()}`,
        role: "assistant",
        content: (choice.message?.content ?? "") as string,
        timestamp: Date.now(),
      },
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens as number,
            completionTokens: data.usage.completion_tokens as number,
            totalTokens: data.usage.total_tokens as number,
          }
        : undefined,
      finishReason: choice.finish_reason as string | undefined,
    };
  }

  async streamMessage(
    messages: AIMessage[],
    config: AIConfig,
    callbacks: AIStreamCallbacks,
  ): Promise<void> {
    const baseURL = config.baseURL ?? "https://api.openai.com/v1";

    try {
      const response = await fetch(`${baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: messages.map(({ role, content }) => ({ role, content })),
          temperature: config.temperature ?? 0.7,
          max_tokens: config.maxTokens ?? 1024,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new AIError(
          `OpenAI stream request failed (${response.status})`,
          "openai",
          response.status,
        );
      }

      const reader = response.body?.getReader();
      if (!reader) throw new AIError("No response body", "openai");

      const decoder = new TextDecoder();
      let fullContent = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") continue;
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const json = JSON.parse(raw) as any;
            const token = (json.choices?.[0]?.delta?.content ?? "") as string;
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
          id: `openai-stream-${Date.now()}`,
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
