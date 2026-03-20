import { StyleSheet, type TextStyle, type ViewStyle } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";

interface Style {
  container: ViewStyle;
  scrollContent: ViewStyle;
  // Header
  header: ViewStyle;
  headerRow: ViewStyle;
  headerTitle: TextStyle;
  headerSubtitle: TextStyle;
  clearBtn: ViewStyle;
  clearBtnText: TextStyle;
  // Section
  sectionBlock: ViewStyle;
  sectionBlockSpaced: ViewStyle;
  sectionTitle: TextStyle;
  // Notification card
  notifCard: ViewStyle;
  notifCardUnread: ViewStyle;
  notifAvatarWrap: ViewStyle;
  notifDot: ViewStyle;
  notifBody: ViewStyle;
  notifTitle: TextStyle;
  notifDescription: TextStyle;
  notifTime: TextStyle;
  notifIconBadge: ViewStyle;
  // Empty state
  emptyState: ViewStyle;
  emptyText: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  const HP = 24;

  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 48,
    },

    /* ---- Header ---- */
    header: {
      paddingHorizontal: HP,
      paddingTop: 20,
      paddingBottom: 20,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    headerTitle: {
      fontSize: 26,
      fontWeight: "700",
      letterSpacing: 0.2,
    },
    headerSubtitle: {
      fontSize: 13,
      letterSpacing: 0.1,
    },
    clearBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 100,
      backgroundColor: colors.primary + "15",
      marginBottom: 2,
    },
    clearBtnText: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.primary,
      letterSpacing: 0.2,
    },

    /* ---- Section label ---- */
    sectionBlock: {
      paddingHorizontal: HP,
      marginBottom: 12,
      marginTop: 4,
    },
    sectionBlockSpaced: {
      paddingHorizontal: HP,
      marginBottom: 12,
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: "700",
      letterSpacing: 0.4,
      textTransform: "uppercase",
    },

    /* ---- Notification card ---- */
    notifCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: HP,
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderColor,
    },
    notifCardUnread: {
      backgroundColor: colors.primary + "07",
    },
    notifAvatarWrap: {
      position: "relative",
      marginRight: 14,
      marginTop: 2,
    },
    notifDot: {
      position: "absolute",
      top: -2,
      right: -2,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: colors.background,
    },
    notifBody: {
      flex: 1,
    },
    notifTitle: {
      fontSize: 14,
      fontWeight: "600",
      letterSpacing: 0.1,
      marginBottom: 3,
    },
    notifDescription: {
      fontSize: 13,
      lineHeight: 19,
      letterSpacing: 0.05,
    },
    notifTime: {
      fontSize: 11,
      marginTop: 6,
      letterSpacing: 0.1,
    },
    notifIconBadge: {
      width: 42,
      height: 42,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
    },

    /* ---- Empty ---- */
    emptyState: {
      alignItems: "center",
      paddingVertical: 48,
      gap: 12,
    },
    emptyText: {
      fontSize: 14,
      letterSpacing: 0.1,
    },
  });
};
