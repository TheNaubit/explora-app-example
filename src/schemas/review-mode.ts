import { z } from "zod";

/** First catalog-page behavior for review scenarios. */
export const initialLoadModeSchema = z.enum([
  "normal",
  "slow",
  "empty",
  "fail",
  "timeout",
  "invalid-data",
]);

/** Activity-detail behavior for review scenarios. */
export const detailLoadModeSchema = z.enum([
  "normal",
  "slow",
  "fail",
  "timeout",
  "invalid-data",
  "not-found",
]);

/**
 * Behavior for list pages after the first (`cursor !== null`).
 * Use this to simulate slow or failed loads while scrolling.
 */
export const pageLoadModeSchema = z.enum(["normal", "slow", "fail", "timeout", "invalid-data"]);

/** Refresh behavior for review scenarios. */
export const refreshModeSchema = z.enum(["success", "slow", "fail", "timeout"]);

/**
 * Review-control state for the Dev Tools screen.
 */
export const reviewModeStateSchema = z.object({
  detailLoad: detailLoadModeSchema,
  initialLoad: initialLoadModeSchema,
  pageLoad: pageLoadModeSchema,
  refresh: refreshModeSchema,
});

export type InitialLoadMode = z.infer<typeof initialLoadModeSchema>;
export type DetailLoadMode = z.infer<typeof detailLoadModeSchema>;
export type PageLoadMode = z.infer<typeof pageLoadModeSchema>;
export type RefreshMode = z.infer<typeof refreshModeSchema>;
export type ReviewModeState = z.infer<typeof reviewModeStateSchema>;

export const DEFAULT_REVIEW_MODE_STATE: ReviewModeState = {
  detailLoad: "normal",
  initialLoad: "normal",
  pageLoad: "normal",
  refresh: "success",
};
