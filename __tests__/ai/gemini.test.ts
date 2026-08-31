import { GeminiProvider } from "../../src/services/ai/providers/gemini";
import { type AIConfig, type AIMessage } from "../../src/services/ai/types";
import { installMockXHR, lastXHR } from "../helpers/mockXhr";

function okResponse(body: unknown) {
  return { ok: true, status: 200, json: async () => body } as Response;
}

const config: AIConfig = {
  provider: "gemini",
  apiKey: "g-key",
  model: "gemini-2.0-flash",
};

const messages: AIMessage[] = [
  { id: "s", role: "system", content: "Sys", timestamp: 0 },
  { id: "1", role: "user", content: "Hi", timestamp: 0 },
  { id: "2", role: "assistant", content: "Yo", timestamp: 0 },
];

describe("GeminiProvider.sendMessage", () => {
  afterEach(() => jest.restoreAllMocks());

  it("targets generateContent with the key, mapping roles + system_instruction", async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      okResponse({
        candidates: [
          { content: { parts: [{ text: "Hello" }] }, finishReason: "STOP" },
        ],
        usageMetadata: {
          promptTokenCount: 2,
          candidatesTokenCount: 1,
          totalTokenCount: 3,
        },
      }),
    );
    globalThis.fetch = fetchMock as typeof fetch;

    const result = await new GeminiProvider().sendMessage(messages, config);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=g-key",
    );
    const sent = JSON.parse(init.body);
    expect(sent.system_instruction.parts[0].text).toBe("Sys");
    expect(sent.contents).toEqual([
      { role: "user", parts: [{ text: "Hi" }] },
      { role: "model", parts: [{ text: "Yo" }] },
    ]);
    expect(result.message.content).toBe("Hello");
    expect(result.usage?.totalTokens).toBe(3);
    expect(result.finishReason).toBe("STOP");
  });

  it("respects a baseURL override for proxying", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue(okResponse({ candidates: [] }));
    globalThis.fetch = fetchMock as typeof fetch;

    await new GeminiProvider().sendMessage(messages, {
      ...config,
      baseURL: "https://proxy.local/v1beta",
    });

    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://proxy.local/v1beta/models/gemini-2.0-flash:generateContent?key=g-key",
    );
  });
});

describe("GeminiProvider.streamMessage", () => {
  beforeEach(() => installMockXHR());

  it("uses streamGenerateContent and assembles candidate text", async () => {
    const tokens: string[] = [];
    let completed = "";
    const provider = new GeminiProvider();

    const promise = provider.streamMessage(messages, config, {
      onToken: t => tokens.push(t),
      onComplete: r => {
        completed = r.message.content;
      },
    });

    const xhr = lastXHR();
    expect(xhr.url).toContain(":streamGenerateContent?alt=sse&key=g-key");

    xhr.pushChunk(
      'data: {"candidates":[{"content":{"parts":[{"text":"Hel"}]}}]}\n',
    );
    xhr.pushChunk(
      'data: {"candidates":[{"content":{"parts":[{"text":"lo"}]}}]}\n',
    );
    xhr.finish(200);

    await promise;

    expect(tokens).toEqual(["Hel", "lo"]);
    expect(completed).toBe("Hello");
  });
});
