import type { ActivityCategory } from "@/schemas/activity";

export type ActivityListFilters = {
  search: string;
  category: ActivityCategory | null;
};

/**
 * TanStack Query key factory for catalog data.
 * List keys include search and category so filter changes reset infinite pages.
 */
export const activityKeys = {
  all: ["activities"] as const,
  lists: () => [...activityKeys.all, "list"] as const,
  list: (filters: ActivityListFilters) =>
    [...activityKeys.lists(), filters.search, filters.category] as const,
  details: () => [...activityKeys.all, "detail"] as const,
  detail: (id: string) => [...activityKeys.details(), id] as const,
};
