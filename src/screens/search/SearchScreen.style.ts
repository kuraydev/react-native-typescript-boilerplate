import { StyleSheet, type TextStyle, type ViewStyle } from "react-native";
import type { ExtendedTheme } from "@react-navigation/native";

interface Style {
  container: ViewStyle;
  scrollContent: ViewStyle;
  // Header
  header: ViewStyle;
  headerTitle: TextStyle;
  headerSubtitle: TextStyle;
  // Search bar
  searchBar: ViewStyle;
  searchInput: ViewStyle;
  searchInputText: TextStyle;
  searchIconWrap: ViewStyle;
  // Section
  sectionBlock: ViewStyle;
  sectionTitle: TextStyle;
  // Categories
  categoriesRow: ViewStyle;
  categoryChip: ViewStyle;
  categoryIconWrap: ViewStyle;
  categoryLabel: TextStyle;
  // Trending rows
  trendingList: ViewStyle;
  trendingRow: ViewStyle;
  trendingRowLast: ViewStyle;
  trendingRank: TextStyle;
  trendingText: TextStyle;
  trendingArrow: ViewStyle;
  // Recent
  recentRow: ViewStyle;
  recentIconWrap: ViewStyle;
  recentText: TextStyle;
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
    headerTitle: {
      fontSize: 26,
      fontWeight: "700",
      letterSpacing: 0.2,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 13,
      letterSpacing: 0.1,
    },

    /* ---- Search bar ---- */
    searchBar: {
      paddingHorizontal: HP,
      marginBottom: 28,
    },
    searchInput: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.dynamicBackground,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
      elevation: 3,
    },
    searchInputText: {
      flex: 1,
      fontSize: 14,
      marginLeft: 12,
      letterSpacing: 0.1,
    },
    searchIconWrap: {
      width: 32,
      height: 32,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary + "15",
    },

    /* ---- Section label ---- */
    sectionBlock: {
      paddingHorizontal: HP,
      marginBottom: 14,
      marginTop: 4,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "700",
      letterSpacing: 0.2,
    },

    /* ---- Categories ---- */
    categoriesRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: HP,
      gap: 12,
      marginBottom: 32,
    },
    categoryChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 14,
      gap: 8,
    },
    categoryIconWrap: {
      width: 28,
      height: 28,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    categoryLabel: {
      fontSize: 13,
      fontWeight: "600",
      letterSpacing: 0.1,
    },

    /* ---- Trending ---- */
    trendingList: {
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
    trendingRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderColor,
    },
    trendingRowLast: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    trendingRank: {
      width: 24,
      fontSize: 13,
      fontWeight: "700",
      color: colors.primary,
      marginRight: 12,
    },
    trendingText: {
      flex: 1,
      fontSize: 13,
      fontWeight: "500",
      letterSpacing: 0.1,
    },
    trendingArrow: {
      width: 30,
      height: 30,
      borderRadius: 9,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary + "10",
    },

    /* ---- Recent ---- */
    recentRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 11,
      paddingHorizontal: HP,
      gap: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderColor,
    },
    recentIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.placeholder + "18",
    },
    recentText: {
      flex: 1,
      fontSize: 13,
      letterSpacing: 0.1,
    },
  });
};
