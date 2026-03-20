import { StyleSheet } from "react-native";
import type { ExtendedTheme } from "@react-navigation/native";

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // ── Header ────────────────────────────────────────────────────────────────
    header: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
      backgroundColor: colors.background,
      gap: 12,
    },
    headerTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitleBlock: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    headerIconWrap: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: colors.primary + "18",
      justifyContent: "center",
      alignItems: "center",
    },
    headerActions: {
      flexDirection: "row",
      gap: 8,
    },
    headerActionBtn: {
      padding: 6,
      borderRadius: 8,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 12,
      color: colors.placeholder,
    },

    // ── Provider selector ─────────────────────────────────────────────────────
    providerRow: {
      flexDirection: "row",
      gap: 8,
    },
    providerPill: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 10,
      alignItems: "center",
      backgroundColor: colors.card,
      borderWidth: 1.5,
      borderColor: colors.borderColor,
    },
    providerPillActive: {
      backgroundColor: colors.primary + "18",
      borderColor: colors.primary,
    },
    providerPillText: {
      fontSize: 12,
      color: colors.placeholder,
    },
    providerPillTextActive: {
      color: colors.primary,
      fontWeight: "700",
    },

    // ── API key config panel ──────────────────────────────────────────────────
    configPanel: {
      marginHorizontal: 16,
      marginTop: 12,
      padding: 16,
      borderRadius: 16,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.borderColor,
      gap: 12,
    },
    configHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    configTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
    },
    configDescription: {
      fontSize: 12,
      color: colors.placeholder,
      lineHeight: 18,
    },
    configInputRow: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
    },
    configInput: {
      flex: 1,
      height: 44,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.borderColor,
      paddingHorizontal: 12,
      fontSize: 13,
      backgroundColor: colors.background,
      color: colors.text,
      fontFamily: "Montserrat-Regular",
    },
    configSaveBtn: {
      height: 44,
      paddingHorizontal: 16,
      borderRadius: 10,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    configSaveBtnText: {
      color: colors.white,
      fontSize: 13,
      fontWeight: "700",
    },

    // ── Message list ──────────────────────────────────────────────────────────
    messageList: {
      flex: 1,
    },
    messageListContent: {
      paddingVertical: 12,
    },

    // ── Empty state ───────────────────────────────────────────────────────────
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      gap: 16,
    },
    emptyIconWrap: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary + "14",
      justifyContent: "center",
      alignItems: "center",
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
    },
    emptySubtitle: {
      fontSize: 14,
      color: colors.placeholder,
      textAlign: "center",
      lineHeight: 20,
    },
    emptyProviderList: {
      gap: 8,
      width: "100%",
    },
    emptyProviderRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    emptyProviderDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    emptyProviderContent: {
      flex: 1,
    },
    emptyProviderName: {
      fontSize: 13,
    },
    emptyProviderHint: {
      fontSize: 11,
      color: colors.placeholder,
    },
    keyboardView: {
      flex: 1,
    },

    // ── Typing indicator ──────────────────────────────────────────────────────
    typingWrapper: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginHorizontal: 16,
      marginVertical: 4,
      gap: 8,
    },
    typingAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary + "22",
      justifyContent: "center",
      alignItems: "center",
    },
    typingBubble: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 18,
      borderBottomLeftRadius: 4,
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 4,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    typingDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: colors.primary,
    },

    // ── Error banner ──────────────────────────────────────────────────────────
    errorBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginHorizontal: 16,
      marginVertical: 6,
      padding: 12,
      borderRadius: 12,
      backgroundColor: colors.danger + "12",
      borderWidth: 1,
      borderColor: colors.danger + "40",
    },
    errorText: {
      flex: 1,
      fontSize: 12,
      color: colors.danger,
      lineHeight: 18,
    },

    // ── Input area ────────────────────────────────────────────────────────────
    inputArea: {
      borderTopWidth: 1,
      borderTopColor: colors.borderColor,
      backgroundColor: colors.background,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 8,
    },
    inputBox: {
      flex: 1,
      minHeight: 44,
      maxHeight: 120,
      borderRadius: 22,
      borderWidth: 1.5,
      borderColor: colors.borderColor,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 15,
      color: colors.text,
      backgroundColor: colors.card,
      fontFamily: "Montserrat-Regular",
    },
    sendBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
    },
    sendBtnActive: {
      backgroundColor: colors.primary,
    },
    sendBtnDisabled: {
      backgroundColor: colors.borderColor,
    },
    inputMeta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 6,
      paddingHorizontal: 4,
    },
    streamToggle: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    streamToggleText: {
      fontSize: 11,
      color: colors.placeholder,
    },
    charCount: {
      fontSize: 11,
      color: colors.placeholder,
    },
  });
};

export default createStyles;
