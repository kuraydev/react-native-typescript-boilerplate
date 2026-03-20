import { StyleSheet } from "react-native";
import type { ExtendedTheme } from "@react-navigation/native";

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    // ── User bubble ───────────────────────────────────────────────────────────
    userWrapper: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginVertical: 4,
      marginHorizontal: 16,
    },
    userBubble: {
      backgroundColor: colors.primary,
      borderRadius: 18,
      borderBottomRightRadius: 4,
      paddingHorizontal: 14,
      paddingVertical: 10,
      maxWidth: "78%",
    },
    userText: {
      color: colors.white,
      fontSize: 15,
      lineHeight: 22,
    },

    // ── Assistant bubble ──────────────────────────────────────────────────────
    assistantWrapper: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "flex-end",
      marginVertical: 4,
      marginHorizontal: 16,
      gap: 8,
    },
    assistantAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary + "22",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 2,
    },
    assistantBubble: {
      backgroundColor: colors.card,
      borderRadius: 18,
      borderBottomLeftRadius: 4,
      paddingHorizontal: 14,
      paddingVertical: 10,
      maxWidth: "78%",
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    assistantText: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 22,
    },

    // ── Cursor (streaming animation) ──────────────────────────────────────────
    cursorDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.primary,
      marginLeft: 2,
      alignSelf: "flex-end",
      marginBottom: 4,
    },

    // ── System message ────────────────────────────────────────────────────────
    systemWrapper: {
      alignItems: "center",
      marginVertical: 8,
      marginHorizontal: 24,
    },
    systemBubble: {
      backgroundColor: colors.primary + "12",
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    systemText: {
      color: colors.placeholder,
      fontSize: 12,
      fontStyle: "italic",
      textAlign: "center",
    },

    // ── Timestamp ─────────────────────────────────────────────────────────────
    timestamp: {
      fontSize: 11,
      color: colors.placeholder,
      marginTop: 4,
      marginHorizontal: 18,
    },
    timestampRight: {
      textAlign: "right",
    },
    timestampLeft: {
      marginLeft: 40,
    },
  });
};

export default createStyles;
