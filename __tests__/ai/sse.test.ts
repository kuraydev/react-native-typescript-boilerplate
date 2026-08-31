import { SSEParser } from "../../src/services/ai/sse";

describe("SSEParser", () => {
  it("extracts data payloads from complete lines", () => {
    const parser = new SSEParser();
    expect(parser.feed("data: hello\n")).toEqual(["hello"]);
    expect(parser.feed("data: world\n")).toEqual(["world"]);
  });

  it("strips exactly one optional leading space after the colon", () => {
    const parser = new SSEParser();
    expect(parser.feed("data:nospace\n")).toEqual(["nospace"]);
    expect(parser.feed("data:  two-spaces\n")).toEqual([" two-spaces"]);
  });

  it("ignores non-data lines (events, comments, blanks)", () => {
    const parser = new SSEParser();
    const out = parser.feed(
      "event: message\n: keep-alive comment\n\ndata: kept\n",
    );
    expect(out).toEqual(["kept"]);
  });

  it("buffers a data line split across two feeds (the dropped-token bug)", () => {
    const parser = new SSEParser();
    // First network chunk ends mid-line — nothing should be emitted yet.
    expect(parser.feed("data: hel")).toEqual([]);
    // Second chunk completes the line — the full token must arrive intact.
    expect(parser.feed("lo world\n")).toEqual(["hello world"]);
  });

  it("handles many small fragments accumulating into one payload", () => {
    const parser = new SSEParser();
    expect(parser.feed("da")).toEqual([]);
    expect(parser.feed("ta: ")).toEqual([]);
    expect(parser.feed("a")).toEqual([]);
    expect(parser.feed("bc\n")).toEqual(["abc"]);
  });

  it("emits multiple payloads contained in a single chunk", () => {
    const parser = new SSEParser();
    expect(parser.feed("data: a\ndata: b\ndata: c\n")).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  it("tolerates CRLF line endings", () => {
    const parser = new SSEParser();
    expect(parser.feed("data: a\r\ndata: b\r\n")).toEqual(["a", "b"]);
  });

  it("flush() emits a trailing line that has no final newline", () => {
    const parser = new SSEParser();
    expect(parser.feed("data: trailing")).toEqual([]);
    expect(parser.flush()).toEqual(["trailing"]);
  });

  it("flush() returns nothing when the buffer is empty or non-data", () => {
    const parser = new SSEParser();
    expect(parser.flush()).toEqual([]);
    parser.feed("event: done");
    expect(parser.flush()).toEqual([]);
  });

  it("passes through the [DONE] sentinel as a payload", () => {
    const parser = new SSEParser();
    expect(parser.feed("data: [DONE]\n")).toEqual(["[DONE]"]);
  });
});
