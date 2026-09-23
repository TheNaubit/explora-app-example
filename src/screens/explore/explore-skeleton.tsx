import { useEffect, type Ref } from "react";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { useLingui } from "@lingui/react/macro";

import { announceStatus } from "@/a11y";
import { ActivityCardSkeleton } from "@/components/activity-card-skeleton";
import { SKELETON_LIST_ROW_COUNT } from "@/components/constants";
import { EXPLORE_CHIP_OVERLAY_HEIGHT } from "@/screens/explore/constants";
import { ExploreHeader } from "@/screens/explore/explore-header";
import { exploreMessages } from "@/screens/explore/messages";
import { useExploreTopInset } from "@/screens/explore/use-explore-top-inset";
import { spacing } from "@/theme";

type ExploreSkeletonProps = {
  filtersInOverlay?: boolean;
  scrollRef?: Ref<unknown>;
};

/**
 * Suspense fallback for the Explore catalog list.
 * Matches the sized list host so large-title padding stays stable while loading.
 */
export function ExploreSkeleton({ filtersInOverlay = false, scrollRef }: ExploreSkeletonProps) {
  const { t } = useLingui();
  const { width, height } = useWindowDimensions();
  const topInset = useExploreTopInset();
  const overlayPad = filtersInOverlay ? EXPLORE_CHIP_OVERLAY_HEIGHT : 0;
  const padTop = topInset + overlayPad + spacing.space8;

  useEffect(() => {
    announceStatus(t(exploreMessages.loadingAnnounce));
  }, [t]);

  return (
    <ScrollView
      ref={scrollRef as never}
      contentInsetAdjustmentBehavior="never"
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {},
  listPad: {
    paddingBottom: spacing.space32,
    paddingHorizontal: spacing.space24,
  },
});
