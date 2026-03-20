import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "@shared-components/text-wrapper/TextWrapper";
import createStyles from "./SearchScreen.style";

const CATEGORIES = [
  {
    label: "Design",
    icon: "color-palette",
    iconType: IconType.Ionicons,
    color: "#f59e0b",
  },
  {
    label: "Dev Tools",
    icon: "terminal",
    iconType: IconType.Ionicons,
    color: "#4A6CF7",
  },
  {
    label: "Libraries",
    icon: "library",
    iconType: IconType.Ionicons,
    color: "#10b981",
  },
  {
    label: "Components",
    icon: "layers",
    iconType: IconType.Ionicons,
    color: "#8b5cf6",
  },
  {
    label: "Navigation",
    icon: "navigate",
    iconType: IconType.Ionicons,
    color: "#0ea5e9",
  },
  {
    label: "State",
    icon: "git-branch",
    iconType: IconType.Ionicons,
    color: "#f43f5e",
  },
];

const TRENDING = [
  "React Native Architecture",
  "TypeScript Best Practices",
  "Navigation Patterns",
  "Custom Hooks Guide",
  "Theme & Dark Mode",
];

const RECENT = [
  "AsyncStorage setup",
  "Axios interceptors",
  "Localization i18n",
  "SafeAreaView usage",
];

const SearchScreen: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderCategory = (item: (typeof CATEGORIES)[0]) => (
    <View
      key={item.label}
      style={[styles.categoryChip, { backgroundColor: item.color + "15" }]}
    >
      <View
        style={[
          styles.categoryIconWrap,
          { backgroundColor: item.color + "22" },
        ]}
      >
        <Icon
          name={item.icon}
          type={item.iconType}
          color={item.color}
          size={14}
        />
      </View>
      <Text style={[styles.categoryLabel, { color: item.color }]}>
        {item.label}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text h2 bold color={colors.text} style={styles.headerTitle}>
            Search
          </Text>
          <Text color={colors.placeholder} style={styles.headerSubtitle}>
            Explore docs, components & guides
          </Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <View style={styles.searchInput}>
            <View style={styles.searchIconWrap}>
              <Icon
                name="search"
                type={IconType.Ionicons}
                color={colors.primary}
                size={16}
              />
            </View>
            <Text color={colors.placeholder} style={styles.searchInputText}>
              Search anything…
            </Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.sectionBlock}>
          <Text bold color={colors.text} style={styles.sectionTitle}>
            Browse Categories
          </Text>
        </View>
        <View style={styles.categoriesRow}>
          {CATEGORIES.map(renderCategory)}
        </View>

        {/* Trending */}
        <View style={styles.sectionBlock}>
          <Text bold color={colors.text} style={styles.sectionTitle}>
            Trending
          </Text>
        </View>
        <View style={styles.trendingList}>
          {TRENDING.map((term, i) => (
            <View
              key={term}
              style={
                i === TRENDING.length - 1
                  ? styles.trendingRowLast
                  : styles.trendingRow
              }
            >
              <Text style={styles.trendingRank}>{i + 1}</Text>
              <Text color={colors.text} style={styles.trendingText}>
                {term}
              </Text>
              <View style={styles.trendingArrow}>
                <Icon
                  name="chevron-forward"
                  type={IconType.Ionicons}
                  color={colors.primary}
                  size={14}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Recent searches */}
        <View style={styles.sectionBlock}>
          <Text bold color={colors.text} style={styles.sectionTitle}>
            Recent Searches
          </Text>
        </View>
        <View>
          {RECENT.map((term) => (
            <View key={term} style={styles.recentRow}>
              <View style={styles.recentIconWrap}>
                <Icon
                  name="time"
                  type={IconType.Ionicons}
                  color={colors.placeholder}
                  size={16}
                />
              </View>
              <Text color={colors.text} style={styles.recentText}>
                {term}
              </Text>
              <Icon
                name="close"
                type={IconType.Ionicons}
                color={colors.placeholder}
                size={14}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
