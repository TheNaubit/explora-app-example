/** Hero ratio keeps the card-to-detail zoom visually related. A square gives the photo room. */
export const ACTIVITY_DETAIL_HERO_ASPECT_RATIO = 1;

/** Maximum hero height on tall or wide devices. */
export const ACTIVITY_DETAIL_HERO_MAX_HEIGHT = 440;

/** Scroll event interval for scroll-linked detail motion (one frame at 60 fps). */
export const ACTIVITY_DETAIL_SCROLL_EVENT_THROTTLE_MS = 16;

/** Compact bar height below the safe area. It holds the 44-point hero controls. */
export const ACTIVITY_DETAIL_COMPACT_BAR_HEIGHT = 56;

/** Scroll distance over which the compact bar fades in. */
export const ACTIVITY_DETAIL_COMPACT_BAR_FADE_DISTANCE = 56;

/** Visual size of a fact symbol. */
export const ACTIVITY_DETAIL_FACT_ICON_SIZE = 20;

/** Tonal frame around a fact symbol. */
export const ACTIVITY_DETAIL_FACT_ICON_FRAME = 40;

/** Static blur for the lower hero copy. */
export const ACTIVITY_DETAIL_HERO_BLUR_RADIUS = 32;

/** Start of the lower sharp-to-blur crossfade. */
export const ACTIVITY_DETAIL_HERO_BLUR_MASK_START = 0.5;

/** Midpoint of the lower sharp-to-blur crossfade. */
export const ACTIVITY_DETAIL_HERO_BLUR_MASK_MID = 0.7;

/** Point where the blurred hero copy becomes fully visible. */
export const ACTIVITY_DETAIL_HERO_BLUR_MASK_FULL = 0.9;

/** Start of the final hero-to-screen surface fade. */
export const ACTIVITY_DETAIL_HERO_SURFACE_FADE_START = 0.7;

/** Extra scroll space keeps the final detail action above the floating tab bar. */
export const ACTIVITY_DETAIL_BOTTOM_CHROME_CLEARANCE = 72;

/** Visual size for hero chrome. The press target remains 44 points. */
export const ACTIVITY_DETAIL_HERO_ICON_SIZE = 20;
