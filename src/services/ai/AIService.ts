import { AnthropicProvider } from "./providers/anthropic";
import { GeminiProvider } from "./providers/gemini";
import { OpenAIProvider } from "./providers/openai";
import {
  type AIChatResponse,
  type AIConfig,
  type AIMessage,
  type AIProvider,
  type AIStreamCallbacks,
  type IAIProvider,
} from "./types";

// ─── Provider Factory ─────────────────────────────────────────────────────────

function createProvider(provider: AIProvider): IAIProvider {
  switch (provider) {
    case "openai":
      return new OpenAIProvider();
    case "anthropic":
      return new AnthropicProvider();
    case "gemini":
      return new GeminiProvider();
    default: {
      const exhaustive: never = provider;
      throw new Error(`Unknown AI provider: ${String(exhaustive)}`);
    }
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Send a single chat completion request and get a full response.
 *
 * @example
 * const response = await sendAIMessage(
 *   [{ id: "1", role: "user", content: "Hello!", timestamp: Date.now() }],
 *   { provider: "openai", apiKey: "sk-...", model: "gpt-4o-mini" },
 * );
 */
export function sendAIMessage(
  messages: AIMessage[],
  config: AIConfig,
): Promise<AIChatResponse> {
  const provider = createProvider(config.provider);
  return provider.sendMessage(messages, config);
}

/**
 * Stream a chat completion response, receiving tokens as they arrive.
 *
 * @example
 * await streamAIMessage(messages, config, {
 *   onToken: (token) => console.log(token),
 *   onComplete: (response) => console.log("Done:", response.message.content),
 *   onError: (err) => console.error(err),
 * });
 */
export function streamAIMessage(
  messages: AIMessage[],
  config: AIConfig,
  callbacks: AIStreamCallbacks,
): Promise<void> {
  const provider = createProvider(config.provider);
  return provider.streamMessage(messages, config, callbacks);
}

/**
 * Build a system message to inject at the start of a conversation.
 */
export function buildSystemMessage(content: string): AIMessage {
  return {
    id: `system-${Date.now()}`,
    role: "system",
    content,
    timestamp: Date.now(),
  };
}

/**
 * Build a user message.
 */
export function buildUserMessage(content: string): AIMessage {
  return {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role: "user",
    content,
    timestamp: Date.now(),
  };
}
