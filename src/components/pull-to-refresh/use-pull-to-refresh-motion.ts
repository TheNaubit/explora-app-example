import { useEffect } from "react";
import { HapticSupport, Settings, useRealtimeComposer } from "react-native-pulsar";
import { type SharedValue, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { getPullHapticValues, getPullProgress } from "@/components/pull-to-refresh/pull-to-refresh";

type PullToRefreshMotion = {
  beginPull: () => void;
  finishPull: () => void;
  progress: SharedValue<number>;
  requestRefresh: () => void;
  updatePull: (normalizedOffset: number) => void;
};

function supportsPullHaptics(): boolean {
  try {
    return Settings.getHapticsSupportLevel() >= HapticSupport.STANDARD_SUPPORT;
  } catch {
    return false;
  }
}

/** Drive the refresh mark and reversible pull haptic from native overscroll. */
export function usePullToRefreshMotion(
  refreshing: boolean,
  onCompletePull: () => void,
): PullToRefreshMotion {
  const progress = useSharedValue(0);
  const pullCommitted = useSharedValue(false);
  const pullIsActive = useSharedValue(false);
  const { set, stop } = useRealtimeComposer();
  const hapticsSupported = supportsPullHaptics();

  function beginPull() {
    "worklet";
    if (refreshing) {
      return;
    }

    pullCommitted.set(false);
    pullIsActive.set(true);
    progress.set(0);
  }

  function updatePull(normalizedOffset: number) {
    "worklet";
    if (refreshing || pullCommitted.get() || !pullIsActive.get()) {
      return;
    }

    const nextProgress = getPullProgress(normalizedOffset);
    progress.set(nextProgress);

    if (nextProgress >= 1 && pullIsActive.get()) {
      pullCommitted.set(true);
      pullIsActive.set(false);
      stop();
      scheduleOnRN(onCompletePull);
      return;
    }

    if (!hapticsSupported) {
      return;
    }

    const hapticValues = getPullHapticValues(nextProgress);
    if (hapticValues === null) {
      stop();
      return;
    }

    set(hapticValues.amplitude, hapticValues.frequency);
  }

  function finishPull() {
    "worklet";
    pullIsActive.set(false);
    if (refreshing || pullCommitted.get()) {
      return;
    }

    progress.set(0);
    stop();
  }

  function requestRefresh() {
    if (pullCommitted.get() || refreshing) {
      return;
    }

    pullCommitted.set(true);
    onCompletePull();
  }

  useEffect(() => {
    if (refreshing) {
      progress.set(1);
      pullCommitted.set(true);
      pullIsActive.set(false);
      stop();
    } else {
      progress.set(0);
      pullIsActive.set(false);
    }

    return stop;
  }, [progress, pullCommitted, pullIsActive, refreshing, stop]);

  return { beginPull, finishPull, progress, requestRefresh, updatePull };
}
