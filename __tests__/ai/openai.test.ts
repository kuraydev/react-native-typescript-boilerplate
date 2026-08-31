import { OpenAIProvider } from "../../src/services/ai/providers/openai";
import { AIError, type AIConfig, type AIMessage } from "../../src/services/ai/types";
import { installMockXHR, lastXHR } from "../helpers/mockXhr";

function okResponse(body: unknown) {
  return { ok: true, status: 200, json: async () => body } as Response;
}
function errResponse(status: number, body: unknown) {
  return { ok: false, status, json: async () => body } as Response;
}

const config: AIConfig = {
  provider: "openai",
  apiKey: "sk-test",
  model: "gpt-4o-mini",
};

const messages: AIMessage[] = [
  { id: "1", role: "user", content: "Hi", timestamp: 0 },
];

describe("OpenAIProvider.sendMessage", () => {
  afterEach(() => jest.restoreAllMocks());

  it("posts to the chat/completions endpoint with auth + shaped body", async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      okResponse({
        id: "cmpl-1",
        choices: [{ message: { content: "Hello!" }, finish_reason: "stop" }],
        usage: { prompt_tokens: 3, completion_tokens: 2, total_tokens: 5 },
      }),
    );
    globalThis.fetch = fetchMock as typeof fetch;

    const result = await new OpenAIProvider().sendMessage(messages, config);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.openai.com/v1/chat/completions");
    expect(init.headers.Authorization).toBe("Bearer sk-test");
    const sent = JSON.parse(init.body);
    expect(sent.model).toBe("gpt-4o-mini");
    expect(sent.stream).toBeUndefined();
    expect(sent.messages).toEqual([{ role: "user", content: "Hi" }]);
    expect(sent.temperature).toBe(0.7);
    expect(sent.max_tokens).toBe(1024);

    expect(result.message.content).toBe("Hello!");
    expect(result.usage?.totalTokens).toBe(5);
    expect(result.finishReason).toBe("stop");
  });

  it("honors baseURL, temperature and maxTokens overrides", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue(okResponse({ choices: [{ message: { content: "" } }] }));
    globalThis.fetch = fetchMock as typeof fetch;

    await new OpenAIProvider().sendMessage(messages, {
      ...config,
      baseURL: "https://proxy.local/v1",
      temperature: 0.1,
      maxTokens: 42,
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://proxy.local/v1/chat/completions");
    const sent = JSON.parse(init.body);
    expect(sent.temperature).toBe(0.1);
    expect(sent.max_tokens).toBe(42);
  });

  it("maps an HTTP error to AIError carrying the message + statusCode", async () => {
    globalThis.fetch = jest
      .fn()
      .mockResolvedValue(
        errResponse(401, { error: { message: "Invalid API key" } }),
      ) as typeof fetch;

    await expect(
      new OpenAIProvider().sendMessage(messages, config),
    ).rejects.toMatchObject({
      name: "AIError",
      provider: "openai",
      statusCode: 401,
      message: "Invalid API key",
    });
    await expect(
      new OpenAIProvider().sendMessage(messages, config),
    ).rejects.toBeInstanceOf(AIError);
  });
});

describe("OpenAIProvider.streamMessage", () => {
  beforeEach(() => installMockXHR());

  it("assembles tokens from SSE deltas and reports onComplete", async () => {
    const tokens: string[] = [];
    let completed = "";
    const provider = new OpenAIProvider();

    const promise = provider.streamMessage(messages, config, {
      onToken: t => tokens.push(t),
      onComplete: r => {
        completed = r.message.content;
      },
    });

    const xhr = lastXHR();
    expect(xhr.headers.Authorization).toBe("Bearer sk-test");
    expect(JSON.parse(xhr.body).stream).toBe(true);

    xhr.pushChunk('data: {"choices":[{"delta":{"content":"Hel"}}]}\n');
    // Split a single SSE line across two network chunks.
    xhr.pushChunk('data: {"choices":[{"delta":{"content":"lo');
    xhr.pushChunk(' there"}}]}\n');
    xhr.pushChunk("data: [DONE]\n");
    xhr.finish(200);

    await promise;

    expect(tokens).toEqual(["Hel", "lo there"]);
    expect(completed).toBe("Hello there");
  });

  it("routes an HTTP error through onError as an AIError", async () => {
    let err: Error | undefined;
    const provider = new OpenAIProvider();

    const promise = provider.streamMessage(messages, config, {
      onError: e => {
        err = e;
      },
    });

    lastXHR().fail(429, JSON.stringify({ error: { message: "Rate limited" } }));
    await promise;

    expect(err).toBeInstanceOf(AIError);
    expect((err as AIError).statusCode).toBe(429);
    expect(err?.message).toBe("Rate limited");
  });
});
