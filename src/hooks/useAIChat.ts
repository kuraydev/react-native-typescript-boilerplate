import { useCallback, useRef, useState } from "react";
import { buildUserMessage, sendAIMessage, streamAIMessage } from "@services/ai";
import type {
  AIChatResponse,
  AIConfig,
  AIMessage,
  AIRole,
} from "@services/ai/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UseAIChatOptions {
  config: AIConfig;
  initialMessages?: AIMessage[];
  onResponse?: (response: AIChatResponse) => void;
  onError?: (error: Error) => void;
}

export interface UseAIChatReturn {
  messages: AIMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  error: Error | null;
  /** Send a message and wait for the full response */
  sendMessage: (content: string) => Promise<void>;
  /** Send a message and receive tokens incrementally */
  streamMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  /** Replace or add the system prompt at the start of the conversation */
  setSystemPrompt: (prompt: string) => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAIChat({
  config,
  initialMessages = [],
  onResponse,
  onError,
}: UseAIChatOptions): UseAIChatReturn {
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Accumulates streamed tokens without triggering extra re-renders
  const streamBufferRef = useRef<string>("");

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const buildMessage = (
    role: AIRole,
    content: string,
    id?: string,
  ): AIMessage => ({
    id: id ?? `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    content,
    timestamp: Date.now(),
  });

  // ─── sendMessage ────────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (content: string) => {
      const userMsg = buildUserMessage(content);
      const updatedMessages = [...messages, userMsg];

      setMessages(updatedMessages);
      setIsLoading(true);
      setError(null);

      try {
        const mergedConfig: AIConfig = config.systemPrompt
          ? { ...config }
          : config;

        const response = await sendAIMessage(updatedMessages, mergedConfig);
        setMessages((prev) => [...prev, response.message]);
        onResponse?.(response);
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        onError?.(e);
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages, config, onResponse, onError],
  );

  // ─── streamMessage ──────────────────────────────────────────────────────────

  const streamMessage = useCallback(
    async (content: string) => {
      const userMsg = buildUserMessage(content);
      const updatedMessages = [...messages, userMsg];

      setMessages(updatedMessages);
      setIsStreaming(true);
      setError(null);

      const streamingId = `assistant-stream-${Date.now()}`;
      streamBufferRef.current = "";

      // Append a placeholder assistant message that will be filled incrementally
      setMessages((prev) => [
        ...prev,
        buildMessage("assistant", "", streamingId),
      ]);

      try {
        await streamAIMessage(updatedMessages, config, {
          onToken: (token) => {
            streamBufferRef.current += token;
            const snapshot = streamBufferRef.current;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === streamingId ? { ...m, content: snapshot } : m,
              ),
            );
          },
          onComplete: (response) => {
            onResponse?.(response);
          },
          onError: (err) => {
            setError(err);
            onError?.(err);
          },
        });
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        onError?.(e);
      } finally {
        setIsStreaming(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages, config, onResponse, onError],
  );

  // ─── clearMessages ──────────────────────────────────────────────────────────

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // ─── setSystemPrompt ────────────────────────────────────────────────────────

  const setSystemPrompt = useCallback((prompt: string) => {
    const systemMsg: AIMessage = {
      id: "system-prompt",
      role: "system",
      content: prompt,
      timestamp: Date.now(),
    };
    setMessages((prev) => [
      systemMsg,
      ...prev.filter((m) => m.role !== "system"),
    ]);
  }, []);

  return {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    streamMessage,
    clearMessages,
    setSystemPrompt,
  };
}
