# Contributing

Thanks for your interest in improving this boilerplate! This repo is a
clone-and-go starter template, so contributions that keep it lean, correct, and
well-documented are especially valuable.

## Getting set up

```sh
git clone https://github.com/kuraydev/react-native-typescript-boilerplate.git
cd react-native-typescript-boilerplate
npm install
```

iOS only:

```sh
cd ios && pod install && cd ..
```

## Before you open a PR

Run the same gates CI runs — all four must pass:

```sh
npm run typecheck     # tsc --noEmit
npm run lint          # eslint .
npm run format:check  # prettier --check
npm test              # jest
```

`npm run lint:fix` and `npm run prettier` auto-fix lint/format issues.

A Husky `pre-commit` hook runs `typecheck` + `lint` automatically, and
`commit-msg` validates your commit message.

## Commit messages

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/)
(enforced by `commitlint`). Allowed types: `feat`, `fix`, `chore`, `docs`,
`style`, `refactor`, `perf`, `test`, `ci`, `revert`.

```
feat: add Mistral provider to the AI service layer
fix: buffer SSE lines split across network chunks
docs: document the New Architecture requirement
```

## Guidelines

- **TypeScript:** keep `strict` happy. Prefer typed wire shapes over `as any`.
- **Path aliases:** prefer aliases (`@services/ai`, `@hooks`, `@theme`, …) over
  deep relative imports. Add a new alias to **both** `babel.config.js` and
  `tsconfig.json`, then restart Metro with `npm run start:fresh`.
- **AI providers:** implement `IAIProvider` and keep the `onToken` / `onComplete`
  / `onError` callback contract stable. Reuse `streamSSE` from
  `@services/ai` for streaming so line-buffering stays correct.
- **Tests:** add/adjust tests under `__tests__/` for any behavior change. Mock
  `fetch` for non-streaming paths and the provided `MockXHR` helper for streaming.
- **Public surface:** this template's de-facto API is its path aliases, hook
  return shapes, and AI service exports. Avoid renaming them without a clear,
  documented reason.

## Reporting bugs / requesting features

Use the issue templates under `.github/ISSUE_TEMPLATE`. For bugs, include your
RN/Node/Xcode versions and a minimal reproduction.
