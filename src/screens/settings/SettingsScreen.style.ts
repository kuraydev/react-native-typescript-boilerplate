import {
  StyleSheet,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import type { ExtendedTheme } from "@react-navigation/native";

interface Style {
  container: ViewStyle;
  scrollContent: ViewStyle;
  // Header
  header: ViewStyle;
  headerTitle: TextStyle;
  headerSubtitle: TextStyle;
  // App info card
  appCard: ViewStyle;
  appIconWrap: ViewStyle;
  logoImage: ImageStyle;
  appCardContent: ViewStyle;
  appName: TextStyle;
  appVersion: TextStyle;
  // Section
  sectionBlock: ViewStyle;
  sectionTitle: TextStyle;
  // Settings list
  settingsList: ViewStyle;
  settingsListLast: ViewStyle;
  settingsRow: ViewStyle;
  settingsRowLast: ViewStyle;
  settingsIconWrap: ViewStyle;
  settingsLabel: TextStyle;
  settingsChevron: ViewStyle;
  settingsValueText: TextStyle;
  settingsValueBadge: ViewStyle;
  settingsValueBadgeText: TextStyle;
  // Danger
  dangerRow: ViewStyle;
  dangerRowSeparated: ViewStyle;
  dangerIconWrap: ViewStyle;
  dangerLabel: TextStyle;
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
      paddingBottom: 0,
    },

    /* ---- Header ---- */
    header: {
      paddingHorizontal: HP,
      paddingTop: 20,
      paddingBottom: 28,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "700",
      letterSpacing: 0.2,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 13,
      letterSpacing: 0.1,
    },

    /* ---- App info card ---- */
    appCard: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: HP,
      marginBottom: 32,
      padding: 16,
      borderRadius: 20,
      backgroundColor: colors.dynamicBackground,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
      elevation: 3,
    },
    appIconWrap: {
      width: 52,
      height: 52,
      borderRadius: 14,
      marginRight: 14,
      overflow: "hidden",
    },
    logoImage: {
      width: 52,
      height: 52,
    },
    appCardContent: {
      flex: 1,
    },
    appName: {
      fontSize: 15,
      fontWeight: "600",
      letterSpacing: 0.1,
      marginBottom: 3,
    },
    appVersion: {
      fontSize: 12,
      letterSpacing: 0.1,
    },

    /* ---- Section header ---- */
    sectionBlock: {
      paddingHorizontal: HP,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.8,
      textTransform: "uppercase",
    },

    /* ---- Settings list ---- */
    settingsList: {
      marginHorizontal: HP,
      borderRadius: 20,
      backgroundColor: colors.dynamicBackground,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 18,
      elevation: 3,
      overflow: "hidden",
      marginBottom: 28,
    },
    settingsListLast: {
      marginBottom: 0,
    },
    settingsRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderColor,
    },
    settingsRowLast: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    settingsIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
    },
    settingsLabel: {
      flex: 1,
      fontSize: 14,
      fontWeight: "500",
      letterSpacing: 0.1,
    },
    settingsChevron: {
      opacity: 0.4,
    },
    settingsValueText: {
      fontSize: 13,
      marginRight: 8,
      letterSpacing: 0.1,
    },
    settingsValueBadge: {
      paddingHorizontal: 9,
      paddingVertical: 3,
      borderRadius: 100,
      backgroundColor: colors.primary + "14",
      marginRight: 8,
    },
    settingsValueBadgeText: {
      fontSize: 11,
      color: colors.primary,
      fontWeight: "600",
      letterSpacing: 0.2,
    },

    /* ---- Danger zone ---- */
    dangerRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    dangerRowSeparated: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderTopColor: colors.borderColor,
    },
    dangerIconWrap: {
      backgroundColor: "#f43f5e18",
    },
    dangerLabel: {
      flex: 1,
      fontSize: 14,
      fontWeight: "500",
      letterSpacing: 0.1,
      color: "#f43f5e",
    },
  });
};
