# CLAUDE.md — AI Agent Instructions

This file is read automatically by Claude Code and other AI coding assistants when working in this repository. Keep it up to date as the project evolves.

---

## Project Overview

**react-native-typescript-boilerplate** is a production-ready React Native starter built with TypeScript. It ships with navigation, theming, localization, HTTP hooks, animations, and a provider-agnostic AI service layer (OpenAI, Anthropic Claude, Google Gemini) — all wired up and ready to extend.

- **React Native**: 0.84.1 · **React**: 19.x · **TypeScript**: 5.x (strict)
- **Navigation**: react-navigation v7 (Stack + Bottom Tabs)
- **Animations**: react-native-reanimated v4 + react-native-gesture-handler v2
- **HTTP**: axios + axios-hooks
- **i18n**: i18next + react-i18next
- **Icons**: react-native-vector-icons + react-native-dynamic-vector-icons

---

## Directory Structure

```
src/
├── assets/            # Fonts (Montserrat 18 weights) and splash image
├── hooks/             # Custom React hooks (useAIChat, useAICompletion)
├── navigation/        # Stack + Bottom Tab navigator wiring
├── screens/           # One folder per screen, co-located styles
│   ├── ai-chat/       # AI Chat screen (demo for AI service layer)
│   ├── detail/
│   ├── home/
│   ├── notification/
│   ├── search/
│   └── settings/
├── services/
│   ├── ai/            # Provider-agnostic AI service layer
│   │   ├── providers/ # openai.ts · anthropic.ts · gemini.ts
│   │   ├── AIService.ts
│   │   ├── index.ts
│   │   └── types.ts
│   ├── event-emitter/ # Shared EventEmitter singleton
│   └── models/        # Shared TypeScript interfaces for screens
├── shared/
│   ├── components/    # Reusable RN* components + barrel index.ts
│   ├── constants/     # SCREENS enum
│   ├── localization/  # i18next setup (en + tr-TR)
│   └── theme/         # palette, LightTheme, DarkTheme, fonts, font-size
└── utils/             # capitalizeFirstLetter, generateRandomNumber
```

---

## Path Aliases

All aliases are defined in both `babel.config.js` (Metro) and `tsconfig.json` (TypeScript). Always prefer aliases over relative paths.

| Alias | Resolves to |
|---|---|
| `@shared-components` | `src/shared/components` |
| `@shared-constants` | `src/shared/constants` |
| `@services/*` | `src/services/*` |
| `@screens/*` | `src/screens/*` |
| `@hooks` | `src/hooks/index` |
| `@models` | `src/services/models` |
| `@theme/*` | `src/shared/theme/*` |
| `@fonts` | `src/shared/theme/fonts` |
| `@font-size` | `src/shared/theme/font-size` |
| `@colors` | `src/shared/theme/colors` |
| `@utils` | `src/utils` |
| `@assets` | `src/assets` |
| `@event-emitter` | `src/services/event-emitter` |
| `@api` | `src/services/api/index` *(stub — create if needed)* |
| `@local-storage` | `src/services/local-storage` *(stub — create if needed)* |

> After adding a new alias, run `npm run start:fresh` to reset Metro's cache.

---

## AI Service Layer

Located in `src/services/ai/`. The layer is **provider-agnostic** — the same API works for OpenAI, Anthropic, and Gemini. Model names are never hardcoded; the developer passes whatever model string their API key supports.

### Core types (`src/services/ai/types.ts`)

```typescript
interface AIConfig {
  provider: "openai" | "anthropic" | "gemini";
  apiKey: string;
  model?: string;       // pass any model string — no defaults enforced
  temperature?: number; // default 0.7 in providers
  maxTokens?: number;   // default 1024 in providers
  systemPrompt?: string;
  baseURL?: string;     // override for proxies or local LLMs
}

interface AIMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}
```

### Service functions (`src/services/ai/AIService.ts`)

```typescript
// Full response (awaits complete reply)
sendAIMessage(messages: AIMessage[], config: AIConfig): Promise<AIChatResponse>

// Streaming (tokens arrive via callbacks)
streamAIMessage(messages: AIMessage[], config: AIConfig, callbacks: AIStreamCallbacks): Promise<void>

// Helpers
buildUserMessage(content: string): AIMessage
buildSystemMessage(content: string): AIMessage
```

### Hooks (`src/hooks/`)

```typescript
// Multi-turn conversation with history management
const { messages, isLoading, isStreaming, error, sendMessage, streamMessage, clearMessages, setSystemPrompt } =
  useAIChat({ config, initialMessages?, onResponse?, onError? });

// Single-shot completion
const { complete, result, isLoading, error, reset } =
  useAICompletion({ config, systemPrompt? });
```

### Adding a new AI provider

1. Create `src/services/ai/providers/<name>.ts` implementing `IAIProvider`
2. Add a `case "<name>":` in the `createProvider()` switch in `AIService.ts`
3. Add `"<name>"` to the `AIProvider` union type in `types.ts`
4. Add an entry to `AI_PROVIDER_LABELS` and `AI_BASE_URLS` in `types.ts`

---

## Code Conventions

### File naming
- React components: `PascalCase.tsx` + `PascalCase.style.ts` in the same directory
- Shared components prefix: `RN` (e.g. `RNButton`, `RNAIMessage`)
- Non-component TS files: `camelCase.ts`

### Styling
- Always call `const styles = useMemo(() => createStyles(theme), [theme])` inside the component
- `createStyles` receives the full `ExtendedTheme` object and returns a `StyleSheet`
- Never hardcode color values — always use `colors.*` from `useTheme()`

### Theme access
```typescript
const theme = useTheme();   // returns ExtendedTheme (see global.d.ts)
const { colors } = theme;
// Available: colors.primary, colors.secondary, colors.text, colors.placeholder,
//            colors.background, colors.card, colors.borderColor, colors.danger,
//            colors.white, colors.black, colors.shadow, ...full palette
```

### Components
- Use `RNBounceable` (from `@freakycoder/react-native-bounceable`) for all touchable elements
- Use `TextWrapper` (`@shared-components/text-wrapper/TextWrapper`) for all text — never bare `<Text>`
- Use `SafeAreaView` from `react-native-safe-area-context` (not from `react-native`)

### TypeScript
- Props interfaces use the `I` prefix: `IRNButtonProps`, `IRNAIMessageProps`
- Use `export type { Foo }` for type-only re-exports
- The config has `noUnusedLocals` and `noUnusedParameters` — every declared variable must be used
- Exhaustive switches: add `const x: never = val` in the `default` case

### Imports (enforced by Prettier sort-imports)
1. External packages
2. Path alias imports (`@services/...`, `@shared-components/...`, etc.)
3. Relative imports (only when no alias covers it)

---

## Navigation

Screen name strings live in `SCREENS` (`src/shared/constants/index.ts`). To add a new screen:

1. Add the key to `SCREENS`
2. Import the screen component in `src/navigation/index.tsx`
3. Add it as `<Tab.Screen>` or `<Stack.Screen>`
4. Add its tab icon case in `renderTabIcon` if it's a tab

---

## Scripts

```bash
npm start            # Start Metro bundler
npm run start:fresh  # Start Metro with cache reset (required after adding aliases)
npm run ios          # Run on iOS simulator
npm run android      # Run on Android emulator
npm run lint         # ESLint
npm test             # Jest
```

---

## What to Avoid

- **Never** hardcode hex color strings in component or style files
- **Never** use relative `../../` imports where a path alias exists
- **Never** import directly from provider files (`src/services/ai/providers/openai.ts`) — use the `@services/ai` barrel
- **Never** use bare `<Text>` from react-native — use `TextWrapper`
- **Never** use `TouchableOpacity` — use `RNBounceable`
- **Never** add model name strings (e.g. `"gpt-4o"`) to the AI service layer — the developer provides them via `AIConfig.model`
- **Never** commit API keys — the AI chat screen stores them in component state only
