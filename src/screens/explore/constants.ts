/**
 * Explore screen layout constants.
 */

/** Expanded custom iOS header height below the safe area. */
export const IOS_EXPLORE_HEADER_BODY_HEIGHT = 176;

/** Extra header height for each Dynamic Type scale step above the default. */
export const IOS_EXPLORE_HEADER_FONT_SCALE_ALLOWANCE = 72;

/** Scroll distance that completes the custom iOS header collapse. */
export const IOS_EXPLORE_HEADER_COLLAPSE_DISTANCE = 96;

/** Header travel that places the chip row below the compact title. */
export const IOS_EXPLORE_HEADER_TRANSLATION = 68;

/** Static blur intensity for iOS versions without the native soft edge effect. */
export const IOS_EXPLORE_HEADER_BLUR_INTENSITY = 28;

/** Focused Explore card image height as a fraction of the card width. */
export const EXPLORE_CARD_MEDIA_ASPECT_RATIO = 1.03;

/** Maximum focused Explore card image height on large phones. */
export const EXPLORE_CARD_MEDIA_MAX_HEIGHT = 360;

/** Estimated card body height for the fixed carousel step. */
export const EXPLORE_CARD_BODY_HEIGHT = 96;

/** Vertical space between focused Explore cards. */
export const EXPLORE_CARD_GAP = 4;

/** Space between the expanded Explore header and the first focused card. */
export const EXPLORE_CARD_TOP_SPACING = 12;

/** Scale for cards that are one or more positions from the focus point. */
export const EXPLORE_CARD_INACTIVE_SCALE = 0.92;

/** Opacity for cards that are one or more positions from the focus point. */
export const EXPLORE_CARD_INACTIVE_OPACITY = 0.52;

/** Largest font scale that keeps the fixed-step carousel layout safe. */
export const EXPLORE_CARD_CAROUSEL_MAX_FONT_SCALE = 1.3;

/** A soft, crisp Pulsar detent for a newly settled card. */
export const EXPLORE_CARD_HAPTIC_AMPLITUDE = 0.26;

/** Higher frequency keeps the card detent precise instead of heavy. */
export const EXPLORE_CARD_HAPTIC_FREQUENCY = 0.72;
