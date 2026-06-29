/**
 * React Native compatible Server-Sent Events (SSE) transport.
 *
 * Why this exists: React Native's `fetch` does **not** expose a streaming
 * `ReadableStream` body — `response.body` is `undefined` on a device/simulator,
 * so the common `response.body.getReader()` pattern throws immediately and no
 * tokens ever arrive. `XMLHttpRequest`, by contrast, fires `onprogress` with an
 * ever-growing `responseText` on React Native, which lets us read an SSE stream
 * incrementally without any native module.
 *
 * `SSEParser` is the pure, transport-agnostic line buffer. It is the piece that
 * fixes the "token split across two network chunks gets dropped" bug: it holds
 * an internal buffer and only emits a `data:` payload once a full line (`\n`)
 * has been received, carrying partial lines across `feed()` calls.
 */

// ─── Errors ─────────────────────────────────────────────────────────────────

export class SSEError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly responseText?: string,
  ) {
    super(message);
    this.name = "SSEError";
  }
}

// ─── Parser ───────────────────────────────────────────────────────────────────

/**
 * Incremental SSE line parser. Feed it raw text chunks as they arrive; it
 * returns the `data:` payloads for every *complete* line seen so far and keeps
 * any trailing partial line buffered for the next `feed()`.
 */
export class SSEParser {
  private buffer = "";

  /** Push a raw chunk; returns the `data:` payloads for newly completed lines. */
  feed(chunk: string): string[] {
    this.buffer += chunk;
    const payloads: string[] = [];
    let newlineIndex = this.buffer.indexOf("\n");
    while (newlineIndex !== -1) {
      const line = this.buffer.slice(0, newlineIndex);
      this.buffer = this.buffer.slice(newlineIndex + 1);
      const payload = extractData(line);
      if (payload !== null) payloads.push(payload);
      newlineIndex = this.buffer.indexOf("\n");
    }
    return payloads;
  }

  /** Emit any `data:` payload left in a trailing line without a final newline. */
  flush(): string[] {
    const remaining = this.buffer;
    this.buffer = "";
    const payload = extractData(remaining);
    return payload !== null ? [payload] : [];
  }
}

/** Strip the `data:` prefix (and one optional leading space) per the SSE spec. */
function extractData(rawLine: string): string | null {
  const line = rawLine.replace(/\r$/, "");
  if (!line.startsWith("data:")) return null;
  const value = line.slice(5);
  return value.startsWith(" ") ? value.slice(1) : value;
}

// ─── Transport ────────────────────────────────────────────────────────────────

export interface StreamSSEOptions {
  url: string;
  method?: string;
  headers: Record<string, string>;
  body: string;
  /** Called once for every complete `data:` payload (excluding the prefix). */
  onData: (data: string) => void;
}

/**
 * POST `body` to `url` and stream the SSE response, invoking `onData` for each
 * `data:` payload. Resolves when the stream ends, rejects (with `SSEError`
 * carrying the HTTP status + body) on an HTTP error or network failure.
 */
export function streamSSE(options: StreamSSEOptions): Promise<void> {
  const { url, method = "POST", headers, body, onData } = options;

  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const parser = new SSEParser();
    let processed = 0;

    const pump = () => {
      const { responseText } = xhr;
      if (responseText.length <= processed) return;
      const fresh = responseText.slice(processed);
      processed = responseText.length;
      for (const data of parser.feed(fresh)) onData(data);
    };

    xhr.open(method, url);
    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value);
    }

    xhr.onprogress = () => {
      // Defer HTTP-error handling to onload, where we have the full body.
      if (xhr.status >= 400) return;
      pump();
    };

    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(
          new SSEError(
            `Request failed (${xhr.status})`,
            xhr.status,
            xhr.responseText,
          ),
        );
        return;
      }
      pump();
      for (const data of parser.flush()) onData(data);
      resolve();
    };

    xhr.onerror = () => reject(new SSEError("Network request failed"));
    xhr.ontimeout = () => reject(new SSEError("Request timed out"));

    xhr.send(body);
  });
}
