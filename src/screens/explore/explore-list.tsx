import type { Ref } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { LegendList } from "@legendapp/list/react-native";
import { useLingui } from "@lingui/react/macro";

import { ActivityCard } from "@/components/activity-card";
import { EmptyState } from "@/components/empty-state";
import { emptySearchIllustration } from "@/illustrations";
import { resetDiscoveryFilters } from "@/state/discovery";
import { EXPLORE_CHIP_OVERLAY_HEIGHT } from "@/screens/explore/constants";
import { ExploreHeader } from "@/screens/explore/explore-header";
import { ExploreStatusBanner } from "@/screens/explore/explore-status-banner";
import { exploreMessages } from "@/screens/explore/messages";
import type { ExploreBannerState } from "@/screens/explore/types";
import { useExploreList } from "@/screens/explore/use-explore-list";
import { useExploreTopInset } from "@/screens/explore/use-explore-top-inset";
import { spacing, useAppTheme } from "@/theme";

/** Scroll host ref for `@bsky.app/expo-scroll-edge-effect` (callback or object ref). */
type ExploreScrollRef = Ref<unknown>;

type ExploreListProps = {
  banner: ExploreBannerState;
  onBannerChange: (banner: ExploreBannerState) => void;
  refreshing: boolean;
  onRefresh: () => void;
  /**
   * When true, category chips render in the ScrollEdgeEffect overlay.
   * List header keeps only the status banner.
   */
  filtersInOverlay?: boolean;
  /** Scroll view ref for `@bsky.app/expo-scroll-edge-effect`. */
  scrollRef?: ExploreScrollRef;
};

/**
 * Explore catalog body after Suspense resolves.
 * Uses an explicit window size so LegendList is not height 0 under Native Tabs.
 * Native top inset clears the transparent header and optional chip overlay.
 */
export function ExploreList({
  banner,
  onBannerChange,
  refreshing,
  onRefresh,
  filtersInOverlay = false,
  scrollRef,
}: ExploreListProps) {
  const { t } = useLingui();
  const theme = useAppTheme();
  const { width, height } = useWindowDimensions();
  const topInset = useExploreTopInset();
  const { activities, isFetchingNextPage, handleEndReached } = useExploreList({ onBannerChange });

  const bannerNode =
    banner !== null ? (
      <ExploreStatusBanner
        banner={banner}
        onDismiss={() => onBannerChange(null)}
        onRetryRefresh={onRefresh}
        onRetryNextPage={() => {
          void handleEndReached();
        }}
      />
    ) : null;

  const listHeader = filtersInOverlay ? (
    bannerNode
  ) : (
    <>
      <ExploreHeader />
      {bannerNode}
    </>
  );

  const overlayPad = filtersInOverlay ? EXPLORE_CHIP_OVERLAY_HEIGHT : 0;
  const padTop = topInset + overlayPad + spacing.space8;
  const listStyle = [styles.list, { width, height, backgroundColor: theme.colors.background }];
  const contentStyle = [styles.listPad, { paddingTop: padTop }];

  if (activities.length === 0) {
    return (
      <ScrollView
        ref={scrollRef as never}
        contentContainerStyle={[styles.emptyScroll, { paddingTop: padTop }]}
        contentInsetAdjustmentBehavior="never"
        style={listStyle}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        testID="explore-empty"
      >
        {listHeader}
        <EmptyState
          title={t(exploreMessages.emptyTitle)}
          body={t(exploreMessages.emptyBody)}
          actionLabel={t(exploreMessages.emptyAction)}
          illustration={emptySearchIllustration}
          onAction={() => {
            resetDiscoveryFilters();
          }}
        />
      </ScrollView>
    );
  }

  return (
    <LegendList
      data={activities}
      keyExtractor={(item) => item.id}
      recycleItems
      estimatedListSize={{ width, height }}
      renderItem={({ item }) => <ActivityCard activity={item} />}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.4}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListHeaderComponent={listHeader}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footer}>
            <ActivityIndicator color={theme.colors.accent} />
          </View>
        ) : null
      }
      contentContainerStyle={contentStyle}
      contentInsetAdjustmentBehavior="never"
      refScrollView={scrollRef as never}
      style={listStyle}
      testID="explore-list"
    />
  );
}

const styles = StyleSheet.create({
  emptyScroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.space24,
  },
  footer: {
    paddingVertical: spacing.space16,
  },
  list: {
    // Size comes from useWindowDimensions at the call site.
  },
  listPad: {
    paddingBottom: spacing.space32,
    paddingHorizontal: spacing.space24,
  },
});
