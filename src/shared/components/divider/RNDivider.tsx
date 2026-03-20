import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "@react-navigation/native";
import FontSize from "@font-size";
import Text from "@shared-components/text-wrapper/TextWrapper";

export interface IRNDividerProps {
  label?: string;
  orientation?: "horizontal" | "vertical";
  color?: string;
  thickness?: number;
  style?: StyleProp<ViewStyle>;
}

const S = StyleSheet.create({
  stretch: { alignSelf: "stretch" },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  flex: { flex: 1 },
});

const RNDivider: React.FC<IRNDividerProps> = ({
  label,
  orientation = "horizontal",
  color,
  thickness = 1,
  style,
}) => {
  const { colors } = useTheme();
  const dividerColor = color ?? colors.borderColor;

  if (orientation === "vertical") {
    return (
      <View
        style={[
          S.stretch,
          { width: thickness, backgroundColor: dividerColor },
          style,
        ]}
      />
    );
  }

  if (label) {
    return (
      <View style={[S.labelRow, style]}>
        <View
          style={[S.flex, { height: thickness, backgroundColor: dividerColor }]}
        />
        <Text style={{ fontSize: FontSize.xs }} color={colors.placeholder}>
          {label}
        </Text>
        <View
          style={[S.flex, { height: thickness, backgroundColor: dividerColor }]}
        />
      </View>
    );
  }

  return (
    <View
      style={[{ height: thickness, backgroundColor: dividerColor }, style]}
    />
  );
};

export default RNDivider;
