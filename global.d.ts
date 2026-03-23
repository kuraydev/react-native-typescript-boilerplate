import { theme } from "./src/shared/theme/themes";

declare module "*.png" {
  const value: number;
  export default value;
}

declare module "@assets/*.png" {
  const value: number;
  export default value;
}

declare module "@react-navigation/native" {
  export type ExtendedTheme = typeof theme;
  export function useTheme(): ExtendedTheme;
}
