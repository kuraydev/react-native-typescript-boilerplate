module.exports = {
  preset: 'react-native',
  // Only files ending in .test.ts(x) are suites, so shared fixtures can live
  // under __tests__/helpers without jest trying to run them as empty suites.
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  // The RN preset only transforms react-native* by default; the app also pulls
  // in ESM-published packages that must be transpiled for jest.
  transformIgnorePatterns: [
    'node_modules/(?!(?:jest-)?(?:@react-native|react-native|@react-native-community|@react-navigation|react-native-.*|react-navigation-helpers|@freakycoder/.*)/)',
  ],
};
