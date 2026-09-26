import { useEffect, type Ref } from "react";
import { Keyboard, Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { AnimatedLegendList } from "@legendapp/list/reanimated";
import { useLingui } from "@lingui/react/macro";
import {
  type SharedValue,
  useAnimatedScrollHandler,
  useReducedMotion,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { announceStatus } from "@/a11y";
import { ActivityCardSkeleton } from "@/components/activity-card-skeleton";
import {
  ACTIVITY_CARD_INACTIVE_OPACITY,
  ACTIVITY_CARD_INACTIVE_SCALE,
} from "@/components/activity-card-carousel/constants";
import { getActivityCardCarouselLayout } from "@/components/activity-card-carousel/layout";
import { SKELETON_LIST_ROW_COUNT } from "@/components/constants";
import { ExploreHeader } from "@/screens/explore/explore-header";
import { exploreMessages } from "@/screens/explore/messages";
import { EXPLORE_CARD_CAROUSEL_MAX_FONT_SCALE } from "@/screens/explore/constants";
import { spacing } from "@/theme";

type ExploreSkeletonProps = {
  showFilters?: boolean;
  filtersInOverlay?: boolean;
  headerHeight?: number;
  scrollRef?: Ref<unknown>;
  scrollOffset?: SharedValue<number>;
};

const SKELETON_ROWS = Array.from({ length: SKELETON_LIST_ROW_COUNT }, (_, index) => index);

/**
 * First-load skeleton for the Explore catalog list.
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
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const fontScale = measuredFontScale ?? 1;
  const usesCardCarousel =
    Platform.OS !== "web" && !reduceMotion && fontScale <= EXPLORE_CARD_CAROUSEL_MAX_FONT_SCALE;
  const { itemExtent, mediaHeight, padTop } = getActivityCardCarouselLayout({
    // The first-load list starts below the safe area before content replaces it.
    contentOriginInset: filtersInOverlay ? insets.top : 0,
    fontScale,
    headerHeight,
    height,
    usesCardCarousel,
    width,
  });
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
    <AnimatedLegendList
      data={SKELETON_ROWS}
      estimatedListSize={{ width, height }}
      initialScrollOffset={0}
      keyExtractor={(index) => `skeleton-${index}`}
      recycleItems
      renderItem={({ item: index }) => (
        <View
          style={usesCardCarousel ? [styles.carouselItem, { height: itemExtent }] : undefined}
          testID={`activity-card-skeleton-item-${index}`}
        >
          <View style={usesCardCarousel && index > 0 ? styles.inactiveCard : undefined}>
            <ActivityCardSkeleton
              fontScale={fontScale}
              mediaHeight={usesCardCarousel ? mediaHeight : undefined}
              testID={`activity-card-skeleton-${index}`}
              variant={usesCardCarousel ? "carousel" : "list"}
            />
          </View>
        </View>
      )}
      ListHeaderComponent={showFilters ? <ExploreHeader /> : null}
      refScrollView={scrollRef as never}
      contentInsetAdjustmentBehavior={insetBehavior}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      onScroll={onScroll}
      onScrollBeginDrag={Keyboard.dismiss}
      scrollEventThrottle={16}
      contentContainerStyle={[styles.listPad, { paddingTop: padTop }]}
      style={[styles.list, { width, height }]}
      testID="explore-skeleton"
    />
  );
}

const styles = StyleSheet.create({
  carouselItem: {
    justifyContent: "center",
  },
  inactiveCard: {
    opacity: ACTIVITY_CARD_INACTIVE_OPACITY,
    transform: [{ scale: ACTIVITY_CARD_INACTIVE_SCALE }],
  },
  list: {},
  listPad: {
    paddingBottom: spacing.space32,
    paddingHorizontal: spacing.space24,
  },
});
