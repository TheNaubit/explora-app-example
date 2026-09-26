/** Scroll distance that completes the shared iOS header collapse. */
export const COLLAPSING_HEADER_DISTANCE = 96;

/** Header travel that leaves space for the compact title. */
export const COLLAPSING_HEADER_TRANSLATION = 68;

/** Height reserved for the compact centered title. */
export const COLLAPSING_HEADER_COMPACT_HEIGHT = 44;

/** Static blur intensity when the native soft edge effect is unavailable. */
export const COLLAPSING_HEADER_BLUR_INTENSITY = 28;

/** Keep collapsed list content directly below the compact title. */
export function getCollapsingHeaderTranslation(bodyHeight: number): number {
  return Math.max(0, bodyHeight - COLLAPSING_HEADER_COMPACT_HEIGHT);
}

/**
 * Largest text scale for the expanded display title.
 * Native iOS large titles also stop growing at accessibility sizes.
 * The cap keeps one-word titles such as "Favorites" on one line.
 */
export const COLLAPSING_HEADER_TITLE_MAX_FONT_SCALE = 1.5;
