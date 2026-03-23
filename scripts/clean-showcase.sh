#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# clean-showcase.sh
#
# Strips out the boilerplate's demo/showcase content and replaces every
# showcase screen with a minimal, compilable stub that follows project
# conventions (SafeAreaView, TextWrapper, createStyles pattern).
#
# What is removed:
#   • src/screens/home/mock/           — FeatureCards / UtilityItems / StackItems
#   • src/screens/home/components/     — CardItem (home-only showcase component)
#
# What is stubbed out (screen + style file rewritten to minimal):
#   • HomeScreen
#   • SearchScreen
#   • NotificationScreen
#   • SettingsScreen
#   • DetailScreen
#
# What is intentionally KEPT:
#   • AIChatScreen          — it is a real, functional feature demo
#   • All shared components — RNButton, RNInput, RNDivider, etc.
#   • Navigation wiring     — all screens remain registered
#   • Services, hooks, theme, localization, utils — untouched
# -----------------------------------------------------------------------------

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$REPO_ROOT/src"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}  ✓${NC} $1"; }
warn() { echo -e "${YELLOW}  !${NC} $1"; }

echo ""
echo "🧹  Cleaning showcase content…"
echo ""

# ── 1. Remove home mock data & screen-local showcase components ───────────────

if [ -d "$SRC/screens/home/mock" ]; then
  rm -rf "$SRC/screens/home/mock"
  log "Removed src/screens/home/mock/"
fi

if [ -d "$SRC/screens/home/components" ]; then
  rm -rf "$SRC/screens/home/components"
  log "Removed src/screens/home/components/"
fi

# ── 2. Stub — HomeScreen ──────────────────────────────────────────────────────

cat > "$SRC/screens/home/HomeScreen.tsx" << 'STUB'
import React, { useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "@shared-components/text-wrapper/TextWrapper";
import createStyles from "./HomeScreen.style";

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <Text h2 bold color={colors.text}>
          Home
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
STUB
log "Stubbed HomeScreen.tsx"

cat > "$SRC/screens/home/HomeScreen.style.ts" << 'STUB'
import { StyleSheet } from "react-native";
import type { ExtendedTheme } from "@react-navigation/native";

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
};

export default createStyles;
STUB
log "Stubbed HomeScreen.style.ts"

# ── 3. Stub — SearchScreen ────────────────────────────────────────────────────

cat > "$SRC/screens/search/SearchScreen.tsx" << 'STUB'
import React, { useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "@shared-components/text-wrapper/TextWrapper";
import createStyles from "./SearchScreen.style";

const SearchScreen: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text h2 bold color={colors.text}>
          Search
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
STUB
log "Stubbed SearchScreen.tsx"

cat > "$SRC/screens/search/SearchScreen.style.ts" << 'STUB'
import { StyleSheet } from "react-native";
import type { ExtendedTheme } from "@react-navigation/native";

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
};

export default createStyles;
STUB
log "Stubbed SearchScreen.style.ts"

# ── 4. Stub — NotificationScreen ─────────────────────────────────────────────

cat > "$SRC/screens/notification/NotificationScreen.tsx" << 'STUB'
import React, { useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "@shared-components/text-wrapper/TextWrapper";
import createStyles from "./NotificationScreen.style";

const NotificationScreen: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text h2 bold color={colors.text}>
          Notifications
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;
STUB
log "Stubbed NotificationScreen.tsx"

cat > "$SRC/screens/notification/NotificationScreen.style.ts" << 'STUB'
import { StyleSheet } from "react-native";
import type { ExtendedTheme } from "@react-navigation/native";

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
};

export default createStyles;
STUB
log "Stubbed NotificationScreen.style.ts"

# ── 5. Stub — SettingsScreen ──────────────────────────────────────────────────

cat > "$SRC/screens/settings/SettingsScreen.tsx" << 'STUB'
import React, { useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "@shared-components/text-wrapper/TextWrapper";
import createStyles from "./SettingsScreen.style";

const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <Text h2 bold color={colors.text}>
          Settings
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
STUB
log "Stubbed SettingsScreen.tsx"

cat > "$SRC/screens/settings/SettingsScreen.style.ts" << 'STUB'
import { StyleSheet } from "react-native";
import type { ExtendedTheme } from "@react-navigation/native";

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
};

export default createStyles;
STUB
log "Stubbed SettingsScreen.style.ts"

# ── 6. Stub — DetailScreen ────────────────────────────────────────────────────

cat > "$SRC/screens/detail/DetailScreen.tsx" << 'STUB'
import React, { useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import RNBounceable from "@freakycoder/react-native-bounceable";
import Text from "@shared-components/text-wrapper/TextWrapper";
import createStyles from "./DetailScreen.style";

const DetailScreen: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text h2 bold color={colors.text}>
        Detail
      </Text>
      <RNBounceable
        style={styles.backButton}
        onPress={() => NavigationService.goBack()}
      >
        <Text color={colors.white}>Go Back</Text>
      </RNBounceable>
    </View>
  );
};

export default DetailScreen;
STUB
log "Stubbed DetailScreen.tsx"

cat > "$SRC/screens/detail/DetailScreen.style.ts" << 'STUB'
import { StyleSheet } from "react-native";
import type { ExtendedTheme } from "@react-navigation/native";

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },
    backButton: {
      marginTop: 16,
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 8,
      backgroundColor: colors.primary,
    },
  });
};

export default createStyles;
STUB
log "Stubbed DetailScreen.style.ts"

# ── Done ──────────────────────────────────────────────────────────────────────

echo ""
echo "✅  Done! Showcase content removed."
echo ""
warn "AIChatScreen was NOT touched — it is a real feature demo."
warn "Navigation wiring, shared components, services, and theme are all intact."
echo ""
echo "   Next: npm run start:fresh"
echo ""
