# GitHub Copilot Workspace Instructions

This file configures GitHub Copilot suggestions for this repository.

---

## Project

React Native 0.84 + TypeScript 5 (strict) boilerplate. Stack: react-navigation v7, reanimated v4, axios, i18next, and a provider-agnostic AI service layer (OpenAI / Anthropic / Gemini).

---

## Always Follow These Rules

### Imports
- Use path aliases, never relative `../../` paths
- Key aliases: `@shared-components`, `@services/*`, `@screens/*`, `@hooks`, `@theme/*`, `@fonts`, `@utils`
- Import from `@services/ai` barrel — never from `src/services/ai/providers/*` directly

### Styling
- `const styles = useMemo(() => createStyles(theme), [theme])` in every component
- Colors from `const { colors } = useTheme()` — never hardcoded hex values
- Style files: co-located `MyComponent.style.ts` using `createStyles(theme: ExtendedTheme)`

### Components
- Text: `TextWrapper` from `@shared-components/text-wrapper/TextWrapper` (never bare `<Text>`)
- Touchables: `RNBounceable` from `@freakycoder/react-native-bounceable` (never `TouchableOpacity`)
- Safe area: `SafeAreaView` from `react-native-safe-area-context` (never from `react-native`)
- New shared components go in `src/shared/components/<name>/RN<Name>.tsx` + `.style.ts`, exported from `index.ts`

### TypeScript
- Props interfaces: `I` prefix (`IRNButtonProps`, `IMyScreenProps`)
- `export type { Foo }` for type-only re-exports
- All locals and parameters must be used (`noUnusedLocals`, `noUnusedParameters` are on)
- Exhaustive switches: `const x: never = val` in the `default` case

### Navigation
- Screen names from `SCREENS` constant (`src/shared/constants/index.ts`) — never raw strings
- Register in `src/navigation/index.tsx`

### AI Service Layer
- `AIConfig.model` is a plain `string` — never default to a specific model name in service code
- Use `useAIChat` for conversations, `useAICompletion` for single completions
- Streaming: `streamMessage()` from `useAIChat` or `streamAIMessage()` from `@services/ai`
- To add a provider: implement `IAIProvider` → add `case` in `AIService.ts` → extend `AIProvider` type

### Scripts
- `npm run start:fresh` — reset Metro cache (required after adding path aliases)
- `npm run lint` — ESLint check before committing

---

## Never Do

- Hardcode color hex values in style files
- Add model name strings (e.g. `"gpt-4o"`) inside the AI service layer
- Store API keys in source files
- Use `<Text>` from react-native directly
- Use `TouchableOpacity` or `Pressable` — use `RNBounceable`
- Use relative imports (`../../`) when a path alias covers it
