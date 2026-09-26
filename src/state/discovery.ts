import { observable } from "@legendapp/state";

import type { ActivityCategory } from "@/schemas/activity";

export type DiscoveryState = {
  searchQuery: string;
  categories: ActivityCategory[];
};

type DiscoveryScrollFilters = {
  search: string;
  categories: readonly ActivityCategory[];
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

const discoveryScrollOffsets = new Map<string, number>();

function getDiscoveryScrollKey({ search, categories }: DiscoveryScrollFilters): string {
  return JSON.stringify([search, [...categories].sort()]);
}

/** Set the title search query used by the catalog list query key. */
export function setDiscoverySearch(searchQuery: string): void {
  discovery$.searchQuery.set(searchQuery);
}

/** Store the Explore position for one search and category state. */
export function setDiscoveryScrollOffset(
  filters: DiscoveryScrollFilters,
  scrollOffset: number,
): void {
  discoveryScrollOffsets.set(getDiscoveryScrollKey(filters), Math.max(0, scrollOffset));
}

/** Get the Explore position for one search and category state. */
export function getDiscoveryScrollOffset(filters: DiscoveryScrollFilters): number {
  return discoveryScrollOffsets.get(getDiscoveryScrollKey(filters)) ?? 0;
}

/** Remove all session scroll positions. */
export function resetDiscoveryScrollOffsets(): void {
  discoveryScrollOffsets.clear();
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
