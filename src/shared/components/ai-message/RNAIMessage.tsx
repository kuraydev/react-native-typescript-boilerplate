import React, { useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import fonts from "@fonts";
import type { AIMessage } from "@services/ai/types";
import Text from "@shared-components/text-wrapper/TextWrapper";
import createStyles from "./RNAIMessage.style";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IRNAIMessageProps {
  message: AIMessage;
  /** Show animated cursor — pass true for the last streaming assistant message */
  isStreaming?: boolean;
  /** Whether to show the HH:MM timestamp below the bubble */
  showTimestamp?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

const RNAIMessage: React.FC<IRNAIMessageProps> = ({
  message,
  isStreaming = false,
  showTimestamp = false,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (message.role === "system") {
    return (
      <View style={styles.systemWrapper}>
        <View style={styles.systemBubble}>
          <Text style={styles.systemText}>{message.content}</Text>
        </View>
      </View>
    );
  }

  if (message.role === "user") {
    return (
      <>
        <View style={styles.userWrapper}>
          <View style={styles.userBubble}>
            <Text fontFamily={fonts.montserrat.regular} style={styles.userText}>
              {message.content}
            </Text>
          </View>
        </View>
        {showTimestamp ? (
          <Text style={[styles.timestamp, styles.timestampRight]}>
            {formatTime(message.timestamp)}
          </Text>
        ) : null}
      </>
    );
  }

  // assistant
  return (
    <>
      <View style={styles.assistantWrapper}>
        <View style={styles.assistantAvatar}>
          <Icon
            name="sparkles"
            type={IconType.Ionicons}
            size={16}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.assistantBubble}>
          <Text
            fontFamily={fonts.montserrat.regular}
            style={styles.assistantText}
          >
            {message.content}
            {isStreaming ? " " : ""}
          </Text>
          {isStreaming ? <View style={styles.cursorDot} /> : null}
        </View>
      </View>
      {showTimestamp ? (
        <Text style={[styles.timestamp, styles.timestampLeft]}>
          {formatTime(message.timestamp)}
        </Text>
      ) : null}
    </>
  );
};

export default RNAIMessage;
