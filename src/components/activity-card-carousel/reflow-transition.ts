import type { LayoutAnimationFunction, SharedValue } from "react-native-reanimated";
import { Easing, withTiming } from "react-native-reanimated";

import {
  PARTICLE_DISSOLVE_REFLOW_DURATION_MS,
  PARTICLE_DISSOLVE_REFLOW_EASING,
} from "@/components/particle-dissolve/constants";

/**
 * Build the Favorites card layout transition.
 * The list keeps one stable transition, because Legend List remounts its cards when the
 * transition prop turns on or off. The transition reads `armed` on the UI thread:
 * - `armed` is 0: the card moves to its target at once. This covers the first placement,
 *   a return to the tab, and text size changes.
 * - `armed` is 1: the card reflows over the particle-dissolve reflow duration.
 */
export function createGatedReflowTransition(armed: SharedValue<number>): LayoutAnimationFunction {
  const config = {
    duration: PARTICLE_DISSOLVE_REFLOW_DURATION_MS,
    easing: Easing.bezier(...PARTICLE_DISSOLVE_REFLOW_EASING),
  };

  return (values) => {
    "worklet";
    if (armed.get() === 0) {
      return {
        initialValues: {
          height: values.targetHeight,
          originX: values.targetOriginX,
          originY: values.targetOriginY,
          width: values.targetWidth,
        },
        animations: {},
      };
    }

    return {
      initialValues: {
        height: values.currentHeight,
        originX: values.currentOriginX,
        originY: values.currentOriginY,
        width: values.currentWidth,
      },
      animations: {
        height: withTiming(values.targetHeight, config),
        originX: withTiming(values.targetOriginX, config),
        originY: withTiming(values.targetOriginY, config),
        width: withTiming(values.targetWidth, config),
      },
    };
  };
}
