import {
  DEFAULT_REVIEW_MODE_STATE,
  reviewModeStateSchema,
  type DetailLoadMode,
  type InitialLoadMode,
  type PageLoadMode,
  type RefreshMode,
  type ReviewModeState,
} from "@/schemas/review-mode";
import { parseWithSchema } from "@/utils/parse-with-schema";

let state: ReviewModeState = { ...DEFAULT_REVIEW_MODE_STATE };
let revision = 0;
const listeners = new Set<() => void>();

/** Read the revision that changes after each review-mode update. */
export function getReviewModeRevision(): number {
  return revision;
}

/** Subscribe to review-mode updates from kept-alive data screens. */
export function subscribeReviewMode(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Read the current review-mode state. */
export function getReviewModeState(): ReviewModeState {
  return { ...state };
}

/** Replace the full review-mode state. */
export function setReviewModeState(next: ReviewModeState): ReviewModeState {
  state = parseWithSchema(reviewModeStateSchema, next);
  revision += 1;
  listeners.forEach((listener) => listener());
  return getReviewModeState();
}

/** Set only the initial-load mode. */
export function setInitialLoadMode(initialLoad: InitialLoadMode): ReviewModeState {
  return setReviewModeState({ ...state, initialLoad });
}

/** Set only the activity-detail load mode. */
export function setDetailLoadMode(detailLoad: DetailLoadMode): ReviewModeState {
  return setReviewModeState({ ...state, detailLoad });
}

/** Set only the next-page load mode. */
export function setPageLoadMode(pageLoad: PageLoadMode): ReviewModeState {
  return setReviewModeState({ ...state, pageLoad });
}

/** Set only the refresh mode. */
export function setRefreshMode(refresh: RefreshMode): ReviewModeState {
  return setReviewModeState({ ...state, refresh });
}

/** Reset review modes to defaults (normal loads, successful refresh). */
export function resetReviewModeState(): ReviewModeState {
  return setReviewModeState({ ...DEFAULT_REVIEW_MODE_STATE });
}
