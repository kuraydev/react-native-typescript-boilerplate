import React, { useMemo } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import RNBounceable from "@freakycoder/react-native-bounceable";
import type { IFeatureCard } from "@services/models";
import Text from "@shared-components/text-wrapper/TextWrapper";
import createStyles from "./CardItem.style";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface ICardItemProps {
  style?: CustomStyleProp;
  data: IFeatureCard;
  onPress?: () => void;
}

const CardItem: React.FC<ICardItemProps> = ({ style, data, onPress }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { icon, iconType, title, description } = data;

  return (
    <RNBounceable style={[styles.container, style]} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Icon
          name={icon}
          type={iconType as IconType}
          color={colors.primary}
          size={28}
        />
      </View>
      <Text h5 bold color={colors.text} style={styles.titleTextStyle}>
        {title}
      </Text>
      <Text
        color={colors.placeholder}
        style={styles.descriptionTextStyle}
        numberOfLines={3}
      >
        {description}
      </Text>
    </RNBounceable>
  );
};

export default CardItem;
