import React from "react";
import TestRenderer, { act } from "react-test-renderer";

export interface RenderHookResult<T> {
  result: { current: T };
  rerender: () => void;
  unmount: () => void;
}

/**
 * Minimal `renderHook` built on react-test-renderer. The hooks under test do
 * not render any React Native host components, so this avoids pulling the full
 * native testing stack into pure-logic hook tests.
 */
export function renderHook<T>(useHook: () => T): RenderHookResult<T> {
  const result = { current: undefined as unknown as T };

  function HookHost() {
    result.current = useHook();
    return null;
  }

  let renderer!: TestRenderer.ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(<HookHost />);
  });

  return {
    result,
    rerender: () => act(() => renderer.update(<HookHost />)),
    unmount: () => act(() => renderer.unmount()),
  };
}

export { act };
