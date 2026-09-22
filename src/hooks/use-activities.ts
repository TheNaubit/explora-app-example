import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useValue } from "@legendapp/state/react";

import {
  fetchActivitiesPage,
  getNextActivitiesPageParam,
  toActivityListFilters,
  type ActivitiesInfiniteData,
  type ActivitiesPageParam,
} from "@/query/activity-queries";
import type { ListActivitiesResponse } from "@/schemas/api";
import { activityKeys } from "@/query/keys";
import { discovery$ } from "@/state/discovery";

/**
 * Paginated discovery catalog (Suspense).
 * Search and category come from the discovery store so returning from detail keeps the same query.
 * Wrap callers in Suspense and QueryErrorBoundary.
 */
export function useActivities() {
  const searchQuery = useValue(discovery$.searchQuery);
  const category = useValue(discovery$.category);
  const filters = toActivityListFilters(searchQuery, category);

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
