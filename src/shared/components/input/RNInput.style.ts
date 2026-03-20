import {
  Platform,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import type { ExtendedTheme } from "@react-navigation/native";
import FontSize from "@font-size";

interface Style {
  container: ViewStyle;
  label: TextStyle;
  inputRow: ViewStyle;
  inputRowError: ViewStyle;
  input: TextStyle;
  iconLeft: ViewStyle;
  iconRight: ViewStyle;
  error: TextStyle;
  hint: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create<Style>({
    container: {
      gap: 6,
    },
    label: {
      fontSize: FontSize.sm,
      letterSpacing: 0.2,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderRadius: 14,
      borderColor: colors.borderColor,
      backgroundColor: colors.dynamicBackground,
      paddingHorizontal: 14,
      minHeight: 52,
    },
    inputRowError: {
      borderColor: colors.danger,
    },
    input: {
      flex: 1,
      fontSize: FontSize.sm,
      color: colors.text,
      fontFamily: "Montserrat-Regular",
      paddingVertical: Platform.OS === "ios" ? 12 : 8,
    },
    iconLeft: {
      marginRight: 10,
    },
    iconRight: {
      marginLeft: 10,
    },
    error: {
      fontSize: FontSize.xs,
      letterSpacing: 0.1,
    },
    hint: {
      fontSize: FontSize.xs,
      letterSpacing: 0.1,
    },
  });
};
