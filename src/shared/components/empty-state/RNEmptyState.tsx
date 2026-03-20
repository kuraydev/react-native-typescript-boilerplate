import React, { useMemo } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import fonts from "@fonts";
import RNButton from "@shared-components/button/RNButton";
import Text from "@shared-components/text-wrapper/TextWrapper";
import createStyles from "./RNEmptyState.style";

export interface IRNEmptyStateProps {
  icon?: string;
  iconType?: string;
  iconSize?: number;
  iconColor?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

const RNEmptyState: React.FC<IRNEmptyStateProps> = ({
  icon = "alert-circle-outline",
  iconType = "Ionicons",
  iconSize = 48,
  iconColor,
  title,
  subtitle,
  actionLabel,
  onAction,
  style,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const activeIconColor = iconColor ?? colors.placeholder;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconWrap}>
        <Icon
          name={icon}
          type={iconType as IconType}
          color={activeIconColor}
          size={iconSize}
        />
      </View>

      <Text
        fontFamily={fonts.montserrat.semiBold}
        color={colors.text}
        style={styles.title}
      >
        {title}
      </Text>

      {subtitle ? (
        <Text
          color={colors.placeholder}
          style={styles.subtitle}
          numberOfLines={3}
        >
          {subtitle}
        </Text>
      ) : null}

      {actionLabel && onAction ? (
        <RNButton
          label={actionLabel}
          onPress={onAction}
          style={styles.actionButton}
        />
      ) : null}
    </View>
  );
};

export default RNEmptyState;
