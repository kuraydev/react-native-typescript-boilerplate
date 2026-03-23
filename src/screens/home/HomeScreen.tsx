import React, { useMemo } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import fonts from "@fonts";
import type { IStackItem, IUtilityItem } from "@services/models";
import Text from "@shared-components/text-wrapper/TextWrapper";
import CardItem from "./components/card-item/CardItem";
import createStyles from "./HomeScreen.style";
import { FeatureCards, StackItems, UtilityItems } from "./mock/MockData";

const RN_VERSION = "0.84";

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTitleBlock}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>RN {RN_VERSION} · TypeScript</Text>
          </View>
        </View>
        <Text h2 bold color={colors.text}>
          Boilerplate
        </Text>
        <Text h2 bold color={colors.primary}>
          Explorer
        </Text>
        <Text
          fontFamily={fonts.montserrat.lightItalic}
          color={colors.placeholder}
          style={styles.subtitleText}
        >
          {"Everything that's wired up and ready to go"}
        </Text>
      </View>
      <View style={styles.headerIcon}>
        <View style={styles.headerIconRing}>
          <Icon
            name="logo-react"
            type={IconType.Ionicons}
            color={colors.primary}
            size={40}
          />
        </View>
      </View>
    </View>
  );

  const renderSectionLabel = (title: string, subtitle?: string) => (
    <View style={styles.sectionLabelBlock}>
      <Text h4 bold color={colors.text}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.sectionSubtitle} color={colors.placeholder}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );

  const renderFeatureCards = () => (
    <View style={styles.featureSection}>
      {renderSectionLabel("Features")}
      <FlatList
        data={FeatureCards}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        contentContainerStyle={styles.featureList}
        renderItem={({ item }) => <CardItem data={item} />}
      />
    </View>
  );

  const TAG_COLORS: Record<string, string> = {
    hook: "#8b5cf6",
    service: "#0ea5e9",
    component: "#10b981",
    config: "#f59e0b",
  };

  const renderUtilityCard = (item: IUtilityItem) => {
    const tagColor = TAG_COLORS[item.tag] ?? colors.primary;
    return (
      <View key={item.title} style={styles.utilityCard}>
        <View
          style={[styles.utilityIconWrap, { backgroundColor: tagColor + "18" }]}
        >
          <Icon
            name={item.icon}
            type={item.iconType as IconType}
            color={tagColor}
            size={20}
          />
        </View>
        <View style={styles.utilityCardContent}>
          <View style={styles.utilityTitleRow}>
            <Text
              bold
              color={colors.text}
              style={styles.utilityTitle}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <View
              style={[styles.utilityTag, { backgroundColor: tagColor + "18" }]}
            >
              <Text style={[styles.utilityTagText, { color: tagColor }]}>
                {item.tag}
              </Text>
            </View>
          </View>
          <Text
            color={colors.placeholder}
            style={styles.utilityDescription}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  const renderUtilities = () => (
    <View style={styles.utilitiesSection}>
      {renderSectionLabel("Utilities", "Built-in helpers ready to use")}
      <View style={styles.utilitiesGrid}>
        {UtilityItems.map(renderUtilityCard)}
      </View>
    </View>
  );

  const renderStackRow = ({
    item,
    isLast,
  }: {
    item: IStackItem;
    isLast: boolean;
  }) => (
    <View style={isLast ? styles.stackRowLast : styles.stackRow}>
      <View style={styles.stackIconWrap}>
        <Icon
          name={item.icon}
          type={item.iconType as IconType}
          color={colors.primary}
          size={18}
        />
      </View>
      <Text color={colors.text} style={styles.stackName} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={styles.versionBadge}>
        <Text style={styles.versionText}>{item.version}</Text>
      </View>
    </View>
  );

  const renderTechStack = () => (
    <View style={styles.stackSection}>
      {renderSectionLabel("Tech Stack")}
      <View style={styles.stackList}>
        {StackItems.map((item, index) =>
          renderStackRow({ item, isLast: index === StackItems.length - 1 }),
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        {renderFeatureCards()}
        {renderUtilities()}
        {renderTechStack()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
