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
  ACTIVITY_CARD_BODY_HEIGHT,
  ACTIVITY_CARD_CAROUSEL_MAX_FONT_SCALE,
  ACTIVITY_CARD_GAP,
  ACTIVITY_CARD_HAPTIC_AMPLITUDE,
  ACTIVITY_CARD_HAPTIC_FREQUENCY,
  ACTIVITY_CARD_MEDIA_ASPECT_RATIO,
  ACTIVITY_CARD_MEDIA_MAX_HEIGHT,
  ACTIVITY_CARD_TOP_SPACING,
} from "@/components/activity-card-carousel/constants";
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
  onScrollPositionChange?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  refreshControl?: ReactElement;
  scrollOffset?: SharedValue<number>;
  scrollRef?: Ref<unknown>;
  testID: string;
};

/** Shared focused activity list for Explore and Saved. */
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
  const cardWidth = width - spacing.space48;
  const mediaHeight = Math.min(
    cardWidth * ACTIVITY_CARD_MEDIA_ASPECT_RATIO,
    ACTIVITY_CARD_MEDIA_MAX_HEIGHT,
  );
  const itemExtent = mediaHeight + ACTIVITY_CARD_BODY_HEIGHT * fontScale + ACTIVITY_CARD_GAP;
  const activityOrderKey = activities.map(({ id }) => id).join("|");
  const settledIndex = useRef(Math.round((initialScrollOffset ?? 0) / itemExtent));
  const focusPadding = usesCardCarousel ? ACTIVITY_CARD_TOP_SPACING : spacing.space8;
  const padTop = headerHeight + focusPadding;
  const endPadding = usesCardCarousel
    ? Math.max(focusPadding, height - padTop - itemExtent)
    : spacing.space32;
  const onScroll = useAnimatedScrollHandler((event) => {
    const normalizedOffset = event.contentOffset.y + (event.contentInset?.top ?? 0);
    if (isReconcilingFocus.get() === 0) {
      cardScrollOffset.set(Math.max(0, normalizedOffset));
    }
    scrollOffset?.set(Math.max(0, normalizedOffset));
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
          <ActivityCard activity={item} favoriteRemovalEffect={favoriteRemovalEffect} />
        )
      }
      itemLayoutAnimation={
        favoriteRemovalEffect && !reduceMotion
          ? LinearTransition.duration(PARTICLE_DISSOLVE_REFLOW_DURATION_MS).easing(
              Easing.bezier(...PARTICLE_DISSOLVE_REFLOW_EASING),
            )
          : undefined
      }
      maintainVisibleContentPosition={favoriteRemovalEffect ? false : undefined}
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
      onScrollBeginDrag={Keyboard.dismiss}
      onScrollEndDrag={onScrollPositionChange}
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
