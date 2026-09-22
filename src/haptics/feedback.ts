import { Presets, Settings, HapticSupport } from "react-native-pulsar";

/**
 * Play a Pulsar preset when the device supports haptics.
 * Silent no-op when support is missing or playback throws.
 */
function playSafe(play: () => void): void {
  try {
    const level = Settings.getHapticsSupportLevel();
    if (level < HapticSupport.STANDARD_SUPPORT) {
      return;
    }
    play();
  } catch {
    // Keep the UI flow usable without haptics.
  }
}

/** Favorite saved. */
export function hapticFavoriteSaved(): void {
  playSafe(() => {
    Presets.System.notificationSuccess();
  });
}

/** Favorite removed. */
export function hapticFavoriteRemoved(): void {
  playSafe(() => {
    Presets.System.impactSoft();
  });
}

/** Catalog refresh succeeded (+1 activity). */
export function hapticRefreshSuccess(): void {
  playSafe(() => {
    Presets.System.notificationSuccess();
  });
}

/** Refresh or other recoverable action failed. */
export function hapticActionError(): void {
  playSafe(() => {
    Presets.System.notificationError();
  });
}
