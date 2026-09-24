/**
 * Named constants for local-first state persistence.
 */

/** MMKV storage id shared by persisted Explora stores. */
export const EXPLORA_MMKV_ID = "explora";

/** Legend persist table name for favorites and offline activity snapshots. */
export const FAVORITES_PERSIST_NAME = "explora-favorites";

/** MMKV key for refresh-added catalog activities. */
export const CATALOG_REFRESH_PERSIST_KEY = "explora-refresh-catalog-v1";

/** Schema version for refresh-added catalog persistence. */
export const CATALOG_REFRESH_PERSIST_VERSION = 1;
