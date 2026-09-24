import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import { getActivity, listActivities, refreshCatalog } from "@/mocks/api";
import type { GetActivityResponse, ListActivitiesResponse } from "@/schemas/api";
import type { ActivityCategory } from "@/schemas/activity";
import { unwrapMockResult } from "@/query/errors";
import { activityKeys, type ActivityListFilters } from "@/query/keys";

export type ActivitiesPageParam = string | null;

/** Fetch one catalog page for infinite query. */
export async function fetchActivitiesPage(
  filters: ActivityListFilters,
  pageParam: ActivitiesPageParam,
): Promise<ListActivitiesResponse> {
  const result = await listActivities({
    cursor: pageParam,
    search: filters.search.length > 0 ? filters.search : undefined,
    categories: [...filters.categories],
  });
  return unwrapMockResult(result);
}

/** Next page cursor for infinite query. */
export function getNextActivitiesPageParam(lastPage: ListActivitiesResponse): ActivitiesPageParam {
  return lastPage.nextCursor;
}

/** Fetch one activity by id for detail query. */
export async function fetchActivityDetail(id: string): Promise<GetActivityResponse> {
  const result = await getActivity(id);
  return unwrapMockResult(result);
}

/** Run refresh and update Query caches. Does not touch favorites. */
export async function runRefreshCatalog(queryClient: QueryClient): Promise<GetActivityResponse> {
  const result = await refreshCatalog();
  const data = unwrapMockResult(result);
  queryClient.setQueryData(activityKeys.detail(data.activity.id), data);
  await queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
  return data;
}

/** Build list filters from discovery values. */
export function toActivityListFilters(
  searchQuery: string,
  categories: readonly ActivityCategory[],
): ActivityListFilters {
  return { search: searchQuery, categories: [...categories].sort() as ActivityCategory[] };
}

export type ActivitiesInfiniteData = InfiniteData<ListActivitiesResponse, ActivitiesPageParam>;
