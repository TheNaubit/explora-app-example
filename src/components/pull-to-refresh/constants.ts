/** Pull distance that completes the refresh mark and arms native refresh. */
export const PULL_TO_REFRESH_THRESHOLD = 72;

/** Smallest pull that starts continuous haptic feedback. */
export const PULL_HAPTIC_START_PROGRESS = 0.08;

/** Pull haptic amplitude range. Values stay inside the Pulsar 0-1 contract. */
export const PULL_HAPTIC_AMPLITUDE = { start: 0.06, end: 0.34 } as const;

/** Pull haptic frequency range. The rise creates a coil-like tension. */
export const PULL_HAPTIC_FREQUENCY = { start: 0.18, end: 0.8 } as const;

/** Size of the custom refresh mark. */
export const PULL_TO_REFRESH_MARK_SIZE = 48;

/** Smallest scale used when the refresh mark starts to appear. */
export const PULL_TO_REFRESH_INITIAL_SCALE = 0.88;

/** Height reserved for the mark below the screen header. */
export const PULL_TO_REFRESH_INDICATOR_HEIGHT = 52;

/** Duration of one loading sweep around the app mark. */
export const PULL_TO_REFRESH_LOOP_MS = 760;

/** Fraction of the app-mark path used by the moving loading stroke. */
export const PULL_TO_REFRESH_ACTIVE_STROKE_FRACTION = 0.28;

/** Hide the platform spinner while native refresh gesture handling stays active. */
export const HIDDEN_REFRESH_CONTROL_COLOR = "transparent";

/** Measured length of the compound map-pin silhouette path. */
export const EXPLORA_MARK_PATH_LENGTH = 2868;

/** Measured length of the discovery spark path. */
export const EXPLORA_SPARK_PATH_LENGTH = 318;
