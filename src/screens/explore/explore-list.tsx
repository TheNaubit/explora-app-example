import type { Ref } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { AnimatedLegendList } from "@legendapp/list/reanimated";
import { useLingui } from "@lingui/react/macro";
import Animated, { type SharedValue, useAnimatedScrollHandler } from "react-native-reanimated";

import { ActivityCard } from "@/components/activity-card";
import { EmptyState } from "@/components/empty-state";
import { emptySearchIllustration } from "@/illustrations";
import { resetDiscoveryFilters } from "@/state/discovery";
import { ExploreHeader } from "@/screens/explore/explore-header";
import { ExploreStatusBanner } from "@/screens/explore/explore-status-banner";
import { exploreMessages } from "@/screens/explore/messages";
import type { ExploreBannerState } from "@/screens/explore/types";
import { useExploreList } from "@/screens/explore/use-explore-list";
import { spacing, useAppTheme } from "@/theme";

/** Scroll host ref for `@bsky.app/expo-scroll-edge-effect` (callback or object ref). */
type ExploreScrollRef = Ref<unknown>;

type ExploreListProps = {
  banner: ExploreBannerState;
  onBannerChange: (banner: ExploreBannerState) => void;
  refreshing: boolean;
  onRefresh: () => void;
  /**
   * When true, category chips render in the custom iOS header.
   * List header keeps only the status banner.
   */
  filtersInOverlay?: boolean;
  /** Space reserved for the expanded custom header. */
  headerHeight?: number;
  /** Scroll view ref for `@bsky.app/expo-scroll-edge-effect`. */
  scrollRef?: ExploreScrollRef;
  /** Normalized vertical scroll distance for native scroll-linked chrome. */
  scrollOffset?: SharedValue<number>;
};

/**
 * Explore catalog body after Suspense resolves.
 * Uses an explicit window size so LegendList is not height 0 under Native Tabs.
 * Android uses automatic content insets below its native header.
 * iOS reserves space for the expanded custom header.
 */
export function ExploreList({
  banner,
  onBannerChange,
  refreshing,
  onRefresh,
  filtersInOverlay = false,
  headerHeight = 0,
  scrollRef,
  scrollOffset,
}: ExploreListProps) {
  const { t } = useLingui();
  const theme = useAppTheme();
  const { width, height } = useWindowDimensions();
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

  const padTop = headerHeight + spacing.space8;
  const insetBehavior = Platform.OS === "ios" ? "never" : "automatic";
  const listStyle = [styles.list, { width, height, backgroundColor: theme.colors.background }];
  const contentStyle = [styles.listPad, { paddingTop: padTop }];
  const onScroll = useAnimatedScrollHandler((event) => {
    if (scrollOffset === undefined) {
      return;
    }
    const normalizedOffset = event.contentOffset.y + (event.contentInset?.top ?? 0);
    scrollOffset.set(Math.max(0, normalizedOffset));
  });

  if (activities.length === 0) {
    return (
      <Animated.ScrollView
        ref={scrollRef as never}
        contentContainerStyle={[styles.emptyScroll, { paddingTop: padTop }]}
        contentInsetAdjustmentBehavior={insetBehavior}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        onScroll={onScroll}
        onScrollBeginDrag={Keyboard.dismiss}
        scrollEventThrottle={16}
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
      </Animated.ScrollView>
    );
  }

  return (
    <AnimatedLegendList
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
      contentInsetAdjustmentBehavior={insetBehavior}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      onScroll={onScroll}
      onScrollBeginDrag={Keyboard.dismiss}
      scrollEventThrottle={16}
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
