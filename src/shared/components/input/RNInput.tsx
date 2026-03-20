import React, { useMemo } from "react";
import {
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import fonts from "@fonts";
import Text from "@shared-components/text-wrapper/TextWrapper";
import createStyles from "./RNInput.style";

export interface IRNInputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

const RNInput: React.FC<IRNInputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  labelStyle,
  inputStyle,
  ...rest
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text
          fontFamily={fonts.montserrat.medium}
          color={colors.text}
          style={[styles.label, labelStyle]}
        >
          {label}
        </Text>
      ) : null}

      <View style={[styles.inputRow, error ? styles.inputRowError : undefined]}>
        {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={colors.placeholder}
          {...rest}
        />
        {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
      </View>

      {error ? (
        <Text style={styles.error} color={colors.danger}>
          {error}
        </Text>
      ) : null}

      {!error && hint ? (
        <Text style={styles.hint} color={colors.placeholder}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
};

export default RNInput;
