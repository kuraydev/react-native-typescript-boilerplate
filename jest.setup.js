/* eslint-disable no-undef */
// Jest setup: mock the native modules the app touches so component/integration
// tests can render without a native runtime. Pure logic tests (AI service, SSE,
// hooks) don't need these, but the App smoke test does.

require('react-native-gesture-handler/jestSetup');

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

jest.mock('react-native-splash-screen', () => ({
  hide: jest.fn(),
  show: jest.fn(),
}));

jest.mock('react-native-dynamic-vector-icons', () => {
  const React = require('react');
  const MockIcon = props => React.createElement('Icon', props, null);
  return {
    __esModule: true,
    default: MockIcon,
    IconType: { Ionicons: 'Ionicons' },
  };
});

jest.mock('@freakycoder/react-native-bounceable', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: props => React.createElement('Bounceable', props, props.children),
  };
});

jest.mock('@freakycoder/react-native-helpers', () => ({
  isAndroid: false,
  isIOS: true,
}));
