import {
  buildSystemMessage,
  buildUserMessage,
  sendAIMessage,
} from "../../src/services/ai/AIService";
import { extractApiErrorMessage } from "../../src/services/ai/types";
import type { AIConfig, AIMessage } from "../../src/services/ai/types";

function okResponse(body: unknown) {
  return { ok: true, status: 200, json: async () => body } as Response;
}

describe("message builders", () => {
  it("buildUserMessage produces a user message with content + id + timestamp", () => {
    const msg = buildUserMessage("hello");
    expect(msg.role).toBe("user");
    expect(msg.content).toBe("hello");
    expect(typeof msg.id).toBe("string");
    expect(typeof msg.timestamp).toBe("number");
  });

  it("buildSystemMessage produces a system message", () => {
    const msg = buildSystemMessage("be nice");
    expect(msg.role).toBe("system");
    expect(msg.content).toBe("be nice");
  });
});

describe("sendAIMessage system-prompt injection", () => {
  const base: AIConfig = {
    provider: "openai",
    apiKey: "sk",
    model: "gpt-4o-mini",
  };
  const userOnly: AIMessage[] = [
    { id: "1", role: "user", content: "Hi", timestamp: 0 },
  ];

  afterEach(() => jest.restoreAllMocks());

  it("prepends config.systemPrompt as a system message when none exists", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue(okResponse({ choices: [{ message: { content: "" } }] }));
    globalThis.fetch = fetchMock as typeof fetch;

    await sendAIMessage(userOnly, { ...base, systemPrompt: "You are a bot." });

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.messages[0]).toMatchObject({
      role: "system",
      content: "You are a bot.",
    });
    expect(sent.messages[1]).toMatchObject({ role: "user", content: "Hi" });
  });

  it("does not double-inject when a system message is already present", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue(okResponse({ choices: [{ message: { content: "" } }] }));
    globalThis.fetch = fetchMock as typeof fetch;

    const withSystem: AIMessage[] = [
      { id: "s", role: "system", content: "Existing", timestamp: 0 },
      ...userOnly,
    ];
    await sendAIMessage(withSystem, { ...base, systemPrompt: "Ignored" });

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    const systemMsgs = sent.messages.filter(
      (m: AIMessage) => m.role === "system",
    );
    expect(systemMsgs).toHaveLength(1);
    expect(systemMsgs[0].content).toBe("Existing");
  });

  it("leaves messages untouched when no systemPrompt is set", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue(okResponse({ choices: [{ message: { content: "" } }] }));
    globalThis.fetch = fetchMock as typeof fetch;

    await sendAIMessage(userOnly, base);

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.messages).toHaveLength(1);
  });
});

describe("extractApiErrorMessage", () => {
  it("reads { error: { message } }", () => {
    expect(extractApiErrorMessage('{"error":{"message":"boom"}}')).toBe("boom");
  });
  it("reads a string error field", () => {
    expect(extractApiErrorMessage('{"error":"nope"}')).toBe("nope");
  });
  it("returns undefined for non-JSON or empty input", () => {
    expect(extractApiErrorMessage("not json")).toBeUndefined();
    expect(extractApiErrorMessage(undefined)).toBeUndefined();
  });
});
