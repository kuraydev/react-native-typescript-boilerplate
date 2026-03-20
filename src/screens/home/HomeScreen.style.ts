import { StyleSheet, type TextStyle, type ViewStyle } from "react-native";
import { ExtendedTheme } from "@react-navigation/native";

interface Style {
  container: ViewStyle;
  scrollContent: ViewStyle;
  // Header
  header: ViewStyle;
  headerTitleBlock: ViewStyle;
  badgeRow: ViewStyle;
  badge: ViewStyle;
  badgeText: TextStyle;
  subtitleText: TextStyle;
  headerIcon: ViewStyle;
  headerIconRing: ViewStyle;
  // Section labels
  sectionLabelBlock: ViewStyle;
  sectionSubtitle: TextStyle;
  // Feature cards
  featureSection: ViewStyle;
  featureList: ViewStyle;
  // Utilities
  utilitiesSection: ViewStyle;
  utilitiesGrid: ViewStyle;
  utilityCard: ViewStyle;
  utilityIconWrap: ViewStyle;
  utilityCardContent: ViewStyle;
  utilityTitleRow: ViewStyle;
  utilityTitle: TextStyle;
  utilityTag: ViewStyle;
  utilityTagText: TextStyle;
  utilityDescription: TextStyle;
  // Tech stack
  stackSection: ViewStyle;
  stackList: ViewStyle;
  stackRow: ViewStyle;
  stackRowLast: ViewStyle;
  stackIconWrap: ViewStyle;
  stackName: TextStyle;
  versionBadge: ViewStyle;
  versionText: TextStyle;
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: HP,
      paddingTop: 16,
      paddingBottom: 32,
    },
    headerTitleBlock: {
      flex: 1,
    },
    badgeRow: {
      flexDirection: "row",
      marginBottom: 14,
    },
    badge: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 100,
      backgroundColor: colors.primary + "15",
    },
    badgeText: {
      fontSize: 11,
      color: colors.primary,
      fontWeight: "700",
      letterSpacing: 0.3,
    },
    subtitleText: {
      marginTop: 8,
      fontSize: 13,
      lineHeight: 19,
      letterSpacing: 0.1,
    },
    headerIcon: {
      marginLeft: 20,
    },
    headerIconRing: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary + "12",
    },

    /* ---- Section labels ---- */
    sectionLabelBlock: {
      paddingHorizontal: HP,
      marginBottom: 16,
      gap: 3,
    },
    sectionSubtitle: {
      fontSize: 12,
      letterSpacing: 0.1,
    },

    /* ---- Feature cards ---- */
    featureSection: {
      marginBottom: 36,
    },
    featureList: {
      paddingLeft: HP,
      paddingRight: HP - 8,
    },

    /* ---- Utilities ---- */
    utilitiesSection: {
      marginBottom: 36,
    },
    utilitiesGrid: {
      paddingHorizontal: HP,
      gap: 12,
    },
    utilityCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      padding: 16,
      borderRadius: 18,
      backgroundColor: colors.dynamicBackground,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
      elevation: 3,
    },
    utilityIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
      marginTop: 1,
      flexShrink: 0,
    },
    utilityCardContent: {
      flex: 1,
    },
    utilityTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 5,
      flexWrap: "wrap",
    },
    utilityTitle: {
      fontSize: 14,
      letterSpacing: 0.1,
    },
    utilityTag: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 100,
    },
    utilityTagText: {
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 0.3,
      textTransform: "uppercase",
    },
    utilityDescription: {
      fontSize: 12,
      lineHeight: 18,
      letterSpacing: 0.05,
    },

    /* ---- Tech stack ---- */
    stackSection: {
      marginBottom: 8,
    },
    stackList: {
      marginHorizontal: HP,
      borderRadius: 20,
      backgroundColor: colors.dynamicBackground,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 18,
      elevation: 3,
      overflow: "hidden",
    },
    stackRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderColor,
    },
    stackRowLast: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    stackIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary + "13",
      marginRight: 14,
    },
    stackName: {
      flex: 1,
      fontSize: 13,
      fontWeight: "500",
      letterSpacing: 0.1,
    },
    versionBadge: {
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: 100,
      backgroundColor: colors.primary + "12",
    },
    versionText: {
      fontSize: 11,
      color: colors.primary,
      fontWeight: "600",
    },
  });
};
