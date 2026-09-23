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

/** Activity card media block height (editorial cover photo). */
export const ACTIVITY_CARD_MEDIA_HEIGHT = 176;

/** Cover photo fade-in after BlurHash (milliseconds). */
export const ACTIVITY_COVER_FADE_MS = 420;

/** Static blur used for the activity card text region. */
export const ACTIVITY_CARD_BACKDROP_BLUR_RADIUS = 36;

/** Progressive blur frames, measured from the card bottom. */
export const ACTIVITY_CARD_BLUR_SOFT_FRAME_HEIGHT = "54%";
export const ACTIVITY_CARD_BLUR_MEDIUM_FRAME_HEIGHT = "42%";
export const ACTIVITY_CARD_BLUR_STRONG_FRAME_HEIGHT = "30%";

/** Image heights keep each cropped blur layer aligned with the full cover. */
export const ACTIVITY_CARD_BLUR_SOFT_IMAGE_HEIGHT = "185%";
export const ACTIVITY_CARD_BLUR_MEDIUM_IMAGE_HEIGHT = "238%";
export const ACTIVITY_CARD_BLUR_STRONG_IMAGE_HEIGHT = "333%";

/** Opacity steps soften the boundaries between blur layers. */
export const ACTIVITY_CARD_BLUR_SOFT_OPACITY = 0.28;
export const ACTIVITY_CARD_BLUR_MEDIUM_OPACITY = 0.56;

/** Relative card position where the text contrast scrim starts. */
export const ACTIVITY_CARD_SCRIM_START = 0.58;

/** Font scale that changes card metadata from one row to a vertical stack. */
export const ACTIVITY_CARD_LARGE_TEXT_SCALE = 1.3;

/** Skeleton pulse duration in milliseconds. */
export const SKELETON_PULSE_MS = 1000;

/** Opacity range for skeleton pulse (idle → peak). */
export const SKELETON_OPACITY_MIN = 0.55;
export const SKELETON_OPACITY_MAX = 1;
