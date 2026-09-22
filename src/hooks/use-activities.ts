import { useInfiniteQuery } from "@tanstack/react-query";
import { useValue } from "@legendapp/state/react";

import {
  fetchActivitiesPage,
  getNextActivitiesPageParam,
  toActivityListFilters,
} from "@/query/activity-queries";
import { activityKeys } from "@/query/keys";
import { discovery$ } from "@/state/discovery";

/**
 * Paginated discovery catalog.
 * Search and category come from the discovery store so returning from detail keeps the same query.
 */
export function useActivities() {
  const searchQuery = useValue(discovery$.searchQuery);
  const category = useValue(discovery$.category);
  const filters = toActivityListFilters(searchQuery, category);

  return useInfiniteQuery({
    queryKey: activityKeys.list(filters),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) => fetchActivitiesPage(filters, pageParam),
    getNextPageParam: getNextActivitiesPageParam,
  });
}
