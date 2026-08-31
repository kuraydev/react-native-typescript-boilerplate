/**
 * Controllable XMLHttpRequest mock for testing the SSE streaming transport.
 * Lets a test drive `onprogress` / `onload` with progressive `responseText`.
 */
export class MockXHR {
  static instances: MockXHR[] = [];

  status = 0;
  responseText = "";

  onprogress: (() => void) | null = null;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  ontimeout: (() => void) | null = null;

  method = "";
  url = "";
  headers: Record<string, string> = {};
  body = "";

  open(method: string, url: string): void {
    this.method = method;
    this.url = url;
  }

  setRequestHeader(key: string, value: string): void {
    this.headers[key] = value;
  }

  send(body: string): void {
    this.body = body;
    MockXHR.instances.push(this);
  }

  // ── test driver helpers ───────────────────────────────────────────────────

  /** Append a chunk and fire onprogress (status stays < 400 for streaming). */
  pushChunk(chunk: string, status = 200): void {
    this.status = status;
    this.responseText += chunk;
    this.onprogress?.();
  }

  /** Append a final chunk (optional) and fire onload to finish the stream. */
  finish(status = 200, finalChunk = ""): void {
    this.status = status;
    this.responseText += finalChunk;
    this.onload?.();
  }

  /** Simulate an HTTP error: body present, then onload sees status >= 400. */
  fail(status: number, body = ""): void {
    this.status = status;
    this.responseText = body;
    this.onload?.();
  }

  /** Simulate a transport-level network failure. */
  networkError(): void {
    this.onerror?.();
  }
}

export function installMockXHR(): typeof MockXHR {
  MockXHR.instances = [];
  // @ts-expect-error overriding the global for the duration of a test
  globalThis.XMLHttpRequest = MockXHR;
  return MockXHR;
}

export function lastXHR(): MockXHR {
  const xhr = MockXHR.instances[MockXHR.instances.length - 1];
  if (!xhr) throw new Error("No XMLHttpRequest was created");
  return xhr;
}
