import {
  PULL_HAPTIC_AMPLITUDE,
  PULL_HAPTIC_FREQUENCY,
  PULL_HAPTIC_START_PROGRESS,
  PULL_TO_REFRESH_INITIAL_SCALE,
  PULL_TO_REFRESH_THRESHOLD,
} from "@/components/pull-to-refresh/constants";

type PullHapticValues = {
  amplitude: number;
  frequency: number;
};

type PullStrokeState = {
  strokeDashOffset: number;
};

type PullIndicatorState = {
  opacity: number;
  scale: number;
};

function clampUnit(value: number): number {
  "worklet";
  return Math.min(1, Math.max(0, value));
}

/** Convert the normalized list offset to pull completion. */
export function getPullProgress(normalizedOffset: number): number {
  "worklet";
  return clampUnit(-normalizedOffset / PULL_TO_REFRESH_THRESHOLD);
}

/** Reveal the outline continuously as pull progress increases. */
export function getPullStrokeState(progress: number, pathLength: number): PullStrokeState {
  "worklet";
  const clampedProgress = clampUnit(progress);

  return {
    strokeDashOffset: pathLength * (1 - clampedProgress),
  };
}

/** Keep partial pulls smaller and translucent until the refresh is armed. */
export function getPullIndicatorState(progress: number): PullIndicatorState {
  "worklet";
  const clampedProgress = clampUnit(progress);

  return {
    opacity: clampedProgress,
    scale: PULL_TO_REFRESH_INITIAL_SCALE + (1 - PULL_TO_REFRESH_INITIAL_SCALE) * clampedProgress,
  };
}

/** Return a reversible coil-like Pulsar modulation for pull progress. */
export function getPullHapticValues(progress: number): PullHapticValues | null {
  "worklet";
  const clampedProgress = clampUnit(progress);

  if (clampedProgress < PULL_HAPTIC_START_PROGRESS) {
    return null;
  }

  const normalizedProgress =
    (clampedProgress - PULL_HAPTIC_START_PROGRESS) / (1 - PULL_HAPTIC_START_PROGRESS);
  const easedProgress = normalizedProgress * normalizedProgress * (3 - 2 * normalizedProgress);

  return {
    amplitude:
      PULL_HAPTIC_AMPLITUDE.start +
      (PULL_HAPTIC_AMPLITUDE.end - PULL_HAPTIC_AMPLITUDE.start) * easedProgress,
    frequency:
      PULL_HAPTIC_FREQUENCY.start +
      (PULL_HAPTIC_FREQUENCY.end - PULL_HAPTIC_FREQUENCY.start) * easedProgress,
  };
}
