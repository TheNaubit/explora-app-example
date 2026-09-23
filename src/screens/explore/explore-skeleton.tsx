import { useEffect, type Ref } from "react";
import { Keyboard, Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { useLingui } from "@lingui/react/macro";
import Animated, {
  type SharedValue,
  useAnimatedScrollHandler,
  useReducedMotion,
} from "react-native-reanimated";

import { announceStatus } from "@/a11y";
import { ActivityCardSkeleton } from "@/components/activity-card-skeleton";
import { SKELETON_LIST_ROW_COUNT } from "@/components/constants";
import { ExploreHeader } from "@/screens/explore/explore-header";
import { exploreMessages } from "@/screens/explore/messages";
import {
  EXPLORE_CARD_BODY_HEIGHT,
  EXPLORE_CARD_CAROUSEL_MAX_FONT_SCALE,
  EXPLORE_CARD_MEDIA_ASPECT_RATIO,
  EXPLORE_CARD_MEDIA_MAX_HEIGHT,
} from "@/screens/explore/constants";
import { spacing } from "@/theme";

type ExploreSkeletonProps = {
  showFilters?: boolean;
  filtersInOverlay?: boolean;
  headerHeight?: number;
  scrollRef?: Ref<unknown>;
  scrollOffset?: SharedValue<number>;
};

/**
 * Suspense fallback for the Explore catalog list.
 * Matches the sized list host and keeps custom iOS header spacing while loading.
 */
export function ExploreSkeleton({
  showFilters = false,
  filtersInOverlay = false,
  headerHeight = 0,
  scrollRef,
  scrollOffset,
}: ExploreSkeletonProps) {
  const { t } = useLingui();
  const { width, height, fontScale: measuredFontScale } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const fontScale = measuredFontScale ?? 1;
  const cardWidth = width - spacing.space48;
  const mediaHeight = Math.min(
    cardWidth * EXPLORE_CARD_MEDIA_ASPECT_RATIO,
    EXPLORE_CARD_MEDIA_MAX_HEIGHT,
  );
  const usesCardCarousel =
    Platform.OS !== "web" && !reduceMotion && fontScale <= EXPLORE_CARD_CAROUSEL_MAX_FONT_SCALE;
  const padTop = headerHeight + spacing.space8;
  const insetBehavior = filtersInOverlay ? "never" : "automatic";
  const onScroll = useAnimatedScrollHandler((event) => {
    if (scrollOffset === undefined) return;
    const normalizedOffset = event.contentOffset.y + (event.contentInset?.top ?? 0);
    scrollOffset.set(Math.max(0, normalizedOffset));
  });

  useEffect(() => {
    announceStatus(t(exploreMessages.loadingAnnounce));
  }, [t]);

  return (
    <Animated.ScrollView
      ref={scrollRef as never}
      contentInsetAdjustmentBehavior={insetBehavior}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      onScroll={onScroll}
      onScrollBeginDrag={Keyboard.dismiss}
      scrollEventThrottle={16}
      contentContainerStyle={[styles.listPad, { paddingTop: padTop }]}
      style={[styles.list, { width, height }]}
      testID="explore-skeleton"
    >
      {showFilters ? <ExploreHeader /> : null}
      <View>
        {Array.from({ length: SKELETON_LIST_ROW_COUNT }, (_, index) => (
          <ActivityCardSkeleton
            bodyHeight={usesCardCarousel ? EXPLORE_CARD_BODY_HEIGHT * fontScale : undefined}
            key={`skeleton-${index}`}
            mediaHeight={usesCardCarousel ? mediaHeight : undefined}
            testID={`activity-card-skeleton-${index}`}
            variant={usesCardCarousel ? "carousel" : "list"}
          />
        ))}
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {},
  listPad: {
    paddingBottom: spacing.space32,
    paddingHorizontal: spacing.space24,
  },
});
