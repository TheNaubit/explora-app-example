/** Visible dust duration keeps the dense breakup clear without delaying the next selection. */
export const PARTICLE_DISSOLVE_DURATION_MS = 1_100;

/** Duration of the Saved list handoff. This matches Telegram's 0.8-second delete transition. */
export const PARTICLE_DISSOLVE_REFLOW_DURATION_MS = 800;

/** Strong ease-in-out keeps the visible list movement smooth at both ends. */
export const PARTICLE_DISSOLVE_REFLOW_EASING = [0.77, 0, 0.175, 1] as const;

/** Approximate logical tile size for the captured card texture. */
export const PARTICLE_DISSOLVE_TARGET_TILE_SIZE = 4;

/** Lower bound keeps the card breakup detailed on narrow screens. */
export const PARTICLE_DISSOLVE_MIN_COLUMNS = 18;

/** Upper bound limits the per-frame particle work. */
export const PARTICLE_DISSOLVE_MAX_COLUMNS = 110;

/** Atlas particle cap for iOS, where the reference effect is the primary target. */
export const PARTICLE_DISSOLVE_MAX_PARTICLES_IOS = 12_000;

/** Lower Android particle cap protects slower GPU and UI-thread combinations. */
export const PARTICLE_DISSOLVE_MAX_PARTICLES_ANDROID = 600;

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

/** Downward acceleration keeps the final dust movement physical. */
export const PARTICLE_DISSOLVE_GRAVITY_Y = 96;

/** Small scale loss prevents expanding tile edges during the exit. */
export const PARTICLE_DISSOLVE_SCALE_LOSS = 0.18;

/** Stable constants create deterministic particle directions without stored arrays. */
export const PARTICLE_RANDOM_INDEX_FACTOR = 12.9898;
export const PARTICLE_RANDOM_SALT_FACTOR = 78.233;
export const PARTICLE_RANDOM_FRACTION_FACTOR = 43_758.5453;
