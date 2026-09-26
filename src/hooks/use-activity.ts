import { useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchActivityDetail } from "@/query/activity-queries";
import { isApiError } from "@/query/errors";
import { activityKeys } from "@/query/keys";
import { getOfflineSnapshot } from "@/state/favorites";
import { getReviewModeRevision, subscribeReviewMode } from "@/mocks/review-mode";

/**
 * Load one activity by id from the mock catalog.
 * Seed from the favorite snapshot so saved detail stays visible during a failed refetch.
 * Return null for not-found so the screen can show a designed recovery state.
 */
export function useActivity(id: string) {
  const snapshot = id.length > 0 ? getOfflineSnapshot(id) : undefined;
  const reviewRevision = useSyncExternalStore(
    subscribeReviewMode,
    getReviewModeRevision,
    getReviewModeRevision,
  );

  return useQuery({
    queryKey: activityKeys.detailForReview(id, reviewRevision),
    queryFn: async () => {
      if (id.length === 0) return null;

      try {
        return await fetchActivityDetail(id);
      } catch (error) {
        if (isApiError(error) && error.errorKey === "errors.notFound") {
          return null;
        }

        throw error;
      }
    },
    initialData: snapshot ? { activity: snapshot } : undefined,
    initialDataUpdatedAt: snapshot ? 0 : undefined,
  });
}
