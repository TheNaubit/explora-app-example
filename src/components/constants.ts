/**
 * Shared UI constants for discovery components.
 * Named values avoid magic numbers in StyleSheets and motion.
 */

/** Delay before search text updates the discovery store / query key. */
export const SEARCH_DEBOUNCE_MS = 300;

/** Skeleton rows shown while the first catalog request is pending. */
export const SKELETON_LIST_ROW_COUNT = 6;

/** Minimum touch target size from DESIGN.md (44 × 44 points). */
export const MIN_TOUCH_TARGET = 44;

/** Press scale for cards and chips (DESIGN motion). */
export const PRESS_SCALE = 0.97;

/** Activity card media block height (editorial cover photo). */
export const ACTIVITY_CARD_MEDIA_HEIGHT = 176;

/** Cover photo fade-in after BlurHash (milliseconds). */
export const ACTIVITY_COVER_FADE_MS = 420;

/** Static blur used for the activity card text region. */
export const ACTIVITY_CARD_BACKDROP_BLUR_RADIUS = 36;

/** Relative card positions for the continuous sharp-to-blur mask. */
export const ACTIVITY_CARD_BLUR_MASK_START = 0.3;
export const ACTIVITY_CARD_BLUR_MASK_MID = 0.6;
export const ACTIVITY_CARD_BLUR_MASK_FULL = 0.82;

/** Relative card position where the text contrast scrim starts. */
export const ACTIVITY_CARD_SCRIM_START = 0.58;

/** Font scale that changes card metadata from one row to a vertical stack. */
export const ACTIVITY_CARD_LARGE_TEXT_SCALE = 1.3;

/** Skeleton pulse duration in milliseconds. */
export const SKELETON_PULSE_MS = 1000;

/** Opacity range for skeleton pulse (idle → peak). */
export const SKELETON_OPACITY_MIN = 0.55;
export const SKELETON_OPACITY_MAX = 1;

/** Strong ease-out curve for timed entrances (Emil / DESIGN motion). */
export const EASE_OUT_CURVE = [0.23, 1, 0.32, 1] as const;

/** Entrance duration for occasional state surfaces (empty, error). */
export const STATE_ENTRANCE_MS = 260;

/** Vertical travel for a state surface entrance, in points. */
export const STATE_ENTRANCE_OFFSET = 8;

/** Start scale for a state surface entrance. Never start from zero. */
export const STATE_ENTRANCE_SCALE = 0.98;
