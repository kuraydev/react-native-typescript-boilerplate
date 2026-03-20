import React from "react";
import {
  ActivityIndicator,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@react-navigation/native";

export interface IRNLoadingIndicatorProps {
  size?: "small" | "large";
  color?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  style?: StyleProp<ViewStyle>;
}

const RNLoadingIndicator: React.FC<IRNLoadingIndicatorProps> = ({
  size = "large",
  color,
  fullScreen = false,
  overlay = false,
  style,
}) => {
  const { colors } = useTheme();
  const indicatorColor = color ?? colors.primary;

  const containerStyle: ViewStyle = fullScreen
    ? {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: overlay ? colors.blackOverlay : colors.background,
      }
    : {
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      };

  return (
    <View style={[containerStyle, style]}>
      <ActivityIndicator size={size} color={indicatorColor} />
    </View>
  );
};

export default RNLoadingIndicator;
