import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import {
  EXPLORA_MARK_PATH_LENGTH,
  EXPLORA_SPARK_PATH_LENGTH,
  PULL_TO_REFRESH_ACTIVE_STROKE_FRACTION,
  PULL_TO_REFRESH_INDICATOR_HEIGHT,
  PULL_TO_REFRESH_LOOP_MS,
  PULL_TO_REFRESH_MARK_SIZE,
} from "@/components/pull-to-refresh/constants";
import {
  getPullIndicatorState,
  getPullStrokeState,
} from "@/components/pull-to-refresh/pull-to-refresh";
import { useAppTheme } from "@/theme";

const MARK_PATH =
  "M512 224C376 224 276 324 276 456C276 594 414 726 489 793C501 804 523 804 535 793C610 726 748 594 748 456C748 324 648 224 512 224ZM607 355C558 364 468 382 439 424C413 461 431 498 484 518C545 541 575 562 566 599C558 636 507 672 465 701L511 756C578 709 631 662 640 607C650 542 609 497 536 469C500 455 494 443 513 427C534 408 572 399 619 387L607 355Z";
const SPARK_PATH =
  "M680 270C687 303 698 314 732 321C698 328 687 339 680 373C673 339 662 328 628 321C662 314 673 303 680 270Z";

const AnimatedPath = Animated.createAnimatedComponent(Path);

type PullToRefreshIndicatorProps = {
  progress: SharedValue<number>;
  refreshing: boolean;
  top: number;
};

/** Threads-inspired refresh mark that traces the Explora app silhouette. */
export function PullToRefreshIndicator({ progress, refreshing, top }: PullToRefreshIndicatorProps) {
  const theme = useAppTheme();
  const reduceMotion = useReducedMotion();
  const sweep = useSharedValue(0);

  useEffect(() => {
    if (!refreshing || reduceMotion) {
      sweep.set(0);
      return;
    }

    sweep.set(
      withRepeat(
        withTiming(1, {
          duration: PULL_TO_REFRESH_LOOP_MS,
          easing: Easing.linear,
        }),
        -1,
        false,
      ),
    );
  }, [reduceMotion, refreshing, sweep]);

  const containerStyle = useAnimatedStyle(() => {
    const currentProgress = refreshing ? 1 : progress.get();
    const indicatorState = getPullIndicatorState(currentProgress);
    return {
      opacity: indicatorState.opacity,
      transform: [
        {
          translateY: interpolate(
            currentProgress,
            [0, 1],
            [-PULL_TO_REFRESH_INDICATOR_HEIGHT / 2, 0],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: indicatorState.scale,
        },
      ],
    };
  });

  const loadingStyle = useAnimatedStyle(() => ({ opacity: refreshing ? 1 : 0 }));

  const pullStyle = useAnimatedStyle(() => ({ opacity: refreshing ? 0 : 1 }));

  const markPullProps = useAnimatedProps(() => {
    const pullProgress = progress.get();
    return {
      stroke: interpolateColor(pullProgress, [0, 1], [theme.colors.text, theme.colors.accent]),
      strokeDashoffset: getPullStrokeState(pullProgress, EXPLORA_MARK_PATH_LENGTH).strokeDashOffset,
    };
  });
  const sparkPullProps = useAnimatedProps(() => {
    const pullProgress = progress.get();
    const sparkProgress = interpolate(pullProgress, [0.7, 1], [0, 1], Extrapolation.CLAMP);
    return {
      stroke: interpolateColor(pullProgress, [0, 1], [theme.colors.text, theme.colors.accent]),
      strokeDashoffset: getPullStrokeState(sparkProgress, EXPLORA_SPARK_PATH_LENGTH)
        .strokeDashOffset,
    };
  });
  const loadingMarkProps = useAnimatedProps(() => ({
    strokeDashoffset: reduceMotion ? 0 : -EXPLORA_MARK_PATH_LENGTH * sweep.get(),
  }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={[styles.container, { top }, containerStyle]}
      testID="pull-to-refresh-indicator"
    >
      <Svg
        height={PULL_TO_REFRESH_MARK_SIZE}
        viewBox="0 0 1024 1024"
        width={PULL_TO_REFRESH_MARK_SIZE}
      >
        <Path
          d={MARK_PATH}
          fill="none"
          fillRule="evenodd"
          opacity={0.38}
          stroke={theme.colors.textSecondary}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={64}
        />
        <Path
          d={SPARK_PATH}
          fill="none"
          opacity={0.38}
          stroke={theme.colors.textSecondary}
          strokeLinejoin="round"
          strokeWidth={64}
        />
      </Svg>

      <Animated.View style={[styles.markLayer, pullStyle]}>
        <Svg
          height={PULL_TO_REFRESH_MARK_SIZE}
          viewBox="0 0 1024 1024"
          width={PULL_TO_REFRESH_MARK_SIZE}
        >
          <AnimatedPath
            animatedProps={markPullProps}
            d={MARK_PATH}
            fill="none"
            fillRule="evenodd"
            stroke={theme.colors.text}
            strokeDasharray={[EXPLORA_MARK_PATH_LENGTH, EXPLORA_MARK_PATH_LENGTH]}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={72}
            testID="pull-to-refresh-progress-path"
          />
          <AnimatedPath
            animatedProps={sparkPullProps}
            d={SPARK_PATH}
            fill="none"
            stroke={theme.colors.text}
            strokeDasharray={[EXPLORA_SPARK_PATH_LENGTH, EXPLORA_SPARK_PATH_LENGTH]}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={72}
          />
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.markLayer, loadingStyle]}>
        <Svg
          height={PULL_TO_REFRESH_MARK_SIZE}
          viewBox="0 0 1024 1024"
          width={PULL_TO_REFRESH_MARK_SIZE}
        >
          <AnimatedPath
            animatedProps={loadingMarkProps}
            d={MARK_PATH}
            fill="none"
            fillRule="evenodd"
            stroke={theme.colors.accent}
            strokeDasharray={[
              EXPLORA_MARK_PATH_LENGTH * PULL_TO_REFRESH_ACTIVE_STROKE_FRACTION,
              EXPLORA_MARK_PATH_LENGTH * (1 - PULL_TO_REFRESH_ACTIVE_STROKE_FRACTION),
            ]}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={72}
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: PULL_TO_REFRESH_INDICATOR_HEIGHT,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 4,
  },
  markLayer: {
    position: "absolute",
  },
});
