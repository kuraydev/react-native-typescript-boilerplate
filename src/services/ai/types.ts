// ─── Core Types ───────────────────────────────────────────────────────────────

export type AIProvider = "openai" | "anthropic" | "gemini";

export type AIRole = "user" | "assistant" | "system";

export interface AIMessage {
  id: string;
  role: AIRole;
  content: string;
  timestamp: number;
}

// ─── Config ───────────────────────────────────────────────────────────────────

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  /** Override the default base URL (e.g. for proxies or local LLMs) */
  baseURL?: string;
}

// ─── Responses ────────────────────────────────────────────────────────────────

export interface AIUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AIChatResponse {
  message: AIMessage;
  usage?: AIUsage;
  finishReason?: string;
}

// ─── Streaming ────────────────────────────────────────────────────────────────

export interface AIStreamCallbacks {
  onToken?: (token: string) => void;
  onComplete?: (response: AIChatResponse) => void;
  onError?: (error: Error) => void;
}

// ─── Provider Contract ────────────────────────────────────────────────────────

export interface IAIProvider {
  sendMessage(messages: AIMessage[], config: AIConfig): Promise<AIChatResponse>;
  streamMessage(
    messages: AIMessage[],
    config: AIConfig,
    callbacks: AIStreamCallbacks,
  ): Promise<void>;
}

// ─── Provider Metadata ────────────────────────────────────────────────────────
// Model names are intentionally NOT defined here — pass any model string you
// need via AIConfig.model. Check each provider's docs for available models.

export const AI_PROVIDER_LABELS: Record<AIProvider, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  gemini: "Gemini",
};

export const AI_BASE_URLS: Record<AIProvider, string> = {
  openai: "https://api.openai.com/v1",
  anthropic: "https://api.anthropic.com/v1",
  gemini: "https://generativelanguage.googleapis.com/v1beta",
};

// ─── Error ────────────────────────────────────────────────────────────────────

export class AIError extends Error {
  constructor(
    message: string,
    public readonly provider: AIProvider,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = "AIError";
  }
}
