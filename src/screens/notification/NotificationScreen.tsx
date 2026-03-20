import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "@shared-components/text-wrapper/TextWrapper";
import createStyles from "./NotificationScreen.style";

interface INotification {
  id: string;
  icon: string;
  iconType: IconType;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

const TODAY_NOTIFICATIONS: INotification[] = [
  {
    id: "1",
    icon: "rocket",
    iconType: IconType.Ionicons,
    iconColor: "#4A6CF7",
    title: "New Release Available",
    description:
      "React Native 0.84 is now available with improved performance and new APIs.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "2",
    icon: "shield-checkmark",
    iconType: IconType.Ionicons,
    iconColor: "#10b981",
    title: "Dependencies Updated",
    description:
      "All packages have been updated to their latest stable versions.",
    time: "1 hr ago",
    unread: true,
  },
  {
    id: "3",
    icon: "alert-circle",
    iconType: IconType.Ionicons,
    iconColor: "#f59e0b",
    title: "Build Warning",
    description:
      "A deprecated API was detected. Consider migrating to the new component model.",
    time: "3 hr ago",
    unread: false,
  },
];

const EARLIER_NOTIFICATIONS: INotification[] = [
  {
    id: "4",
    icon: "star",
    iconType: IconType.Ionicons,
    iconColor: "#f59e0b",
    title: "Boilerplate Starred",
    description: "Your boilerplate reached 500 stars on GitHub.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "5",
    icon: "git-merge",
    iconType: IconType.Ionicons,
    iconColor: "#8b5cf6",
    title: "PR Merged",
    description:
      "feat: Add dark mode support was successfully merged into main.",
    time: "2 days ago",
    unread: false,
  },
  {
    id: "6",
    icon: "chatbubble-ellipses",
    iconType: IconType.Ionicons,
    iconColor: "#0ea5e9",
    title: "New Comment",
    description:
      "Someone commented on your issue: 'TypeScript strict mode setup'.",
    time: "3 days ago",
    unread: false,
  },
];

const NotificationScreen: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderNotification = (item: INotification) => (
    <View
      key={item.id}
      style={[styles.notifCard, item.unread && styles.notifCardUnread]}
    >
      <View style={styles.notifAvatarWrap}>
        <View
          style={[
            styles.notifIconBadge,
            { backgroundColor: item.iconColor + "18" },
          ]}
        >
          <Icon
            name={item.icon}
            type={item.iconType}
            color={item.iconColor}
            size={20}
          />
        </View>
        {item.unread && <View style={styles.notifDot} />}
      </View>
      <View style={styles.notifBody}>
        <Text bold color={colors.text} style={styles.notifTitle}>
          {item.title}
        </Text>
        <Text color={colors.placeholder} style={styles.notifDescription}>
          {item.description}
        </Text>
        <Text color={colors.primary} style={styles.notifTime}>
          {item.time}
        </Text>
      </View>
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
          <View style={styles.headerRow}>
            <Text h2 bold color={colors.text} style={styles.headerTitle}>
              Notifications
            </Text>
            <View style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Mark all read</Text>
            </View>
          </View>
          <Text color={colors.placeholder} style={styles.headerSubtitle}>
            You have 2 unread notifications
          </Text>
        </View>

        {/* Today */}
        <View style={styles.sectionBlock}>
          <Text color={colors.placeholder} style={styles.sectionTitle}>
            Today
          </Text>
        </View>
        {TODAY_NOTIFICATIONS.map(renderNotification)}

        {/* Earlier */}
        <View style={styles.sectionBlockSpaced}>
          <Text color={colors.placeholder} style={styles.sectionTitle}>
            Earlier
          </Text>
        </View>
        {EARLIER_NOTIFICATIONS.map(renderNotification)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;
