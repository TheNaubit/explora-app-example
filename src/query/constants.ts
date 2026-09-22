/**
 * Shared Query timing defaults for the mock network layer.
 * Named so screens and the client stay aligned.
 */

/** Catalog list and detail stay fresh this long before a background refetch. */
export const QUERY_STALE_TIME_MS = 1000 * 60 * 5;

/**
 * How many times a failed query retries after the first attempt.
 * Network-style mock failures (`errors.networkOffline`, refresh fail) use this path.
 */
export const QUERY_RETRY_COUNT = 3;

/** Base delay for the first retry before exponential growth (ms). */
export const QUERY_RETRY_BASE_DELAY_MS = 1_000;

/** Cap for exponential retry delay (ms). */
export const QUERY_RETRY_MAX_DELAY_MS = 30_000;

/** Max random jitter added to each retry delay (ms). Avoids synchronized retries. */
export const QUERY_RETRY_JITTER_MS = 100;

/**
 * Exponential backoff with jitter for Query retries.
 * attemptIndex 0 is the first retry after the initial failure.
 */
export function getQueryRetryDelay(attemptIndex: number): number {
  const baseDelay = Math.min(
    QUERY_RETRY_BASE_DELAY_MS * 2 ** attemptIndex,
    QUERY_RETRY_MAX_DELAY_MS,
  );
  const jitter = Math.random() * QUERY_RETRY_JITTER_MS;
  return baseDelay + jitter;
}
