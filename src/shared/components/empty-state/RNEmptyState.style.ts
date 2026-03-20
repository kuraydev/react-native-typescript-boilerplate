import { StyleSheet, type TextStyle, type ViewStyle } from "react-native";
import type { ExtendedTheme } from "@react-navigation/native";
import FontSize from "@font-size";

interface Style {
  container: ViewStyle;
  iconWrap: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  actionButton: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create<Style>({
    container: {
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
    },
    iconWrap: {
      width: 88,
      height: 88,
      borderRadius: 44,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.borderColor,
      marginBottom: 20,
    },
    title: {
      fontSize: FontSize.lg,
      textAlign: "center",
      marginBottom: 8,
      letterSpacing: 0.2,
    },
    subtitle: {
      fontSize: FontSize.sm,
      textAlign: "center",
      lineHeight: 20,
      marginBottom: 24,
      letterSpacing: 0.1,
    },
    actionButton: {
      marginTop: 8,
    },
  });
};
