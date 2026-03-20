import { IconType } from "react-native-dynamic-vector-icons";
import type { IFeatureCard, IStackItem, IUtilityItem } from "@services/models";

export const FeatureCards: IFeatureCard[] = [
  {
    icon: "navigate",
    iconType: IconType.Ionicons,
    title: "Navigation",
    description:
      "Stack + Bottom Tab navigator wired up with react-navigation-helpers for push/pop anywhere.",
  },
  {
    icon: "color-palette",
    iconType: IconType.Ionicons,
    title: "Dark / Light Theme",
    description:
      "Automatic system-level theme switching via useColorScheme with a fully typed palette.",
  },
  {
    icon: "language",
    iconType: IconType.Ionicons,
    title: "Localization",
    description:
      "react-native-localization integrated and ready for multi-language string tables.",
  },
  {
    icon: "cloud-download",
    iconType: IconType.Ionicons,
    title: "Axios Hooks",
    description:
      "axios-hooks pre-configured for declarative data fetching with loading/error states.",
  },
  {
    icon: "radio",
    iconType: IconType.Ionicons,
    title: "Event Emitter",
    description:
      "Lightweight cross-component event bus so screens can talk without prop drilling.",
  },
  {
    icon: "text",
    iconType: IconType.Ionicons,
    title: "Montserrat Fonts",
    description:
      "Full Montserrat family (18 weights) bundled and accessible via the fonts helper.",
  },
  {
    icon: "shield-checkmark",
    iconType: IconType.Ionicons,
    title: "TypeScript",
    description:
      "Strict TypeScript config with path aliases, extended themes, and typed navigation.",
  },
  {
    icon: "sparkles",
    iconType: IconType.Ionicons,
    title: "Animations",
    description:
      "react-native-reanimated + react-native-gesture-handler ready to use out of the box.",
  },
  {
    icon: "chatbubble-ellipses",
    iconType: IconType.Ionicons,
    title: "AI Ready",
    description:
      "Built-in service layer for OpenAI, Anthropic Claude & Google Gemini with streaming support.",
  },
];

export const UtilityItems: IUtilityItem[] = [
  {
    icon: "navigate-circle",
    iconType: IconType.Ionicons,
    title: "NavigationService",
    tag: "service",
    description:
      "Call push(), pop(), or navigate() from anywhere — no component ref needed.",
  },
  {
    icon: "text",
    iconType: IconType.Ionicons,
    title: "TextWrapper",
    tag: "component",
    description:
      "Typed h1–h6 + bold/italic props. Swap your font globally in one place.",
  },
  {
    icon: "radio",
    iconType: IconType.Ionicons,
    title: "EventEmitter",
    tag: "service",
    description:
      "Publish and subscribe to events across screens without prop drilling.",
  },
  {
    icon: "cloud-done",
    iconType: IconType.Ionicons,
    title: "useAxios Hook",
    tag: "hook",
    description:
      "Declarative data fetching with built-in loading, error, and refetch states.",
  },
  {
    icon: "at-circle",
    iconType: IconType.Ionicons,
    title: "Path Aliases",
    tag: "config",
    description:
      "Import from @screens, @services, @fonts, @theme and more — no relative paths.",
  },
  {
    icon: "color-wand",
    iconType: IconType.Ionicons,
    title: "Theme Colors",
    tag: "hook",
    description:
      "useTheme() returns a fully typed color palette that flips with dark mode.",
  },
  {
    icon: "earth",
    iconType: IconType.Ionicons,
    title: "Localization",
    tag: "service",
    description:
      "Drop JSON string tables into @localization and switch locale at runtime.",
  },
  {
    icon: "phone-portrait",
    iconType: IconType.Ionicons,
    title: "Safe Area",
    tag: "component",
    description:
      "SafeAreaProvider + SafeAreaView pre-wired so notch/home-bar just work.",
  },
  {
    icon: "sparkles",
    iconType: IconType.Ionicons,
    title: "useAIChat",
    tag: "hook",
    description:
      "Drop-in hook for multi-turn AI conversations with streaming support across providers.",
  },
  {
    icon: "flash",
    iconType: IconType.Ionicons,
    title: "useAICompletion",
    tag: "hook",
    description:
      "Single-shot completion hook — perfect for text generation, summarization or classification.",
  },
  {
    icon: "cloud-outline",
    iconType: IconType.Ionicons,
    title: "AIService",
    tag: "service",
    description:
      "Provider-agnostic factory: sendAIMessage() & streamAIMessage() unified across OpenAI, Anthropic, Gemini.",
  },
];

export const StackItems: IStackItem[] = [
  {
    name: "React Native",
    version: "0.84.1",
    icon: "logo-react",
    iconType: IconType.Ionicons,
  },
  {
    name: "TypeScript",
    version: "5.x",
    icon: "code-slash",
    iconType: IconType.Ionicons,
  },
  {
    name: "@react-navigation/native",
    version: "7.x",
    icon: "map",
    iconType: IconType.Ionicons,
  },
  {
    name: "react-native-reanimated",
    version: "4.x",
    icon: "flash",
    iconType: IconType.Ionicons,
  },
  {
    name: "axios + axios-hooks",
    version: "1.x / 5.x",
    icon: "cloud",
    iconType: IconType.Ionicons,
  },
  {
    name: "react-native-vector-icons",
    version: "10.x",
    icon: "shapes",
    iconType: IconType.Ionicons,
  },
  {
    name: "react-native-safe-area-context",
    version: "5.x",
    icon: "phone-portrait",
    iconType: IconType.Ionicons,
  },
  {
    name: "react-native-localization",
    version: "2.x",
    icon: "earth",
    iconType: IconType.Ionicons,
  },
  {
    name: "OpenAI API",
    version: "bring your model",
    icon: "logo-openai",
    iconType: IconType.Ionicons,
  },
  {
    name: "Anthropic Claude",
    version: "bring your model",
    icon: "sparkles",
    iconType: IconType.Ionicons,
  },
  {
    name: "Google Gemini",
    version: "bring your model",
    icon: "diamond",
    iconType: IconType.Ionicons,
  },
];
