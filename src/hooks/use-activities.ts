import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import {
  fetchActivitiesPage,
  getNextActivitiesPageParam,
  type ActivitiesInfiniteData,
  type ActivitiesPageParam,
} from "@/query/activity-queries";
import type { ListActivitiesResponse } from "@/schemas/api";
import { activityKeys } from "@/query/keys";
import type { ActivityListFilters } from "@/query/keys";

/**
 * Paginated discovery catalog (Suspense).
 * The caller supplies filters so Browse and Search keep independent query keys.
 * Wrap callers in Suspense and QueryErrorBoundary.
 */
export function useActivities(filters: ActivityListFilters) {
  return useSuspenseInfiniteQuery<
    ListActivitiesResponse,
    Error,
    ActivitiesInfiniteData,
    ReturnType<typeof activityKeys.list>,
    ActivitiesPageParam
  >({
    queryKey: activityKeys.list(filters),
    initialPageParam: null,
    queryFn: ({ pageParam }) => fetchActivitiesPage(filters, pageParam),
    getNextPageParam: getNextActivitiesPageParam,
  });
}
