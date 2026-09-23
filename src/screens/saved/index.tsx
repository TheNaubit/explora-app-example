import { useEffect } from "react";
import { Platform, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import {
  ScrollEdgeEffectProvider,
  useScrollEdgeEffectRef,
} from "@bsky.app/expo-scroll-edge-effect";
import { useLingui } from "@lingui/react/macro";
import { router } from "expo-router";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { A11y, announceStatus } from "@/a11y";
import { ActivityCardCarousel } from "@/components/activity-card-carousel";
import { CollapsingScreenHeader } from "@/components/collapsing-screen-header";
import { getCollapsingHeaderTranslation } from "@/components/collapsing-screen-header/constants";
import { EmptyState } from "@/components/empty-state";
import { ScreenFrame } from "@/components/screen-frame";
import { emptySearchIllustration } from "@/illustrations";
import { savedMessages } from "@/screens/saved/messages";
import { useSavedActivities } from "@/screens/saved/use-saved-activities";
import { spacing, typography, useAppTheme } from "@/theme";

/** Expanded Saved header height below the iOS safe area. */
const IOS_SAVED_HEADER_BODY_HEIGHT = 76;

/** Extra Saved header height for each Dynamic Type scale step. */
const IOS_SAVED_HEADER_FONT_SCALE_ALLOWANCE = 40;

/** Saved favorites tab with the same focused card presentation as Explore. */
export function Saved() {
  if (process.env.EXPO_OS === "web" || Platform.OS !== "ios") return <SavedStandard />;

  return (
    <ScrollEdgeEffectProvider>
      <SavedNative />
    </ScrollEdgeEffectProvider>
  );
}

function useSavedScreenState() {
  const { t } = useLingui();
  const activities = useSavedActivities();

  useEffect(() => {
    announceStatus(
      t(activities.length === 0 ? savedMessages.emptyAnnounce : savedMessages.loadedAnnounce),
    );
  }, [activities.length, t]);

  return { activities, t };
}

function SavedNative() {
  const { activities, t } = useSavedScreenState();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const scrollEdgeRef = useScrollEdgeEffectRef();
  const scrollOffset = useSharedValue(0);
  const { fontScale: measuredFontScale } = useWindowDimensions();
  const fontScale = measuredFontScale ?? 1;
  const headerBodyHeight =
    IOS_SAVED_HEADER_BODY_HEIGHT +
    Math.max(0, fontScale - 1) * IOS_SAVED_HEADER_FONT_SCALE_ALLOWANCE;
  const headerHeight = insets.top + headerBodyHeight;
  const headerTranslation = getCollapsingHeaderTranslation(headerBodyHeight);
  const title = t(savedMessages.screenTitle);
  const onScroll = useAnimatedScrollHandler((event) => {
    const normalizedOffset = event.contentOffset.y + (event.contentInset?.top ?? 0);
    scrollOffset.set(Math.max(0, normalizedOffset));
  });

  return (
    <View
      collapsable={false}
      style={[styles.root, { backgroundColor: theme.colors.background }]}
      testID="saved-screen"
    >
      {activities.length === 0 ? (
        <Animated.ScrollView
          ref={scrollEdgeRef as never}
          contentContainerStyle={[styles.emptyScroll, { paddingTop: headerHeight }]}
          contentInsetAdjustmentBehavior="never"
          onScroll={onScroll}
          scrollEventThrottle={16}
          testID="saved-empty"
        >
          <EmptyState
            title={t(savedMessages.emptyTitle)}
            body={t(savedMessages.emptyBody)}
            actionLabel={t(savedMessages.emptyAction)}
            illustration={emptySearchIllustration}
            onAction={() => router.navigate("/")}
          />
        </Animated.ScrollView>
      ) : (
        <ActivityCardCarousel
          activities={activities}
          followsCollapsingHeader
          headerHeight={headerHeight}
          headerTranslation={headerTranslation}
          scrollOffset={scrollOffset}
          scrollRef={scrollEdgeRef}
          testID="saved-list"
        />
      )}
      <CollapsingScreenHeader
        bodyHeight={headerBodyHeight}
        safeAreaTop={insets.top}
        scrollOffset={scrollOffset}
        title={title}
        translation={headerTranslation}
      />
      <A11y.ScreenChange title={title} />
    </View>
  );
}

function SavedStandard() {
  const { activities, t } = useSavedScreenState();
  const theme = useAppTheme();

  return (
    <ScreenFrame
      title={t(savedMessages.screenTitle)}
      contentStyle={{ backgroundColor: theme.colors.background }}
      testID="saved-screen"
    >
      <Text style={[styles.heading, { color: theme.colors.text }]} accessibilityRole="header">
        {t(savedMessages.heading)}
      </Text>
      {activities.length === 0 ? (
        <View style={styles.empty} testID="saved-empty">
          <EmptyState
            title={t(savedMessages.emptyTitle)}
            body={t(savedMessages.emptyBody)}
            actionLabel={t(savedMessages.emptyAction)}
            illustration={emptySearchIllustration}
            onAction={() => router.navigate("/")}
          />
        </View>
      ) : (
        <ActivityCardCarousel activities={activities} testID="saved-list" />
      )}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1 },
  emptyScroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.space24,
  },
  heading: {
    ...typography.display,
    marginBottom: spacing.space8,
    marginHorizontal: spacing.space24,
    marginTop: spacing.space16,
    textAlign: "left",
  },
  root: { flex: 1 },
});
