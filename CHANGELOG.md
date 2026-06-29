# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- **AI streaming now works on-device.** All three providers (`openai`,
  `anthropic`, `gemini`) used `response.body.getReader()`, which is `undefined`
  in React Native's `fetch` — `streamMessage` threw `"No response body"` and no
  tokens ever arrived. Streaming now goes through an `XMLHttpRequest`-based SSE
  transport (`src/services/ai/sse.ts`) that React Native supports.
- **SSE tokens split across network chunks are no longer dropped.** A new
  `SSEParser` buffers partial lines across reads, so a `data:` line that arrives
  in two pieces is reassembled instead of silently lost.
- **`@event-emitter` no longer imports the missing `events` module.** It was
  importing Node's `events`, which Metro does not polyfill (and the package was
  not installed), so the documented singleton failed to import. Replaced with a
  small, dependency-free `EventEmitter` with the same public API.
- **`AIConfig.systemPrompt` is now honored.** It was documented but ignored;
  `sendAIMessage` / `streamAIMessage` now prepend it as a system message when no
  system message is already present.
- **TypeScript path aliases resolve.** `@models` and `@event-emitter` were used
  in code/docs but missing from `tsconfig.json`; `@api` and `@local-storage`
  pointed at non-existent folders. Added the missing `tsconfig` paths and real
  stub folders, and fixed the `tsconfig`/RN base `moduleResolution` conflict so
  `tsc --noEmit` runs clean.
- Static asset (`*.png`) type declarations moved to `assets.d.ts` so they remain
  global pattern-ambient modules and `@assets/logo.png` type-resolves.

### Added

- **Test suite** (`__tests__/`): unit tests for the SSE parser, all three
  providers (request shaping, response parsing, error mapping, streaming), the
  service layer + system-prompt injection, the `useAIChat` / `useAICompletion`
  hooks, and the event emitter — plus the existing App smoke test now runs under
  a proper jest setup.
- **Continuous Integration** (`.github/workflows/ci.yml`): typecheck, lint,
  Prettier check, and tests on a Node 22/24 matrix for every push and PR.
- `typecheck`, `lint:fix`, and `format:check` npm scripts; a `LICENSE` file
  (MIT); `CONTRIBUTING.md`; a `CHANGELOG.md`; and GitHub issue/PR templates.
- Typed response shapes for the OpenAI / Anthropic / Gemini wire formats, and
  `toAIError` / `extractApiErrorMessage` helpers exported from `@services/ai`.
- Gemini's `streamMessage` / `sendMessage` now respect `config.baseURL`,
  matching the documented proxy/local-LLM override behavior of the other
  providers.

### Changed

- **ESLint dependencies made explicit.** `@typescript-eslint/parser`,
  `@typescript-eslint/eslint-plugin`, and `eslint-plugin-jest` were required by
  the config but only present transitively; they are now direct devDependencies.
- `package.json` metadata: added `description`, `license`, `author`,
  `repository`, `bugs`, `homepage`, and `keywords`.
- `npm run lint` / `npm run prettier` now invoke ESLint / Prettier directly
  instead of the chalk/ora wrapper scripts (which depended on undeclared deps).
- Husky `pre-commit` runs `typecheck` + `lint`.
- Scoped `LogBox.ignoreAllLogs()` down to an explicit (empty) ignore list so
  real warnings surface during development.
- Removed `route: any` and `useEffect((): any => …)` smells in the navigator.

### Removed

- Dead dependencies: `event`, `metro-react-native-babel-preset`,
  `eslint-plugin-flowtype`, `eslint-plugin-ft-flow`, and the redundant
  `@trivago/prettier-plugin-sort-imports` (kept `@ianvs`).
- Duplicate `.prettierrc.js` (the JSON `.prettierrc` is the single source of
  truth) and the chalk/ora-based `src/scripts/terminal/*.mjs` runners.
