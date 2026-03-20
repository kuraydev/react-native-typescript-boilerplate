const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  h6: 16,
  h5: 18,
  h4: 20,
  h3: 24,
  h2: 28,
  h1: 32,
} as const;

export type FontSizeKey = keyof typeof FontSize;

export default FontSize;
