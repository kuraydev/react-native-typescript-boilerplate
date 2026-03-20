import React from "react";
import {
  ActivityIndicator,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import FontSize from "@font-size";
import fonts from "@fonts";
import RNBounceable from "@freakycoder/react-native-bounceable";
import Text from "@shared-components/text-wrapper/TextWrapper";

export type ButtonVariant = "filled" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface IRNButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  color?: string;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const SIZE_CONFIG: Record<
  ButtonSize,
  {
    paddingVertical: number;
    paddingHorizontal: number;
    fontSize: number;
    borderRadius: number;
  }
> = {
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: FontSize.sm,
    borderRadius: 10,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    fontSize: FontSize.md,
    borderRadius: 14,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    fontSize: FontSize.base,
    borderRadius: 16,
  },
};

const RNButton: React.FC<IRNButtonProps> = ({
  label,
  onPress,
  variant = "filled",
  size = "md",
  loading = false,
  disabled = false,
  color,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  const activeColor = color ?? colors.primary;
  const { paddingVertical, paddingHorizontal, fontSize, borderRadius } =
    SIZE_CONFIG[size];

  const containerStyle: ViewStyle = {
    paddingVertical,
    paddingHorizontal,
    borderRadius,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    opacity: disabled || loading ? 0.55 : 1,
    alignSelf: fullWidth ? "stretch" : "flex-start",
    ...(variant === "filled" && { backgroundColor: activeColor }),
    ...(variant === "outline" && {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: activeColor,
    }),
    ...(variant === "ghost" && { backgroundColor: "transparent" }),
  };

  const labelColor = variant === "filled" ? colors.white : activeColor;

  return (
    <RNBounceable
      style={[containerStyle, style]}
      onPress={disabled || loading ? undefined : onPress}
    >
      {loading ? <ActivityIndicator size="small" color={labelColor} /> : null}
      <Text
        fontFamily={fonts.montserrat.semiBold}
        color={labelColor}
        style={[{ fontSize }, textStyle]}
      >
        {label}
      </Text>
    </RNBounceable>
  );
};

export default RNButton;
