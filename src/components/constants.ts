/**
 * Shared UI constants for discovery components.
 * Named values avoid magic numbers in StyleSheets and motion.
 */

/** Delay before search text updates the discovery store / query key. */
export const SEARCH_DEBOUNCE_MS = 300;

/** Skeleton rows shown while the catalog Suspense fallback is visible. */
export const SKELETON_LIST_ROW_COUNT = 6;

/** Minimum touch target size from DESIGN.md (44 × 44 points). */
export const MIN_TOUCH_TARGET = 44;

/** Press scale for cards and chips (DESIGN motion). */
export const PRESS_SCALE = 0.97;

/** Activity card media block height when the dataset has no image URL. */
export const ACTIVITY_CARD_MEDIA_HEIGHT = 140;

/** Skeleton pulse duration in milliseconds. */
export const SKELETON_PULSE_MS = 1000;

/** Opacity range for skeleton pulse (idle → peak). */
export const SKELETON_OPACITY_MIN = 0.55;
export const SKELETON_OPACITY_MAX = 1;
