import { useEffect, type Ref } from "react";
import { Keyboard, Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { useLingui } from "@lingui/react/macro";
import Animated, { type SharedValue, useAnimatedScrollHandler } from "react-native-reanimated";

import { announceStatus } from "@/a11y";
import { ActivityCardSkeleton } from "@/components/activity-card-skeleton";
import { SKELETON_LIST_ROW_COUNT } from "@/components/constants";
import { ExploreHeader } from "@/screens/explore/explore-header";
import { exploreMessages } from "@/screens/explore/messages";
import { spacing } from "@/theme";

type ExploreSkeletonProps = {
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
  filtersInOverlay = false,
  headerHeight = 0,
  scrollRef,
  scrollOffset,
}: ExploreSkeletonProps) {
  const { t } = useLingui();
  const { width, height } = useWindowDimensions();
  const padTop = headerHeight + spacing.space8;
  const insetBehavior = Platform.OS === "ios" ? "never" : "automatic";
  const onScroll = useAnimatedScrollHandler((event) => {
    if (scrollOffset === undefined) {
      return;
    }
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
      {filtersInOverlay ? null : <ExploreHeader />}
      <View>
        {Array.from({ length: SKELETON_LIST_ROW_COUNT }, (_, index) => (
          <ActivityCardSkeleton
            key={`skeleton-${index}`}
            testID={`activity-card-skeleton-${index}`}
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
