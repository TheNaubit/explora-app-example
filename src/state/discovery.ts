import { observable } from "@legendapp/state";

import type { ActivityCategory } from "@/schemas/activity";

export type DiscoveryState = {
  searchQuery: string;
  categories: ActivityCategory[];
};

const initialDiscoveryState: DiscoveryState = {
  searchQuery: "",
  categories: [],
};

/**
 * In-memory discovery search and filter.
 * Survives detail navigation within a session. Not persisted across relaunch.
 */
export const discovery$ = observable<DiscoveryState>({ ...initialDiscoveryState });

const discoveryScrollOffset$ = observable(0);

/** Set the title search query used by the catalog list query key. */
export function setDiscoverySearch(searchQuery: string): void {
  discovery$.searchQuery.set(searchQuery);
}

/** Store the shared catalog position used before a search query starts. */
export function setDiscoveryScrollOffset(scrollOffset: number): void {
  discoveryScrollOffset$.set(Math.max(0, scrollOffset));
}

/** Get the shared catalog position without subscribing a route to scroll changes. */
export function getDiscoveryScrollOffset(): number {
  return discoveryScrollOffset$.peek();
}

/** Toggle one category. An empty array represents the exclusive All selection. */
export function toggleDiscoveryCategory(category: ActivityCategory | null): void {
  if (category === null) {
    discovery$.categories.set([]);
    return;
  }

  const selected = discovery$.categories.peek();
  discovery$.categories.set(
    selected.includes(category)
      ? selected.filter((selectedCategory) => selectedCategory !== category)
      : [...selected, category],
  );
}

/** Reset search and filter to empty defaults. */
export function resetDiscoveryFilters(): void {
  discovery$.set({ ...initialDiscoveryState });
}

/** Current discovery filters as plain values (for Query keys). */
export function getDiscoveryFilters(): DiscoveryState {
  return {
    searchQuery: discovery$.searchQuery.get(),
    categories: discovery$.categories.get(),
  };
}
