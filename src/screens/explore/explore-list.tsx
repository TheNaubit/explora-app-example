import { useRef, type Ref } from "react";
import {
  ActivityIndicator,
  Keyboard,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { AnimatedLegendList } from "@legendapp/list/reanimated";
import { useLingui } from "@lingui/react/macro";
import { Settings, HapticSupport, useRealtimeComposer } from "react-native-pulsar";
import Animated, {
  type SharedValue,
  useAnimatedScrollHandler,
  useReducedMotion,
  useSharedValue,
} from "react-native-reanimated";

import { ActivityCard } from "@/components/activity-card";
import { EmptyState } from "@/components/empty-state";
import { emptySearchIllustration } from "@/illustrations";
import { resetDiscoveryFilters } from "@/state/discovery";
import { ExploreActivityCard } from "@/screens/explore/explore-activity-card";
import { ExploreHeader } from "@/screens/explore/explore-header";
import { ExploreStatusBanner } from "@/screens/explore/explore-status-banner";
import { exploreMessages } from "@/screens/explore/messages";
import {
  EXPLORE_CARD_BODY_HEIGHT,
  EXPLORE_CARD_CAROUSEL_MAX_FONT_SCALE,
  EXPLORE_CARD_GAP,
  EXPLORE_CARD_HAPTIC_AMPLITUDE,
  EXPLORE_CARD_HAPTIC_FREQUENCY,
  EXPLORE_CARD_MEDIA_ASPECT_RATIO,
  EXPLORE_CARD_MEDIA_MAX_HEIGHT,
  EXPLORE_CARD_TOP_SPACING,
} from "@/screens/explore/constants";
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
  const { width, height, fontScale: measuredFontScale } = useWindowDimensions();
  const fontScale = measuredFontScale ?? 1;
  const { activities, isFetchingNextPage, handleEndReached } = useExploreList({ onBannerChange });
  const cardScrollOffset = useSharedValue(0);
  const reduceMotion = useReducedMotion();
  const settledIndex = useRef(0);
  const { playDiscrete } = useRealtimeComposer();
  const usesCardCarousel =
    Platform.OS !== "web" && !reduceMotion && fontScale <= EXPLORE_CARD_CAROUSEL_MAX_FONT_SCALE;
  const cardWidth = width - spacing.space48;
  const mediaHeight = Math.min(
    cardWidth * EXPLORE_CARD_MEDIA_ASPECT_RATIO,
    EXPLORE_CARD_MEDIA_MAX_HEIGHT,
  );
  const itemExtent = mediaHeight + EXPLORE_CARD_BODY_HEIGHT * fontScale + EXPLORE_CARD_GAP;
  const focusPadding = usesCardCarousel ? EXPLORE_CARD_TOP_SPACING : spacing.space8;

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

  const padTop = headerHeight + focusPadding;
  const endPadding = usesCardCarousel
    ? Math.max(focusPadding, height - padTop - itemExtent)
    : spacing.space32;
  const insetBehavior = Platform.OS === "ios" ? "never" : "automatic";
  const listStyle = [styles.list, { width, height, backgroundColor: theme.colors.background }];
  const contentStyle = [styles.listPad, { paddingTop: padTop }];
  const onScroll = useAnimatedScrollHandler((event) => {
    const normalizedOffset = event.contentOffset.y + (event.contentInset?.top ?? 0);
    cardScrollOffset.set(Math.max(0, normalizedOffset));
    scrollOffset?.set(Math.max(0, normalizedOffset));
  });

  function handleMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (!usesCardCarousel) {
      return;
    }

    const normalizedOffset = Math.max(
      0,
      event.nativeEvent.contentOffset.y + (event.nativeEvent.contentInset?.top ?? 0),
    );
    const nextIndex = Math.round(normalizedOffset / itemExtent);
    if (nextIndex === settledIndex.current) {
      return;
    }
    settledIndex.current = nextIndex;

    try {
      if (Settings.getHapticsSupportLevel() >= HapticSupport.STANDARD_SUPPORT) {
        playDiscrete(EXPLORE_CARD_HAPTIC_AMPLITUDE, EXPLORE_CARD_HAPTIC_FREQUENCY);
      }
    } catch {
      // Keep scrolling usable when the device cannot play haptics.
    }
  }

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
      renderItem={({ item, index }) =>
        usesCardCarousel ? (
          <ExploreActivityCard
            activity={item}
            index={index}
            itemExtent={itemExtent}
            mediaHeight={mediaHeight}
            scrollOffset={cardScrollOffset}
            followsCollapsingHeader={filtersInOverlay}
          />
        ) : (
          <ActivityCard activity={item} />
        )
      }
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
      contentContainerStyle={[contentStyle, { paddingBottom: endPadding }]}
      contentInsetAdjustmentBehavior={insetBehavior}
      decelerationRate={usesCardCarousel ? "fast" : "normal"}
      disableIntervalMomentum={usesCardCarousel}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      onMomentumScrollEnd={handleMomentumScrollEnd}
      onScroll={onScroll}
      onScrollBeginDrag={Keyboard.dismiss}
      snapToAlignment={usesCardCarousel ? "start" : undefined}
      snapToInterval={usesCardCarousel ? itemExtent : undefined}
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
