import { useEffect, useRef, type ReactElement, type Ref } from "react";
import {
  Keyboard,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { AnimatedLegendList } from "@legendapp/list/reanimated";
import type { LegendListRef } from "@legendapp/list/react-native";
import { HapticSupport, Settings, useRealtimeComposer } from "react-native-pulsar";
import {
  Easing,
  LinearTransition,
  type SharedValue,
  useAnimatedScrollHandler,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ActivityCard } from "@/components/activity-card";
import { ActivityCardCarouselItem } from "@/components/activity-card-carousel/activity-card-carousel-item";
import {
  getReconciledFocusIndex,
  getReconciledScrollParams,
} from "@/components/activity-card-carousel/focus-reconciliation";
import {
  PARTICLE_DISSOLVE_REFLOW_DURATION_MS,
  PARTICLE_DISSOLVE_REFLOW_EASING,
} from "@/components/particle-dissolve/constants";
import {
  ACTIVITY_CARD_CAROUSEL_MAX_FONT_SCALE,
  ACTIVITY_CARD_HAPTIC_AMPLITUDE,
  ACTIVITY_CARD_HAPTIC_FREQUENCY,
} from "@/components/activity-card-carousel/constants";
import { getActivityCardCarouselLayout } from "@/components/activity-card-carousel/layout";
import type { Activity } from "@/schemas/activity";
import { COLLAPSING_HEADER_TRANSLATION } from "@/components/collapsing-screen-header/constants";
import { spacing, useAppTheme } from "@/theme";

type ActivityCardCarouselProps = {
  activities: Activity[];
  favoriteRemovalEffect?: "particle-dissolve";
  followsCollapsingHeader?: boolean;
  headerHeight?: number;
  headerTranslation?: number;
  initialScrollOffset?: number;
  listFooterComponent?: ReactElement | null;
  listHeaderComponent?: ReactElement | null;
  onEndReached?: () => void;
  onPullBegin?: () => void;
  onPullEnd?: () => void;
  onPullOffsetChange?: (normalizedOffset: number) => void;
  onScrollPositionChange?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  refreshControl?: ReactElement;
  scrollOffset?: SharedValue<number>;
  scrollRef?: Ref<unknown>;
  testID: string;
};

/** Shared focused activity list for Explore and Favorites. */
export function ActivityCardCarousel({
  activities,
  favoriteRemovalEffect,
  followsCollapsingHeader = false,
  headerHeight = 0,
  headerTranslation = COLLAPSING_HEADER_TRANSLATION,
  initialScrollOffset,
  listFooterComponent,
  listHeaderComponent,
  onEndReached,
  onPullBegin,
  onPullEnd,
  onPullOffsetChange,
  onScrollPositionChange,
  refreshControl,
  scrollOffset,
  scrollRef,
  testID,
}: ActivityCardCarouselProps) {
  const theme = useAppTheme();
  const { width, height, fontScale: measuredFontScale } = useWindowDimensions();
  const fontScale = measuredFontScale ?? 1;
  const cardScrollOffset = useSharedValue(initialScrollOffset ?? 0);
  const isReconcilingFocus = useSharedValue(0);
  const reduceMotion = useReducedMotion();
  const listRef = useRef<LegendListRef | null>(null);
  const previousActivityIds = useRef(activities.map(({ id }) => id));
  const { playDiscrete } = useRealtimeComposer();
  const usesCardCarousel =
    Platform.OS !== "web" && !reduceMotion && fontScale <= ACTIVITY_CARD_CAROUSEL_MAX_FONT_SCALE;
  const { endPadding, itemExtent, mediaHeight, padTop } = getActivityCardCarouselLayout({
    fontScale,
    headerHeight,
    height,
    usesCardCarousel,
    width,
  });
  const activityOrderKey = activities.map(({ id }) => id).join("|");
  const settledIndex = useRef(Math.round((initialScrollOffset ?? 0) / itemExtent));
  const onScroll = useAnimatedScrollHandler((event) => {
    const normalizedOffset = event.contentOffset.y + (event.contentInset?.top ?? 0);
    if (isReconcilingFocus.get() === 0) {
      cardScrollOffset.set(Math.max(0, normalizedOffset));
    }
    scrollOffset?.set(Math.max(0, normalizedOffset));
    onPullOffsetChange?.(normalizedOffset);
  });

  useEffect(() => {
    const previousIds = previousActivityIds.current;
    const nextIds = activities.map(({ id }) => id);
    previousActivityIds.current = nextIds;

    if (
      !favoriteRemovalEffect ||
      !usesCardCarousel ||
      previousIds.length <= nextIds.length ||
      nextIds.length === 0
    ) {
      return;
    }

    const targetIndex = getReconciledFocusIndex(previousIds, nextIds, settledIndex.current);
    const targetOffset = targetIndex * itemExtent;
    settledIndex.current = targetIndex;
    isReconcilingFocus.set(1);
    cardScrollOffset.set(
      withTiming(targetOffset, {
        duration: PARTICLE_DISSOLVE_REFLOW_DURATION_MS,
        easing: Easing.bezier(...PARTICLE_DISSOLVE_REFLOW_EASING),
      }),
    );

    const scrollFrame = requestAnimationFrame(() => {
      void listRef.current?.scrollToOffset(getReconciledScrollParams(targetOffset));
    });

    const reconciliationTimer = setTimeout(() => {
      cardScrollOffset.set(targetOffset);
      isReconcilingFocus.set(0);
    }, PARTICLE_DISSOLVE_REFLOW_DURATION_MS);

    return () => {
      cancelAnimationFrame(scrollFrame);
      clearTimeout(reconciliationTimer);
    };
  }, [
    activities,
    cardScrollOffset,
    favoriteRemovalEffect,
    isReconcilingFocus,
    itemExtent,
    usesCardCarousel,
  ]);

  function handleMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    onScrollPositionChange?.(event);

    if (!usesCardCarousel) return;

    const normalizedOffset = Math.max(
      0,
      event.nativeEvent.contentOffset.y + (event.nativeEvent.contentInset?.top ?? 0),
    );
    const nextIndex = Math.round(normalizedOffset / itemExtent);
    if (nextIndex === settledIndex.current) return;
    settledIndex.current = nextIndex;

    try {
      if (Settings.getHapticsSupportLevel() >= HapticSupport.STANDARD_SUPPORT) {
        playDiscrete(ACTIVITY_CARD_HAPTIC_AMPLITUDE, ACTIVITY_CARD_HAPTIC_FREQUENCY);
      }
    } catch {
      // Keep scrolling usable when the device cannot play haptics.
    }
  }

  function handleScrollBeginDrag() {
    Keyboard.dismiss();
    onPullBegin?.();
  }

  function handleScrollEndDrag(event: NativeSyntheticEvent<NativeScrollEvent>) {
    onScrollPositionChange?.(event);
    onPullEnd?.();
  }

  return (
    <AnimatedLegendList
      ref={listRef}
      data={activities}
      keyExtractor={(item) => item.id}
      recycleItems
      extraData={activityOrderKey}
      estimatedListSize={{ width, height }}
      initialScrollOffset={initialScrollOffset}
      renderItem={({ item, index }) =>
        usesCardCarousel ? (
          <ActivityCardCarouselItem
            activity={item}
            detailHref={{ pathname: "/activity/[id]", params: { id: item.id } }}
            favoriteRemovalEffect={favoriteRemovalEffect}
            followsCollapsingHeader={followsCollapsingHeader}
            headerTranslation={headerTranslation}
            index={index}
            itemExtent={itemExtent}
            key={`${item.id}-${index}`}
            mediaHeight={mediaHeight}
            scrollOffset={cardScrollOffset}
          />
        ) : (
          <ActivityCard
            activity={item}
            detailHref={{ pathname: "/activity/[id]", params: { id: item.id } }}
            favoriteRemovalEffect={favoriteRemovalEffect}
          />
        )
      }
      itemLayoutAnimation={
        favoriteRemovalEffect && !reduceMotion
          ? LinearTransition.duration(PARTICLE_DISSOLVE_REFLOW_DURATION_MS).easing(
              Easing.bezier(...PARTICLE_DISSOLVE_REFLOW_EASING),
            )
          : undefined
      }
      maintainVisibleContentPosition={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      refreshControl={refreshControl}
      ListHeaderComponent={listHeaderComponent}
      ListFooterComponent={listFooterComponent}
      contentContainerStyle={[styles.listPad, { paddingBottom: endPadding, paddingTop: padTop }]}
      contentInsetAdjustmentBehavior={followsCollapsingHeader ? "never" : "automatic"}
      decelerationRate={usesCardCarousel ? "fast" : "normal"}
      disableIntervalMomentum={usesCardCarousel}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      onMomentumScrollEnd={handleMomentumScrollEnd}
      onScroll={onScroll}
      onScrollBeginDrag={handleScrollBeginDrag}
      onScrollEndDrag={handleScrollEndDrag}
      snapToAlignment={usesCardCarousel ? "start" : undefined}
      snapToInterval={usesCardCarousel ? itemExtent : undefined}
      scrollEventThrottle={16}
      refScrollView={scrollRef as never}
      style={[styles.list, { width, height, backgroundColor: theme.colors.background }]}
      testID={testID}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    // Size comes from useWindowDimensions at the call site.
  },
  listPad: {
    paddingHorizontal: spacing.space24,
  },
});
