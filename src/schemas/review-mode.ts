import { z } from "zod";

/** Initial catalog load behavior for review scenarios. */
export const initialLoadModeSchema = z.enum(["normal", "slow", "fail"]);

/** Refresh behavior for review scenarios. */
export const refreshModeSchema = z.enum(["success", "slow", "fail"]);

/**
 * Persistable review-control state.
 * The ReviewControlsSheet UI will read and write this shape later.
 */
export const reviewModeStateSchema = z.object({
  initialLoad: initialLoadModeSchema,
  refresh: refreshModeSchema,
});

export type InitialLoadMode = z.infer<typeof initialLoadModeSchema>;
export type RefreshMode = z.infer<typeof refreshModeSchema>;
export type ReviewModeState = z.infer<typeof reviewModeStateSchema>;

export const DEFAULT_REVIEW_MODE_STATE: ReviewModeState = {
  initialLoad: "normal",
  refresh: "success",
};
