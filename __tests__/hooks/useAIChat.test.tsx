import { useAIChat } from "../../src/hooks/useAIChat";
import type { AIConfig } from "../../src/services/ai/types";
import { installMockXHR, lastXHR } from "../helpers/mockXhr";
import { act, renderHook } from "../helpers/renderHook";

function okResponse(body: unknown) {
  return { ok: true, status: 200, json: async () => body } as Response;
}

const config: AIConfig = {
  provider: "openai",
  apiKey: "sk",
  model: "gpt-4o-mini",
};

describe("useAIChat.sendMessage", () => {
  afterEach(() => jest.restoreAllMocks());

  it("appends the user message then the assistant reply", async () => {
    globalThis.fetch = jest.fn().mockResolvedValue(
      okResponse({ choices: [{ message: { content: "Pong" } }] }),
    ) as typeof fetch;

    const { result } = renderHook(() => useAIChat({ config }));

    await act(async () => {
      await result.current.sendMessage("Ping");
    });

    const { messages } = result.current;
    expect(messages).toHaveLength(2);
    expect(messages[0]).toMatchObject({ role: "user", content: "Ping" });
    expect(messages[1]).toMatchObject({ role: "assistant", content: "Pong" });
    expect(result.current.isLoading).toBe(false);
  });

  it("sets error state when the request fails", async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: { message: "bad key" } }),
    }) as typeof fetch;

    const { result } = renderHook(() => useAIChat({ config }));

    await act(async () => {
      await result.current.sendMessage("Ping");
    });

    expect(result.current.error?.message).toBe("bad key");
    expect(result.current.isLoading).toBe(false);
  });
});

describe("useAIChat.streamMessage", () => {
  beforeEach(() => installMockXHR());

  it("fills the placeholder assistant message token by token", async () => {
    const { result } = renderHook(() => useAIChat({ config }));

    let promise!: Promise<void>;
    await act(async () => {
      promise = result.current.streamMessage("Ping");
    });

    const xhr = lastXHR();
    await act(async () => {
      xhr.pushChunk('data: {"choices":[{"delta":{"content":"Po"}}]}\n');
      xhr.pushChunk('data: {"choices":[{"delta":{"content":"ng"}}]}\n');
      xhr.pushChunk("data: [DONE]\n");
      xhr.finish(200);
      await promise;
    });

    const { messages } = result.current;
    expect(messages[0]).toMatchObject({ role: "user", content: "Ping" });
    expect(messages[messages.length - 1]).toMatchObject({
      role: "assistant",
      content: "Pong",
    });
    expect(result.current.isStreaming).toBe(false);
  });
});

describe("useAIChat helpers", () => {
  it("setSystemPrompt inserts a single system message at the front", async () => {
    const { result } = renderHook(() => useAIChat({ config }));

    await act(async () => {
      result.current.setSystemPrompt("First");
      result.current.setSystemPrompt("Second");
    });

    const systemMsgs = result.current.messages.filter(m => m.role === "system");
    expect(systemMsgs).toHaveLength(1);
    expect(result.current.messages[0]).toMatchObject({
      role: "system",
      content: "Second",
    });
  });

  it("clearMessages empties the conversation and error", async () => {
    globalThis.fetch = jest
      .fn()
      .mockResolvedValue(okResponse({ choices: [{ message: { content: "x" } }] }));

    const { result } = renderHook(() => useAIChat({ config }));
    await act(async () => {
      await result.current.sendMessage("hi");
    });
    expect(result.current.messages.length).toBeGreaterThan(0);

    await act(async () => {
      result.current.clearMessages();
    });
    expect(result.current.messages).toHaveLength(0);
    expect(result.current.error).toBeNull();
  });
});
