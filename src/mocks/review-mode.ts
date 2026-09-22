import {
  DEFAULT_REVIEW_MODE_STATE,
  reviewModeStateSchema,
  type InitialLoadMode,
  type RefreshMode,
  type ReviewModeState,
} from "@/schemas/review-mode";
import { parseWithSchema } from "@/utils/parse-with-schema";

let state: ReviewModeState = { ...DEFAULT_REVIEW_MODE_STATE };

/** Read the current review-mode state. */
export function getReviewModeState(): ReviewModeState {
  return { ...state };
}

/** Replace the full review-mode state. */
export function setReviewModeState(next: ReviewModeState): ReviewModeState {
  state = parseWithSchema(reviewModeStateSchema, next);
  return getReviewModeState();
}

/** Set only the initial-load mode. */
export function setInitialLoadMode(initialLoad: InitialLoadMode): ReviewModeState {
  return setReviewModeState({ ...state, initialLoad });
}

/** Set only the refresh mode. */
export function setRefreshMode(refresh: RefreshMode): ReviewModeState {
  return setReviewModeState({ ...state, refresh });
}

/** Reset review modes to defaults (normal initial load, successful refresh). */
export function resetReviewModeState(): ReviewModeState {
  state = { ...DEFAULT_REVIEW_MODE_STATE };
  return getReviewModeState();
}
