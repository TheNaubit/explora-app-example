import { useEffect } from "react";
import {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  EASE_OUT_CURVE,
  STATE_ENTRANCE_MS,
  STATE_ENTRANCE_OFFSET,
  STATE_ENTRANCE_SCALE,
} from "@/components/constants";

/**
 * Start opacity. It stays above zero, because iOS hides fully transparent views from VoiceOver.
 */
const ENTRANCE_START_OPACITY = 0.02;

/**
 * Return an animated style that brings a state surface in once on mount.
 * The surface fades, rises, and settles from a near-full scale.
 * Reduced motion shows the surface at once.
 */
export function useStateEntrance() {
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(
      withTiming(1, {
        duration: STATE_ENTRANCE_MS,
        easing: Easing.bezier(...EASE_OUT_CURVE),
      }),
    );
  }, [progress]);

  return useAnimatedStyle(() => {
    if (reducedMotion) {
      return { opacity: 1 };
    }

    const value = progress.get();

    return {
      opacity: ENTRANCE_START_OPACITY + (1 - ENTRANCE_START_OPACITY) * value,
      transform: [
        { translateY: (1 - value) * STATE_ENTRANCE_OFFSET },
        { scale: STATE_ENTRANCE_SCALE + (1 - STATE_ENTRANCE_SCALE) * value },
      ],
    };
  });
}
