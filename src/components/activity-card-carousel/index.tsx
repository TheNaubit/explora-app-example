import { useEffect, useMemo, useRef, type ReactElement, type Ref } from "react";
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
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useReducedMotion,
  useSharedValue,
} from "react-native-reanimated";

import { ActivityCard } from "@/components/activity-card";
import { ActivityCardCarouselItem } from "@/components/activity-card-carousel/activity-card-carousel-item";
import {
  getReconciledFocusIndex,
  getReconciledScrollParams,
} from "@/components/activity-card-carousel/focus-reconciliation";
import { PARTICLE_DISSOLVE_REFLOW_DURATION_MS } from "@/components/particle-dissolve/constants";
import {
  ACTIVITY_CARD_CAROUSEL_MAX_FONT_SCALE,
  ACTIVITY_CARD_HAPTIC_AMPLITUDE,
  ACTIVITY_CARD_HAPTIC_FREQUENCY,
} from "@/components/activity-card-carousel/constants";
import { getActivityCardCarouselLayout } from "@/components/activity-card-carousel/layout";
import { createGatedReflowTransition } from "@/components/activity-card-carousel/reflow-transition";
import type { Activity } from "@/schemas/activity";
import {
  COLLAPSING_HEADER_DISTANCE,
  COLLAPSING_HEADER_TRANSLATION,
} from "@/components/collapsing-screen-header/constants";
import { spacing, useAppTheme } from "@/theme";

type ActivityCardCarouselProps = {
  activities: Activity[];
  favoriteRemovalEffect?: "particle-dissolve";
  followsCollapsingHeader?: boolean;
  headerHeight?: number;
  headerTranslation?: number;
  initialFocusedIndex?: number;
  initialScrollOffset?: number;
  listFooterComponent?: ReactElement | null;
  listHeaderComponent?: ReactElement | null;
  onEndReached?: () => void;
  onFocusedIndexChange?: (index: number) => void;
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
  initialFocusedIndex,
  initialScrollOffset,
  listFooterComponent,
  listHeaderComponent,
  onEndReached,
  onFocusedIndexChange,
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
  const reduceMotion = useReducedMotion();
  const usesCardCarousel =
    Platform.OS !== "web" && !reduceMotion && fontScale <= ACTIVITY_CARD_CAROUSEL_MAX_FONT_SCALE;
  const { endPadding, itemExtent, mediaHeight, padTop } = getActivityCardCarouselLayout({
    fontScale,
    headerHeight,
    height,
    usesCardCarousel,
    width,
  });
  const startingOffset =
    initialFocusedIndex === undefined ? initialScrollOffset : initialFocusedIndex * itemExtent;
  const resolvedInitialOffset = useRef(startingOffset ?? 0).current;
  const cardScrollOffset = useSharedValue(resolvedInitialOffset);
  const isReconcilingFocus = useSharedValue(0);
  const listRef = useRef<LegendListRef | null>(null);
  const reflowArmed = useSharedValue(0);
  const reflowTransition = useMemo(() => createGatedReflowTransition(reflowArmed), [reflowArmed]);
  const armedOrderKey = useRef<string | null>(null);
  const disarmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousActivityIds = useRef(activities.map(({ id }) => id));
  const { playDiscrete } = useRealtimeComposer();
  const activityOrderKey = activities.map(({ id }) => id).join("|");
  const usesReflowAnimation = favoriteRemovalEffect !== undefined && !reduceMotion;
  const armReflow = usesReflowAnimation
    ? () => {
        armedOrderKey.current = activityOrderKey;
        reflowArmed.set(1);
      }
    : undefined;
  const settledIndex = useRef(Math.round(resolvedInitialOffset / itemExtent));
  // The footer moves with the cards while the header collapses, so it stays next to the last card.
  const footerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: followsCollapsingHeader
          ? interpolate(
              cardScrollOffset.get(),
              [0, COLLAPSING_HEADER_DISTANCE],
              [0, -headerTranslation],
              Extrapolation.CLAMP,
            )
          : 0,
      },
    ],
  }));
  const onScroll = useAnimatedScrollHandler((event) => {
    const normalizedOffset = event.contentOffset.y + (event.contentInset?.top ?? 0);
    if (isReconcilingFocus.get() === 0) {
      cardScrollOffset.set(Math.max(0, normalizedOffset));
    }
    scrollOffset?.set(Math.max(0, normalizedOffset));
    onPullOffsetChange?.(normalizedOffset);
  });

  useEffect(() => {
    scrollOffset?.set(resolvedInitialOffset);
  }, [resolvedInitialOffset, scrollOffset]);

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
    onFocusedIndexChange?.(targetIndex);
    isReconcilingFocus.set(1);
    cardScrollOffset.set(targetOffset);

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
    onFocusedIndexChange,
  ]);

  useEffect(() => {
    // Disarm after the removal has reflowed. The dissolve ends before the list changes.
    if (armedOrderKey.current === null || armedOrderKey.current === activityOrderKey) return;

    armedOrderKey.current = null;
    if (disarmTimer.current) clearTimeout(disarmTimer.current);
    disarmTimer.current = setTimeout(() => {
      reflowArmed.set(0);
      disarmTimer.current = null;
    }, PARTICLE_DISSOLVE_REFLOW_DURATION_MS);
  }, [activityOrderKey, reflowArmed]);

  useEffect(
    () => () => {
      if (disarmTimer.current) clearTimeout(disarmTimer.current);
    },
    [],
  );

  function commitFocusedIndex(nextIndex: number, playHaptic: boolean) {
    const boundedIndex = Math.max(0, Math.min(nextIndex, Math.max(0, activities.length - 1)));
    if (boundedIndex === settledIndex.current) return;
    settledIndex.current = boundedIndex;
    onFocusedIndexChange?.(boundedIndex);

    if (!playHaptic) return;

    try {
      if (Settings.getHapticsSupportLevel() >= HapticSupport.STANDARD_SUPPORT) {
        playDiscrete(ACTIVITY_CARD_HAPTIC_AMPLITUDE, ACTIVITY_CARD_HAPTIC_FREQUENCY);
      }
    } catch {
      // Keep scrolling usable when the device cannot play haptics.
    }
  }

  function getCommittedIndex(event: NativeSyntheticEvent<NativeScrollEvent>): number {
    const nativeEvent = event.nativeEvent;
    const insetTop = nativeEvent.contentInset?.top ?? 0;
    const targetOffset = nativeEvent.targetContentOffset?.y;
    if (targetOffset !== undefined) {
      return Math.round(Math.max(0, targetOffset + insetTop) / itemExtent);
    }

    const normalizedOffset = Math.max(0, nativeEvent.contentOffset.y + insetTop);
    const velocity = nativeEvent.velocity?.y ?? 0;
    if (velocity > 0) return Math.ceil(normalizedOffset / itemExtent);
    if (velocity < 0) return Math.floor(normalizedOffset / itemExtent);
    return Math.round(normalizedOffset / itemExtent);
  }

  function handleMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    onScrollPositionChange?.(event);

    if (!usesCardCarousel) return;

    const normalizedOffset = Math.max(
      0,
      event.nativeEvent.contentOffset.y + (event.nativeEvent.contentInset?.top ?? 0),
    );
    const nextIndex = Math.round(normalizedOffset / itemExtent);
    commitFocusedIndex(nextIndex, false);
  }

  function handleScrollBeginDrag() {
    Keyboard.dismiss();
    onPullBegin?.();
  }

  function handleScrollEndDrag(event: NativeSyntheticEvent<NativeScrollEvent>) {
    onScrollPositionChange?.(event);
    onPullEnd?.();
    if (usesCardCarousel) commitFocusedIndex(getCommittedIndex(event), true);
  }

  return (
    <AnimatedLegendList
      ref={listRef}
      data={activities}
      keyExtractor={(item) => item.id}
      recycleItems
      extraData={activityOrderKey}
      estimatedListSize={{ width, height }}
      initialScrollOffset={resolvedInitialOffset}
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
            onFavoriteRemovalStart={armReflow}
            scrollOffset={cardScrollOffset}
          />
        ) : (
          <ActivityCard
            activity={item}
            detailHref={{ pathname: "/activity/[id]", params: { id: item.id } }}
            favoriteRemovalEffect={favoriteRemovalEffect}
            onFavoriteRemovalStart={armReflow}
          />
        )
      }
      itemLayoutAnimation={usesReflowAnimation ? reflowTransition : undefined}
      maintainVisibleContentPosition={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      refreshControl={refreshControl}
      ListHeaderComponent={listHeaderComponent}
      ListFooterComponent={
        listFooterComponent ? (
          <Animated.View style={footerStyle}>{listFooterComponent}</Animated.View>
        ) : null
      }
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
