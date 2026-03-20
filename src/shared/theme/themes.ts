import { DefaultTheme, type ExtendedTheme } from "@react-navigation/native";

export const palette = {
  primary: "#4A6CF7",
  secondary: "#f97316",
  background: "#f4f6fb",
  white: "#fff",
  black: "#0e1117",
  button: "#1c1e21",
  shadow: "#8b9ab0",
  text: "#1e2533",
  borderColor: "#e6eaf2",
  borderColorDark: "#2c313d",
  placeholder: "#95a0b4",
  danger: "rgb(208, 2, 27)",
  title: "rgb(102, 102, 102)",
  separator: "rgb(194, 194, 195)",
  highlight: "rgb(199, 198, 203)",
  blackOverlay: "rgba(0,0,0,0.6)",
  iconWhite: "#fff",
  iconBlack: "#0e1117",
  dynamicWhite: "#fff",
  dynamicBlack: "#181c27",
  dynamicBackground: "#ffffff",
  transparent: "transparent",
  calpyse: "#2b7488",
};

export const LightTheme: ExtendedTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    ...palette,
  },
};

export const DarkTheme: ExtendedTheme = {
  ...DefaultTheme,
  colors: {
    ...LightTheme.colors,
    background: palette.black,
    foreground: palette.white,
    text: "#e8edf5",
    tabBar: palette.black,
    iconWhite: palette.black,
    iconBlack: palette.white,
    dynamicBackground: palette.dynamicBlack,
    shadow: palette.transparent,
    borderColor: palette.borderColorDark,
    placeholder: "#6b7894",
  },
};
