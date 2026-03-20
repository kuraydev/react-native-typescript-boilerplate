/**
 * ? Local Imports
 */
import React, { useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import RNBounceable from "@freakycoder/react-native-bounceable";
import Text from "@shared-components/text-wrapper/TextWrapper";
import createStyles from "./DetailScreen.style";

const DetailScreen: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text h1 color={colors.text}>
        Detail Screen
      </Text>
      <RNBounceable
        style={styles.buttonStyle}
        onPress={() => NavigationService.goBack()}
      >
        <Text color={colors.white}>Go back to Home</Text>
      </RNBounceable>
    </View>
  );
};

export default DetailScreen;
