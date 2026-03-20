# AGENTS.md

Instruction file for AI coding agents (Windsurf, OpenAI Codex CLI, Gemini CLI, and similar tools). Read this before making any changes.

---

## What This Project Is

A production-ready **React Native + TypeScript** boilerplate. Everything is pre-wired: navigation, dark/light theming, localization, HTTP hooks, animations, and a provider-agnostic AI service layer supporting OpenAI, Anthropic, and Google Gemini.

Stack: React Native 0.84 · React 19 · TypeScript 5 (strict) · react-navigation v7 · reanimated v4 · axios · i18next

---

## Project Layout

```
src/
├── hooks/             # useAIChat, useAICompletion
├── navigation/        # Stack + Bottom Tab wiring
├── screens/           # One folder per screen (Screen.tsx + Screen.style.ts)
├── services/
│   ├── ai/            # AI service layer (providers/, AIService.ts, types.ts)
│   ├── event-emitter/ # Shared event bus
│   └── models/        # Shared TypeScript interfaces
├── shared/
│   ├── components/    # RN-prefixed shared components + barrel index.ts
│   ├── constants/     # SCREENS enum
│   ├── localization/  # i18next (en + tr-TR)
│   └── theme/         # palette, LightTheme, DarkTheme, fonts, font-size
└── utils/
```

---

## Key Rules

### Imports
- Always use path aliases, never deep relative paths (`../../..`)
- Common aliases: `@shared-components`, `@services/*`, `@screens/*`, `@hooks`, `@theme/*`, `@fonts`, `@utils`
- Import from `@services/ai` barrel — never from individual provider files

### Styling
- Call `useMemo(() => createStyles(theme), [theme])` in every component that needs styles
- `createStyles(theme: ExtendedTheme)` returns a `StyleSheet.create({...})`
- Colors always come from `const { colors } = useTheme()` — never hardcoded

### Components
- Text: always `TextWrapper` from `@shared-components/text-wrapper/TextWrapper`
- Touchables: always `RNBounceable` from `@freakycoder/react-native-bounceable`
- Safe area: `SafeAreaView` from `react-native-safe-area-context`
- Shared component files go in `src/shared/components/<name>/RN<Name>.tsx` + `RN<Name>.style.ts`
- Export new components from `src/shared/components/index.ts`

### TypeScript
- Props interfaces use `I` prefix: `IMyComponentProps`
- `noUnusedLocals` and `noUnusedParameters` are enforced — every declared identifier must be used
- Use `export type { Foo }` for type-only re-exports
- Exhaustive switch default: `const x: never = val; throw new Error(...)`

### Navigation
- Screen names live only in `SCREENS` (`src/shared/constants/index.ts`)
- Register screens in `src/navigation/index.tsx`

### AI Service Layer
- `AIConfig.model` is a plain string — the developer supplies it; the service never hardcodes model names
- To add a new AI provider: implement `IAIProvider`, add a `case` in `createProvider()` in `AIService.ts`
- Streaming: use `streamAIMessage()` or `useAIChat().streamMessage()` — tokens arrive via `onToken` callback
- API keys stay in component state only — never in source files

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start Metro bundler |
| `npm run start:fresh` | Metro with cache reset (use after adding path aliases) |
| `npm run ios` | iOS simulator |
| `npm run android` | Android emulator |
| `npm run lint` | ESLint |
| `npm test` | Jest |

---

## Extending This Boilerplate

| Task | Files to touch |
|---|---|
| Add a screen | `SCREENS` const → `navigation/index.tsx` → new `screens/<name>/` folder |
| Add a shared component | `shared/components/<name>/RN<Name>.tsx` + style + barrel export |
| Add an AI provider | `services/ai/providers/<name>.ts` → `AIService.ts` → `types.ts` |
| Add a path alias | `babel.config.js` + `tsconfig.json` → run `npm run start:fresh` |
| Add a translation key | `shared/localization/index.ts` (en + tr-TR objects) |
