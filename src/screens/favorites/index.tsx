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

import { announceStatus } from "@/a11y";
import { ActivityCardCarousel } from "@/components/activity-card-carousel";
import { CollapsingScreenHeader } from "@/components/collapsing-screen-header";
import { getCollapsingHeaderTranslation } from "@/components/collapsing-screen-header/constants";
import { EmptyState } from "@/components/empty-state";
import { ScreenFrame } from "@/components/screen-frame";
import { emptyFavoritesIllustration } from "@/illustrations";
import { FavoritesSummary } from "@/screens/favorites/favorites-summary";
import { favoritesMessages } from "@/screens/favorites/messages";
import { useFavoriteActivities } from "@/screens/favorites/use-favorite-activities";
import { spacing, typography, useAppTheme } from "@/theme";

/** Expanded Favorites header height below the iOS safe area. */
const IOS_FAVORITES_HEADER_BODY_HEIGHT = 76;

/** Extra Favorites header height for each Dynamic Type scale step. */
const IOS_FAVORITES_HEADER_FONT_SCALE_ALLOWANCE = 40;

/** Space below the summary line inside the header. */
const IOS_FAVORITES_HEADER_SUMMARY_GAP = 2;

/** Font scale where the summary can wrap to a second line on narrow phones. */
const IOS_FAVORITES_SUMMARY_WRAP_FONT_SCALE = 1.3;

/** Favorites tab with the same focused card presentation as Explore. */
export function Favorites() {
  if (process.env.EXPO_OS === "web" || Platform.OS !== "ios") return <FavoritesStandard />;

  return (
    <ScrollEdgeEffectProvider>
      <FavoritesNative />
    </ScrollEdgeEffectProvider>
  );
}

function useFavoritesScreenState() {
  const { t } = useLingui();
  const activities = useFavoriteActivities();

  useEffect(() => {
    announceStatus(
      t(
        activities.length === 0
          ? favoritesMessages.emptyAnnounce
          : favoritesMessages.loadedAnnounce,
      ),
    );
  }, [activities.length, t]);

  return { activities, t };
}

function FavoritesNative() {
  const { activities, t } = useFavoritesScreenState();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const scrollEdgeRef = useScrollEdgeEffectRef();
  const scrollOffset = useSharedValue(0);
  const { fontScale: measuredFontScale } = useWindowDimensions();
  const fontScale = measuredFontScale ?? 1;
  const hasFavorites = activities.length > 0;
  const fontScaleStep = Math.max(0, fontScale - 1);
  const summaryLines = fontScale >= IOS_FAVORITES_SUMMARY_WRAP_FONT_SCALE ? 2 : 1;
  const summaryHeight = hasFavorites
    ? typography.caption.lineHeight * fontScale * summaryLines + IOS_FAVORITES_HEADER_SUMMARY_GAP
    : 0;
  const headerBodyHeight =
    IOS_FAVORITES_HEADER_BODY_HEIGHT +
    fontScaleStep * IOS_FAVORITES_HEADER_FONT_SCALE_ALLOWANCE +
    summaryHeight;
  const headerHeight = insets.top + headerBodyHeight;
  const headerTranslation = getCollapsingHeaderTranslation(headerBodyHeight);
  const title = t(favoritesMessages.screenTitle);
  const onScroll = useAnimatedScrollHandler((event) => {
    const normalizedOffset = event.contentOffset.y + (event.contentInset?.top ?? 0);
    scrollOffset.set(Math.max(0, normalizedOffset));
  });

  return (
    <ScreenFrame
      title={title}
      padHorizontal={false}
      padTop={false}
      style={[styles.root, { backgroundColor: theme.colors.background }]}
      testID="favorites-screen"
    >
      {activities.length === 0 ? (
        <Animated.ScrollView
          ref={scrollEdgeRef as never}
          contentContainerStyle={[
            styles.emptyScroll,
            {
              paddingBottom: insets.bottom + spacing.space48,
              paddingTop: headerHeight,
            },
          ]}
          contentInsetAdjustmentBehavior="never"
          onScroll={onScroll}
          scrollEventThrottle={16}
          testID="favorites-empty"
        >
          <EmptyState
            title={t(favoritesMessages.emptyTitle)}
            body={t(favoritesMessages.emptyBody)}
            actionLabel={t(favoritesMessages.emptyAction)}
            illustration={emptyFavoritesIllustration}
            presentation="centered"
            onAction={() => router.navigate("/(explore)")}
          />
        </Animated.ScrollView>
      ) : (
        <ActivityCardCarousel
          activities={activities}
          favoriteRemovalEffect="particle-dissolve"
          followsCollapsingHeader
          headerHeight={headerHeight}
          headerTranslation={headerTranslation}
          scrollOffset={scrollOffset}
          scrollRef={scrollEdgeRef}
          testID="favorites-list"
        />
      )}
      <CollapsingScreenHeader
        bodyHeight={headerBodyHeight}
        safeAreaTop={insets.top}
        scrollOffset={scrollOffset}
        title={title}
        translation={headerTranslation}
      >
        {hasFavorites ? <FavoritesSummary count={activities.length} /> : null}
      </CollapsingScreenHeader>
    </ScreenFrame>
  );
}

function FavoritesStandard() {
  const { activities, t } = useFavoritesScreenState();
  const theme = useAppTheme();

  return (
    <ScreenFrame
      title={t(favoritesMessages.screenTitle)}
      contentStyle={{ backgroundColor: theme.colors.background }}
      testID="favorites-screen"
    >
      <Text style={[styles.heading, { color: theme.colors.text }]} accessibilityRole="header">
        {t(favoritesMessages.heading)}
      </Text>
      {activities.length > 0 ? <FavoritesSummary count={activities.length} /> : null}
      {activities.length === 0 ? (
        <View style={styles.empty} testID="favorites-empty">
          <EmptyState
            title={t(favoritesMessages.emptyTitle)}
            body={t(favoritesMessages.emptyBody)}
            actionLabel={t(favoritesMessages.emptyAction)}
            illustration={emptyFavoritesIllustration}
            presentation="centered"
            onAction={() => router.navigate("/(explore)")}
          />
        </View>
      ) : (
        <ActivityCardCarousel
          activities={activities}
          favoriteRemovalEffect="particle-dissolve"
          testID="favorites-list"
        />
      )}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: spacing.space48,
  },
  emptyScroll: {
    flexGrow: 1,
    justifyContent: "center",
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
