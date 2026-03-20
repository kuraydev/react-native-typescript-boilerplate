import { StyleSheet, type TextStyle, type ViewStyle } from "react-native";
import type { ExtendedTheme } from "@react-navigation/native";

interface Style {
  container: ViewStyle;
  iconContainer: ViewStyle;
  titleTextStyle: TextStyle;
  descriptionTextStyle: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      width: 190,
      padding: 18,
      marginRight: 14,
      borderRadius: 22,
      backgroundColor: colors.dynamicBackground,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 18,
      elevation: 4,
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary + "14",
      marginBottom: 14,
    },
    titleTextStyle: {
      marginBottom: 7,
      letterSpacing: 0.1,
    },
    descriptionTextStyle: {
      fontSize: 12,
      lineHeight: 18,
      letterSpacing: 0.05,
    },
  });
};
