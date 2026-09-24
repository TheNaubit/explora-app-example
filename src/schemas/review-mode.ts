import { z } from "zod";

/** Initial catalog load behavior for review scenarios (first list page and get-by-id). */
export const initialLoadModeSchema = z.enum(["normal", "slow", "fail"]);

/**
 * Behavior for list pages after the first (`cursor !== null`).
 * Use this to simulate slow or failed loads while scrolling.
 */
export const pageLoadModeSchema = z.enum(["normal", "slow", "fail"]);

/** Refresh behavior for review scenarios. */
export const refreshModeSchema = z.enum(["success", "slow", "fail"]);

/**
 * Review-control state for the Dev Tools screen.
 */
export const reviewModeStateSchema = z.object({
  initialLoad: initialLoadModeSchema,
  pageLoad: pageLoadModeSchema,
  refresh: refreshModeSchema,
});

export type InitialLoadMode = z.infer<typeof initialLoadModeSchema>;
export type PageLoadMode = z.infer<typeof pageLoadModeSchema>;
export type RefreshMode = z.infer<typeof refreshModeSchema>;
export type ReviewModeState = z.infer<typeof reviewModeStateSchema>;

export const DEFAULT_REVIEW_MODE_STATE: ReviewModeState = {
  initialLoad: "normal",
  pageLoad: "normal",
  refresh: "success",
};
