import { useSyncExternalStore } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import {
  fetchActivitiesPage,
  getNextActivitiesPageParam,
  type ActivitiesInfiniteData,
  type ActivitiesPageParam,
} from "@/query/activity-queries";
import type { ListActivitiesResponse } from "@/schemas/api";
import { activityKeys } from "@/query/keys";
import type { ActivityListFilters } from "@/query/keys";
import { getReviewModeRevision, subscribeReviewMode } from "@/mocks/review-mode";

/**
 * Paginated discovery catalog with explicit loading and error states.
 * The caller supplies filters so Browse and Search keep independent query keys.
 */
export function useActivities(filters: ActivityListFilters) {
  const reviewRevision = useSyncExternalStore(
    subscribeReviewMode,
    getReviewModeRevision,
    getReviewModeRevision,
  );

  return useInfiniteQuery<
    ListActivitiesResponse,
    Error,
    ActivitiesInfiniteData,
    ReturnType<typeof activityKeys.listForReview>,
    ActivitiesPageParam
  >({
    queryKey: activityKeys.listForReview(filters, reviewRevision),
    initialPageParam: null,
    queryFn: ({ pageParam }) => fetchActivitiesPage(filters, pageParam),
    getNextPageParam: getNextActivitiesPageParam,
  });
}
