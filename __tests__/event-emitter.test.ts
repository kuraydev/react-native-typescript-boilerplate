import eventEmitter, {
  EventEmitter,
} from "../src/services/event-emitter";

describe("EventEmitter", () => {
  it("delivers emitted payloads to registered listeners", () => {
    const ee = new EventEmitter();
    const received: unknown[] = [];
    ee.on("ping", payload => received.push(payload));

    expect(ee.emit("ping", { n: 1 })).toBe(true);
    expect(received).toEqual([{ n: 1 }]);
  });

  it("emit returns false when there are no listeners", () => {
    expect(new EventEmitter().emit("nobody")).toBe(false);
  });

  it("off removes a listener", () => {
    const ee = new EventEmitter();
    const fn = jest.fn();
    ee.on("e", fn);
    ee.off("e", fn);
    ee.emit("e");
    expect(fn).not.toHaveBeenCalled();
    expect(ee.listenerCount("e")).toBe(0);
  });

  it("once fires a listener exactly one time", () => {
    const ee = new EventEmitter();
    const fn = jest.fn();
    ee.once("e", fn);
    ee.emit("e");
    ee.emit("e");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("removeAllListeners clears a single event or everything", () => {
    const ee = new EventEmitter();
    ee.on("a", jest.fn());
    ee.on("b", jest.fn());
    ee.removeAllListeners("a");
    expect(ee.listenerCount("a")).toBe(0);
    expect(ee.listenerCount("b")).toBe(1);
    ee.removeAllListeners();
    expect(ee.listenerCount("b")).toBe(0);
  });

  it("a listener that removes itself mid-emit does not break siblings", () => {
    const ee = new EventEmitter();
    const order: number[] = [];
    const a = () => {
      order.push(1);
      ee.off("e", a);
    };
    const b = () => order.push(2);
    ee.on("e", a);
    ee.on("e", b);
    ee.emit("e");
    expect(order).toEqual([1, 2]);
  });

  it("exports a shared singleton instance", () => {
    expect(eventEmitter).toBeInstanceOf(EventEmitter);
  });
});
