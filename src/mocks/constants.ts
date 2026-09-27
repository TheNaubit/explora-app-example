/**
 * Named constants for the client mock catalog and generators.
 * Prefer these over inline numbers or string prefixes in mock code.
 */

/** Number of activities in the supplied assessment dataset. */
export const SUPPLIED_CATALOG_SIZE = 12;

/** Assessment minimum for locally generated performance activities. */
export const PERFORMANCE_GENERATED_ACTIVITY_COUNT = 1_000;

/** Performance dataset size: 12 supplied activities plus 1,000 generated activities. */
export const PERFORMANCE_CATALOG_SIZE =
  SUPPLIED_CATALOG_SIZE + PERFORMANCE_GENERATED_ACTIVITY_COUNT;

/**
 * Fixed Faker base seed for performance-scale generated activities.
 * `seedCatalog` uses `CATALOG_FAKER_BASE_SEED + index` so titles stay stable across runs.
 */
export const CATALOG_FAKER_BASE_SEED = 42_001;

/**
 * Fixed Faker base seed for refresh-created activities.
 * `prependRefreshActivity` uses `REFRESH_FAKER_BASE_SEED + sequence`.
 * Kept far above `CATALOG_FAKER_BASE_SEED` so refresh items do not collide with seed streams.
 */
export const REFRESH_FAKER_BASE_SEED = 90_000;

/** Id prefix for activities created by `seedCatalog` (`gen-0001`, …). */
export const GENERATED_ACTIVITY_ID_PREFIX = "gen-";

/** Id prefix for activities created by a successful refresh (`ref-0001`, …). */
export const REFRESH_ACTIVITY_ID_PREFIX = "ref-";

/** Zero-pad width for generated and refresh activity id suffixes. */
export const ACTIVITY_ID_PAD_LENGTH = 4;

/** Shortest generated activity duration in minutes. */
export const GENERATED_DURATION_MINUTES_MIN = 15;

/** Longest generated activity duration in minutes. */
export const GENERATED_DURATION_MINUTES_MAX = 240;

/**
 * Title suffix appended to Faker product names for generated activities.
 * Not user-facing UI copy; it is fixture data inside the mock catalog.
 */
export const GENERATED_ACTIVITY_TITLE_SUFFIX = " Experience";

/** Mock network delay for a normal (fast) response, in milliseconds. */
export const MOCK_DELAY_NORMAL_MS = 40;

/** Mock network delay for a slow response, in milliseconds. */
export const MOCK_DELAY_SLOW_MS = 10_000;

/**
 * Default page size for paginated `listActivities`.
 * Keeps infinite-scroll pages small enough to exercise many fetches on a 1k catalog.
 */
export const LIST_PAGE_SIZE = 20;
