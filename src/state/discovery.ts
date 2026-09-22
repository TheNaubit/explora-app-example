import { observable } from "@legendapp/state";

import type { ActivityCategory } from "@/schemas/activity";

export type DiscoveryState = {
  searchQuery: string;
  category: ActivityCategory | null;
};

const initialDiscoveryState: DiscoveryState = {
  searchQuery: "",
  category: null,
};

/**
 * In-memory discovery search and filter.
 * Survives detail navigation within a session. Not persisted across relaunch.
 */
export const discovery$ = observable<DiscoveryState>({ ...initialDiscoveryState });

/** Set the title search query used by the catalog list query key. */
export function setDiscoverySearch(searchQuery: string): void {
  discovery$.searchQuery.set(searchQuery);
}

/** Set the category filter, or null for all categories. */
export function setDiscoveryCategory(category: ActivityCategory | null): void {
  discovery$.category.set(category);
}

/** Reset search and filter to empty defaults. */
export function resetDiscoveryFilters(): void {
  discovery$.set({ ...initialDiscoveryState });
}

/** Current discovery filters as plain values (for Query keys). */
export function getDiscoveryFilters(): DiscoveryState {
  return {
    searchQuery: discovery$.searchQuery.get(),
    category: discovery$.category.get(),
  };
}
