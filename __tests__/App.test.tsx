/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

// The stack navigator schedules a card-transition animation via setTimeout.
// Under real timers that callback fires *after* the test finishes and Jest has
// torn the environment down, which crashes the worker. Fake timers keep that
// pending animation from ever running on the real clock.
jest.useFakeTimers();

test('renders without crashing', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(<App />);
  });

  expect(tree).toBeDefined();

  await ReactTestRenderer.act(async () => {
    tree?.unmount();
  });
});
