import { useRef, type Ref } from "react";
import {
  ActivityIndicator,
  Keyboard,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useLingui } from "@lingui/react/macro";
import Animated, { type SharedValue, useAnimatedScrollHandler } from "react-native-reanimated";

import { ActivityCardCarousel } from "@/components/activity-card-carousel";
import { EmptyState } from "@/components/empty-state";
import { PullToRefreshIndicator, usePullToRefreshMotion } from "@/components/pull-to-refresh";
import { HIDDEN_REFRESH_CONTROL_COLOR } from "@/components/pull-to-refresh/constants";
import { emptySearchIllustration } from "@/illustrations";
import { resolveErrorMessage } from "@/i18n";
import { isApiError } from "@/query/errors";
import type { ActivityListFilters } from "@/query/keys";
import {
  getDiscoveryScrollOffset,
  resetDiscoveryFilters,
  setDiscoveryScrollOffset,
} from "@/state/discovery";
import { ExploreHeader } from "@/screens/explore/explore-header";
import { ExploreLoadError } from "@/screens/explore/explore-load-error";
import { ExploreSkeleton } from "@/screens/explore/explore-skeleton";
import { ExploreStatusBanner } from "@/screens/explore/explore-status-banner";
import { exploreMessages } from "@/screens/explore/messages";
import type { DiscoveryMode, ExploreBannerState } from "@/screens/explore/types";
import { useExploreList } from "@/screens/explore/use-explore-list";
import { spacing, useAppTheme } from "@/theme";

type ExploreListProps = {
  banner: ExploreBannerState;
  filters: ActivityListFilters;
  mode: DiscoveryMode;
  onBannerChange: (banner: ExploreBannerState) => void;
  refreshing: boolean;
  onRefresh: () => void;
  filtersInOverlay?: boolean;
  headerHeight?: number;
  scrollRef?: Ref<unknown>;
  scrollOffset?: SharedValue<number>;
};

/**
 * Explore catalog body with explicit loading, error, empty, and content states.
 * Uses an explicit window size so LegendList is not height 0 under Native Tabs.
 * Native platforms use automatic insets below their Stack headers.
 */
export function ExploreList({
  banner,
  filters,
  mode,
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
  const { activities, error, isPending, isFetchingNextPage, handleEndReached, refetch } =
    useExploreList({
      filters,
      onBannerChange,
    });
  const hasActiveFilters = filters.search.length > 0 || filters.categories.length > 0;
  const initialScrollOffset = useRef(getDiscoveryScrollOffset(filters)).current;
  const pullToRefresh = usePullToRefreshMotion(refreshing, onRefresh);

  const bannerNode =
    banner !== null ? (
      <ExploreStatusBanner
        banner={banner}
        onDismiss={() => onBannerChange(null)}
        onRetryNextPage={() => {
          void handleEndReached();
        }}
      />
    ) : null;

  const listHeader = filtersInOverlay ? null : <ExploreHeader />;

  const padTop = headerHeight + spacing.space8;
  const listStyle = [styles.list, { width, height, backgroundColor: theme.colors.background }];
  const onScroll = useAnimatedScrollHandler((event) => {
    const normalizedOffset = event.contentOffset.y + (event.contentInset?.top ?? 0);
    scrollOffset?.set(Math.max(0, normalizedOffset));
    pullToRefresh.updatePull(normalizedOffset);
  });

  const insetBehavior = filtersInOverlay ? "never" : "automatic";
  const refreshControl = (
    <RefreshControl
      accessibilityLabel={t(exploreMessages.refreshAction)}
      accessibilityState={{ busy: refreshing }}
      colors={[HIDDEN_REFRESH_CONTROL_COLOR]}
      progressBackgroundColor={HIDDEN_REFRESH_CONTROL_COLOR}
      refreshing={refreshing}
      tintColor={HIDDEN_REFRESH_CONTROL_COLOR}
      onRefresh={pullToRefresh.requestRefresh}
    />
  );
  const refreshIndicator = (
    <PullToRefreshIndicator
      progress={pullToRefresh.progress}
      refreshing={refreshing}
      top={padTop}
    />
  );

  function handleScrollPositionChange(event: NativeSyntheticEvent<NativeScrollEvent>) {
    setDiscoveryScrollOffset(filters, event.nativeEvent.contentOffset.y);
  }

  function handleScrollBeginDrag() {
    Keyboard.dismiss();
    pullToRefresh.beginPull();
  }

  function handleScrollEndDrag(event: NativeSyntheticEvent<NativeScrollEvent>) {
    handleScrollPositionChange(event);
    pullToRefresh.finishPull();
  }

  if (isPending) {
    return (
      <ExploreSkeleton
        filtersInOverlay={filtersInOverlay}
        headerHeight={headerHeight}
        scrollOffset={scrollOffset}
        scrollRef={scrollRef}
        showFilters={!filtersInOverlay}
      />
    );
  }

  if (error !== null && activities.length === 0) {
    const errorKey = isApiError(error) ? error.errorKey : "errors.unknown";

    return (
      <ExploreLoadError
        body={t(resolveErrorMessage(errorKey))}
        errorKey={errorKey}
        filtersInOverlay={filtersInOverlay}
        headerHeight={headerHeight}
        onRetry={() => {
          void refetch();
        }}
        retryLabel={t(exploreMessages.loadErrorRetry)}
        scrollOffset={scrollOffset}
        scrollRef={scrollRef}
        title={t(exploreMessages.loadErrorTitle)}
      />
    );
  }

  if (activities.length === 0) {
    return (
      <View style={styles.root}>
        <Animated.ScrollView
          ref={scrollRef as never}
          contentContainerStyle={[styles.emptyScroll, { paddingTop: padTop }]}
          contentInsetAdjustmentBehavior={insetBehavior}
          contentOffset={{ x: 0, y: initialScrollOffset }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          onScroll={onScroll}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          refreshControl={refreshControl}
          scrollEventThrottle={16}
          style={listStyle}
          testID={mode === "search" ? "search-empty" : "explore-empty"}
        >
          {listHeader}
          <EmptyState
            title={t(
              hasActiveFilters ? exploreMessages.emptyTitle : exploreMessages.browseEmptyTitle,
            )}
            body={t(hasActiveFilters ? exploreMessages.emptyBody : exploreMessages.browseEmptyBody)}
            actionLabel={t(
              hasActiveFilters ? exploreMessages.emptyAction : exploreMessages.browseEmptyAction,
            )}
            illustration={emptySearchIllustration}
            onAction={() => {
              if (hasActiveFilters) {
                resetDiscoveryFilters();
                return;
              }
              onRefresh();
            }}
          />
        </Animated.ScrollView>
        {refreshIndicator}
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ActivityCardCarousel
        activities={activities}
        initialScrollOffset={initialScrollOffset}
        followsCollapsingHeader={filtersInOverlay}
        headerHeight={headerHeight}
        onEndReached={handleEndReached}
        onPullBegin={pullToRefresh.beginPull}
        onPullEnd={pullToRefresh.finishPull}
        onPullOffsetChange={pullToRefresh.updatePull}
        refreshControl={refreshControl}
        listHeaderComponent={listHeader}
        listFooterComponent={
          bannerNode ??
          (isFetchingNextPage ? (
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={styles.footer}
              testID="explore-next-page-progress"
            >
              <ActivityIndicator color={theme.colors.accent} />
            </View>
          ) : null)
        }
        onScrollPositionChange={handleScrollPositionChange}
        scrollOffset={scrollOffset}
        scrollRef={scrollRef}
        testID={mode === "search" ? "search-list" : "explore-list"}
      />
      {refreshIndicator}
    </View>
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
  root: {
    flex: 1,
  },
});
