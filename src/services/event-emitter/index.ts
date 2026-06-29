/**
 * Minimal, dependency-free EventEmitter singleton.
 *
 * Previously this imported Node's `events` module, which React Native's Metro
 * bundler does not polyfill by default — the package isn't installed, so the
 * import failed and the documented `@event-emitter` feature never worked on a
 * device. This self-contained implementation keeps the exact same public API
 * (`emit` / `on` / `off` / `once` / `removeAllListeners`) with no native or
 * Node dependency.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Listener = (...args: any[]) => void;

export class EventEmitter {
  private readonly listeners = new Map<string, Set<Listener>>();
  private maxListeners = 10;

  setMaxListeners(max: number): this {
    this.maxListeners = max;
    return this;
  }

  on(event: string, listener: Listener): this {
    const set = this.listeners.get(event) ?? new Set<Listener>();
    set.add(listener);
    this.listeners.set(event, set);
    if (set.size > this.maxListeners) {
      // eslint-disable-next-line no-console
      console.warn(
        `[EventEmitter] "${event}" now has ${set.size} listeners ` +
          `(max ${this.maxListeners}); possible memory leak.`,
      );
    }
    return this;
  }

  addListener(event: string, listener: Listener): this {
    return this.on(event, listener);
  }

  once(event: string, listener: Listener): this {
    const wrapper: Listener = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };
    return this.on(event, wrapper);
  }

  off(event: string, listener: Listener): this {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(listener);
      if (set.size === 0) this.listeners.delete(event);
    }
    return this;
  }

  removeListener(event: string, listener: Listener): this {
    return this.off(event, listener);
  }

  removeAllListeners(event?: string): this {
    if (event === undefined) {
      this.listeners.clear();
    } else {
      this.listeners.delete(event);
    }
    return this;
  }

  listenerCount(event: string): number {
    return this.listeners.get(event)?.size ?? 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: string, ...args: any[]): boolean {
    const set = this.listeners.get(event);
    if (!set || set.size === 0) return false;
    // Copy so listeners removing themselves mid-emit don't skip siblings.
    for (const listener of [...set]) listener(...args);
    return true;
  }
}

const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(50);

export default eventEmitter;
