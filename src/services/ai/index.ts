export {
  sendAIMessage,
  streamAIMessage,
  buildSystemMessage,
  buildUserMessage,
} from "./AIService";

export {
  AI_PROVIDER_LABELS,
  AI_BASE_URLS,
  AIError,
  extractApiErrorMessage,
  toAIError,
} from "./types";

export { SSEError, SSEParser, streamSSE } from "./sse";
export type { StreamSSEOptions } from "./sse";

export type {
  AIProvider,
  AIRole,
  AIMessage,
  AIConfig,
  AIChatResponse,
  AIUsage,
  AIStreamCallbacks,
  IAIProvider,
} from "./types";
