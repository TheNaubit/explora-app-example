/** Visible dust duration keeps the dense breakup clear without delaying the next selection. */
export const PARTICLE_DISSOLVE_DURATION_MS = 1_100;

/** Duration of the Favorites list handoff. This matches Telegram's 0.8-second delete transition. */
export const PARTICLE_DISSOLVE_REFLOW_DURATION_MS = 800;

/** Strong ease-in-out keeps the visible list movement smooth at both ends. */
export const PARTICLE_DISSOLVE_REFLOW_EASING = [0.77, 0, 0.175, 1] as const;

/** Logical size of each GPU particle block. */
export const PARTICLE_DISSOLVE_PARTICLE_SIZE = 2;

/** Extra canvas area lets particles leave the card without clipping. */
export const PARTICLE_DISSOLVE_CANVAS_PADDING = 96;

/** Portion of the timeline used for the directional dissolve wave. */
export const PARTICLE_DISSOLVE_WAVE_SPAN = 0.5;

/** Random stagger added to the dissolve wave. */
export const PARTICLE_DISSOLVE_RANDOM_STAGGER = 0.08;

/** Shortest particle lifetime as a portion of the full dissolve timeline. */
export const PARTICLE_DISSOLVE_MIN_LIFETIME = 0.44;

/** Longest particle lifetime as a portion of the full dissolve timeline. */
export const PARTICLE_DISSOLVE_MAX_LIFETIME = 0.94;

/** Maximum horizontal particle travel in logical points. */
export const PARTICLE_DISSOLVE_TRAVEL_X = 96;

/** Maximum initial vertical particle travel in logical points. */
export const PARTICLE_DISSOLVE_TRAVEL_Y = 72;

/** Upward acceleration carries the dust toward the top-right. */
export const PARTICLE_DISSOLVE_GRAVITY_Y = -96;

/** Small scale loss prevents expanding tile edges during the exit. */
export const PARTICLE_DISSOLVE_SCALE_LOSS = 0.18;
