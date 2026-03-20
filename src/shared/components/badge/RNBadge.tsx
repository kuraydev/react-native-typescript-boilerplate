import React from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import FontSize from "@font-size";
import fonts from "@fonts";
import Text from "@shared-components/text-wrapper/TextWrapper";

export type BadgeVariant = "filled" | "outline" | "ghost";
export type BadgeSize = "sm" | "md" | "lg";

export interface IRNBadgeProps {
  label: string;
  variant?: BadgeVariant;
  color?: string;
  size?: BadgeSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const SIZE_CONFIG: Record<
  BadgeSize,
  {
    paddingHorizontal: number;
    paddingVertical: number;
    fontSize: number;
    borderRadius: number;
  }
> = {
  sm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: FontSize.xs,
    borderRadius: 6,
  },
  md: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    fontSize: FontSize.sm,
    borderRadius: 100,
  },
  lg: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    fontSize: FontSize.md,
    borderRadius: 100,
  },
};

const S = StyleSheet.create({
  badgeText: { letterSpacing: 0.3 },
});

const RNBadge: React.FC<IRNBadgeProps> = ({
  label,
  variant = "ghost",
  color,
  size = "md",
  style,
  textStyle,
}) => {
  const { colors } = useTheme();
  const activeColor = color ?? colors.primary;
  const { paddingHorizontal, paddingVertical, fontSize, borderRadius } =
    SIZE_CONFIG[size];

  const containerStyle: ViewStyle = {
    paddingHorizontal,
    paddingVertical,
    borderRadius,
    alignSelf: "flex-start",
    ...(variant === "filled" && { backgroundColor: activeColor }),
    ...(variant === "outline" && {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: activeColor,
    }),
    ...(variant === "ghost" && { backgroundColor: activeColor + "18" }),
  };

  const textColor = variant === "filled" ? colors.white : activeColor;

  return (
    <View style={[containerStyle, style]}>
      <Text
        fontFamily={fonts.montserrat.semiBold}
        color={textColor}
        style={[S.badgeText, { fontSize }, textStyle]}
      >
        {label}
      </Text>
    </View>
  );
};

export default RNBadge;
