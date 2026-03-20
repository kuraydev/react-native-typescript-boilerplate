import { useCallback, useState } from "react";
import { sendAIMessage } from "@services/ai";
import type { AIConfig, AIMessage } from "@services/ai/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UseAICompletionOptions {
  config: AIConfig;
  /** Optional system instruction prepended to every request */
  systemPrompt?: string;
}

export interface UseAICompletionReturn {
  /** The last completion result */
  result: string | null;
  isLoading: boolean;
  error: Error | null;
  /** Run a single completion and return the result */
  complete: (prompt: string) => Promise<string | null>;
  reset: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Lightweight hook for one-shot completions.
 *
 * @example
 * const { complete, result, isLoading } = useAICompletion({
 *   config: { provider: "openai", apiKey: "sk-...", model: "gpt-4o-mini" },
 *   systemPrompt: "You are a helpful coding assistant.",
 * });
 *
 * const answer = await complete("Explain closures in JavaScript.");
 */
export function useAICompletion({
  config,
  systemPrompt,
}: UseAICompletionOptions): UseAICompletionReturn {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const complete = useCallback(
    async (prompt: string): Promise<string | null> => {
      setIsLoading(true);
      setError(null);

      const messages: AIMessage[] = [
        ...(systemPrompt
          ? [
              {
                id: "system-0",
                role: "system" as const,
                content: systemPrompt,
                timestamp: Date.now(),
              },
            ]
          : []),
        {
          id: `user-${Date.now()}`,
          role: "user" as const,
          content: prompt,
          timestamp: Date.now(),
        },
      ];

      try {
        const response = await sendAIMessage(messages, config);
        setResult(response.message.content);
        return response.message.content;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [config, systemPrompt],
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, isLoading, error, complete, reset };
}
