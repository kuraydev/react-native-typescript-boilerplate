import { useAICompletion } from "../../src/hooks/useAICompletion";
import type { AIConfig } from "../../src/services/ai/types";
import { act, renderHook } from "../helpers/renderHook";

function okResponse(body: unknown) {
  return { ok: true, status: 200, json: async () => body } as Response;
}

const config: AIConfig = {
  provider: "openai",
  apiKey: "sk",
  model: "gpt-4o-mini",
};

describe("useAICompletion", () => {
  afterEach(() => jest.restoreAllMocks());

  it("returns the completion text and clears loading", async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(
      okResponse({ choices: [{ message: { content: "42" } }] }),
    ) as typeof fetch;

    const { result } = renderHook(() => useAICompletion({ config }));

    let answer: string | null = null;
    await act(async () => {
      answer = await result.current.complete("what is 6x7?");
    });

    expect(answer).toBe("42");
    expect(result.current.result).toBe("42");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("prepends the systemPrompt as a system message", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue(okResponse({ choices: [{ message: { content: "ok" } }] }));
    globalThis.fetch = fetchMock as typeof fetch;

    const { result } = renderHook(() =>
      useAICompletion({ config, systemPrompt: "Classify sentiment." }),
    );

    await act(async () => {
      await result.current.complete("I love it");
    });

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.messages[0]).toMatchObject({
      role: "system",
      content: "Classify sentiment.",
    });
    expect(sent.messages[1]).toMatchObject({ role: "user", content: "I love it" });
  });

  it("captures errors and returns null", async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: { message: "server error" } }),
    }) as typeof fetch;

    const { result } = renderHook(() => useAICompletion({ config }));

    let answer: string | null = "unset";
    await act(async () => {
      answer = await result.current.complete("hi");
    });

    expect(answer).toBeNull();
    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe("server error");
  });
});
