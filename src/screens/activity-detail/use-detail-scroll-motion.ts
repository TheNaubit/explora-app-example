import {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import {
  ACTIVITY_DETAIL_COMPACT_BAR_FADE_DISTANCE,
  ACTIVITY_DETAIL_COMPACT_BAR_HEIGHT,
} from "@/screens/activity-detail/constants";
import { getHeroStretch } from "@/screens/activity-detail/hero-stretch";

type DetailScrollMotionOptions = {
  heroHeight: number;
  safeAreaTop: number;
};

/**
 * Scroll-linked motion for Activity Detail.
 * Pull down: the hero stretches. Its top edge stays on the screen top and its bottom edge stays still.
 * Scroll up: the hero scrolls with the copy, and the compact bar fades in.
 * There is no parallax, because the copy must not slide over the blended hero edge.
 */
export function useDetailScrollMotion({ heroHeight, safeAreaTop }: DetailScrollMotionOptions) {
  const scrollY = useSharedValue(0);
  const compactBarHeight = safeAreaTop + ACTIVITY_DETAIL_COMPACT_BAR_HEIGHT;
  const compactBarFadeEnd = Math.max(0, heroHeight - compactBarHeight);
  const compactBarFadeStart = Math.max(
    0,
    compactBarFadeEnd - ACTIVITY_DETAIL_COMPACT_BAR_FADE_DISTANCE,
  );

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.set(event.contentOffset.y);
  });

  const heroStyle = useAnimatedStyle(() => {
    const { scale, translateY } = getHeroStretch(scrollY.get(), heroHeight);
    return { transform: [{ translateY }, { scale }] };
  });

  return {
    compactBarFadeEnd,
    compactBarFadeStart,
    compactBarHeight,
    heroStyle,
    onScroll,
    scrollY,
  };
}
