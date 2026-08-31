import { AnthropicProvider } from "../../src/services/ai/providers/anthropic";
import { AIError, type AIConfig, type AIMessage } from "../../src/services/ai/types";
import { installMockXHR, lastXHR } from "../helpers/mockXhr";

function okResponse(body: unknown) {
  return { ok: true, status: 200, json: async () => body } as Response;
}

const config: AIConfig = {
  provider: "anthropic",
  apiKey: "ak-test",
  model: "claude-3-5-haiku",
};

const messages: AIMessage[] = [
  { id: "s", role: "system", content: "Be terse.", timestamp: 0 },
  { id: "1", role: "user", content: "Hi", timestamp: 0 },
];

describe("AnthropicProvider.sendMessage", () => {
  afterEach(() => jest.restoreAllMocks());

  it("separates the system prompt and sets the version header", async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      okResponse({
        id: "msg_1",
        content: [{ text: "Hello" }],
        stop_reason: "end_turn",
        usage: { input_tokens: 4, output_tokens: 1 },
      }),
    );
    globalThis.fetch = fetchMock as typeof fetch;

    const result = await new AnthropicProvider().sendMessage(messages, config);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.anthropic.com/v1/messages");
    expect(init.headers["x-api-key"]).toBe("ak-test");
    expect(init.headers["anthropic-version"]).toBe("2023-06-01");

    const sent = JSON.parse(init.body);
    expect(sent.system).toBe("Be terse.");
    expect(sent.messages).toEqual([{ role: "user", content: "Hi" }]);
    expect(sent.messages.some((m: AIMessage) => m.role === "system")).toBe(
      false,
    );

    expect(result.message.content).toBe("Hello");
    expect(result.usage?.totalTokens).toBe(5);
    expect(result.finishReason).toBe("end_turn");
  });

  it("omits the system field when no system message is present", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue(okResponse({ content: [{ text: "" }] }));
    globalThis.fetch = fetchMock as typeof fetch;

    await new AnthropicProvider().sendMessage(
      [{ id: "1", role: "user", content: "Hi", timestamp: 0 }],
      config,
    );

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect("system" in sent).toBe(false);
  });
});

describe("AnthropicProvider.streamMessage", () => {
  beforeEach(() => installMockXHR());

  it("only emits text_delta tokens from content_block_delta events", async () => {
    const tokens: string[] = [];
    let completed = "";
    const provider = new AnthropicProvider();

    const promise = provider.streamMessage(messages, config, {
      onToken: t => tokens.push(t),
      onComplete: r => {
        completed = r.message.content;
      },
    });

    const xhr = lastXHR();
    xhr.pushChunk('data: {"type":"message_start"}\n');
    xhr.pushChunk(
      'data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"Hi"}}\n',
    );
    xhr.pushChunk(
      'data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"!"}}\n',
    );
    xhr.pushChunk('data: {"type":"message_stop"}\n');
    xhr.finish(200);

    await promise;

    expect(tokens).toEqual(["Hi", "!"]);
    expect(completed).toBe("Hi!");
  });

  it("maps a network failure to an AIError via onError", async () => {
    let err: Error | undefined;
    const promise = new AnthropicProvider().streamMessage(messages, config, {
      onError: e => {
        err = e;
      },
    });
    lastXHR().networkError();
    await promise;
    expect(err).toBeInstanceOf(AIError);
    expect((err as AIError).provider).toBe("anthropic");
  });
});
