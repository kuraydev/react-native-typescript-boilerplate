import { theme } from "./src/shared/theme/themes";

// Static asset (*.png / *.jpg / …) ambient module declarations live in
// assets.d.ts so they stay global pattern-ambient modules (this file is a
// module because of the import above, which would scope them).

declare module "@react-navigation/native" {
  export type ExtendedTheme = typeof theme;
  export function useTheme(): ExtendedTheme;
}
