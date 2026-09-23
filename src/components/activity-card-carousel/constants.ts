/** Focused activity card image height as a fraction of the card width. */
export const ACTIVITY_CARD_MEDIA_ASPECT_RATIO = 1.03;

/** Maximum focused activity card image height on large phones. */
export const ACTIVITY_CARD_MEDIA_MAX_HEIGHT = 360;

/** Estimated card body height for the fixed carousel step. */
export const ACTIVITY_CARD_BODY_HEIGHT = 96;

/** Vertical space between focused activity cards. */
export const ACTIVITY_CARD_GAP = 4;

/** Space between the expanded header and the first focused card. */
export const ACTIVITY_CARD_TOP_SPACING = 12;

/** Scale for cards that are one or more positions from the focus point. */
export const ACTIVITY_CARD_INACTIVE_SCALE = 0.92;

/** Opacity for cards that are one or more positions from the focus point. */
export const ACTIVITY_CARD_INACTIVE_OPACITY = 0.52;

/** Blur radius for the image on cards outside the focus point. */
export const ACTIVITY_CARD_INACTIVE_BLUR_RADIUS = 7;

/** Maximum opacity for the static blur layer on an unfocused card. */
export const ACTIVITY_CARD_INACTIVE_BLUR_OPACITY = 0.82;

/** Largest font scale that keeps the fixed-step carousel layout safe. */
export const ACTIVITY_CARD_CAROUSEL_MAX_FONT_SCALE = 1.3;

/** A soft, crisp Pulsar detent for a newly settled card. */
export const ACTIVITY_CARD_HAPTIC_AMPLITUDE = 0.26;

/** Higher frequency keeps the card detent precise instead of heavy. */
export const ACTIVITY_CARD_HAPTIC_FREQUENCY = 0.72;
