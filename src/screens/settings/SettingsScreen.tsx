import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import fonts from "@fonts";
import RNBounceable from "@freakycoder/react-native-bounceable";
import Text from "@shared-components/text-wrapper/TextWrapper";
import createStyles from "./SettingsScreen.style";

type ValueType = "text" | "badge" | "none";

interface ISettingsItem {
  label: string;
  icon: string;
  iconType: IconType;
  iconColor: string;
  value?: string;
  valueType?: ValueType;
  onPress?: () => void;
}

const GENERAL_SETTINGS: ISettingsItem[] = [
  {
    label: "Appearance",
    icon: "moon",
    iconType: IconType.Ionicons,
    iconColor: "#8b5cf6",
    value: "System",
    valueType: "text",
  },
  {
    label: "Language",
    icon: "language",
    iconType: IconType.Ionicons,
    iconColor: "#0ea5e9",
    value: "English",
    valueType: "text",
  },
  {
    label: "Notifications",
    icon: "notifications",
    iconType: IconType.Ionicons,
    iconColor: "#f59e0b",
    value: "On",
    valueType: "badge",
  },
];

const PRIVACY_SETTINGS: ISettingsItem[] = [
  {
    label: "Privacy & Security",
    icon: "lock-closed",
    iconType: IconType.Ionicons,
    iconColor: "#10b981",
  },
  {
    label: "Permissions",
    icon: "shield-checkmark",
    iconType: IconType.Ionicons,
    iconColor: "#4A6CF7",
  },
];

const DEVELOPER_SETTINGS: ISettingsItem[] = [
  {
    label: "Component Showcase",
    icon: "layers",
    iconType: IconType.Ionicons,
    iconColor: "#4A6CF7",
  },
  {
    label: "Debug Mode",
    icon: "bug",
    iconType: IconType.Ionicons,
    iconColor: "#f59e0b",
    value: "Off",
    valueType: "text",
  },
  {
    label: "Crash Reporting",
    icon: "alert-circle",
    iconType: IconType.Ionicons,
    iconColor: "#0ea5e9",
    value: "Enabled",
    valueType: "badge",
  },
];

const ABOUT_SETTINGS: ISettingsItem[] = [
  {
    label: "Rate the App",
    icon: "star",
    iconType: IconType.Ionicons,
    iconColor: "#f59e0b",
  },
  {
    label: "Open Source Licenses",
    icon: "document-text",
    iconType: IconType.Ionicons,
    iconColor: "#6b7894",
  },
  {
    label: "Terms & Privacy Policy",
    icon: "reader",
    iconType: IconType.Ionicons,
    iconColor: "#0ea5e9",
  },
];

const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */

  const renderSettingsRow = (item: ISettingsItem, isLast: boolean) => (
    <RNBounceable
      key={item.label}
      style={isLast ? styles.settingsRowLast : styles.settingsRow}
      onPress={item.onPress}
    >
      <View
        style={[
          styles.settingsIconWrap,
          { backgroundColor: item.iconColor + "18" },
        ]}
      >
        <Icon
          name={item.icon}
          type={item.iconType}
          color={item.iconColor}
          size={18}
        />
      </View>
      <Text color={colors.text} style={styles.settingsLabel}>
        {item.label}
      </Text>
      {item.value && item.valueType === "badge" ? (
        <View style={styles.settingsValueBadge}>
          <Text style={styles.settingsValueBadgeText}>{item.value}</Text>
        </View>
      ) : null}
      {item.value && item.valueType === "text" ? (
        <Text color={colors.placeholder} style={styles.settingsValueText}>
          {item.value}
        </Text>
      ) : null}
      <View style={styles.settingsChevron}>
        <Icon
          name="chevron-forward"
          type={IconType.Ionicons}
          color={colors.placeholder}
          size={16}
        />
      </View>
    </RNBounceable>
  );

  const renderSection = (
    title: string,
    items: ISettingsItem[],
    isLast = false,
  ) => (
    <>
      <View style={styles.sectionBlock}>
        <Text color={colors.placeholder} style={styles.sectionTitle}>
          {title}
        </Text>
      </View>
      <View
        style={[
          styles.settingsList,
          isLast ? styles.settingsListLast : undefined,
        ]}
      >
        {items.map((item, i) =>
          renderSettingsRow(item, i === items.length - 1),
        )}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text
            fontFamily={fonts.montserrat.bold}
            color={colors.text}
            style={styles.headerTitle}
          >
            Settings
          </Text>
          <Text color={colors.placeholder} style={styles.headerSubtitle}>
            Manage your app preferences
          </Text>
        </View>

        {/* App info card */}
        <View style={styles.appCard}>
          <View style={styles.appIconWrap}>
            <Text fontFamily={fonts.montserrat.bold} style={styles.appIconText}>
              RN
            </Text>
          </View>
          <View style={styles.appCardContent}>
            <Text
              fontFamily={fonts.montserrat.semiBold}
              color={colors.text}
              style={styles.appName}
            >
              RN TypeScript Boilerplate
            </Text>
            <Text color={colors.placeholder} style={styles.appVersion}>
              Version 1.0.0 · Build 1
            </Text>
          </View>
        </View>

        {renderSection("General", GENERAL_SETTINGS)}
        {renderSection("Privacy", PRIVACY_SETTINGS)}
        {renderSection("Developer", DEVELOPER_SETTINGS)}
        {renderSection("About", ABOUT_SETTINGS)}

        {/* Danger zone */}
        <View style={styles.sectionBlock}>
          <Text color={colors.placeholder} style={styles.sectionTitle}>
            Danger Zone
          </Text>
        </View>
        <View style={[styles.settingsList, styles.settingsListLast]}>
          <RNBounceable style={styles.dangerRow}>
            <View style={[styles.settingsIconWrap, styles.dangerIconWrap]}>
              <Icon
                name="trash"
                type={IconType.Ionicons}
                color="#f43f5e"
                size={18}
              />
            </View>
            <Text style={styles.dangerLabel}>Clear Cache</Text>
          </RNBounceable>
          <RNBounceable style={styles.dangerRowSeparated}>
            <View style={[styles.settingsIconWrap, styles.dangerIconWrap]}>
              <Icon
                name="log-out"
                type={IconType.Ionicons}
                color="#f43f5e"
                size={18}
              />
            </View>
            <Text style={styles.dangerLabel}>Sign Out</Text>
          </RNBounceable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
