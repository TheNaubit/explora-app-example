import { useValue } from "@legendapp/state/react";

import type { Activity } from "@/schemas/activity";
import {
  addFavorite,
  favorites$,
  getOfflineSnapshot,
  isFavorite,
  listFavoriteIds,
  removeFavorite,
} from "@/state/favorites";

/**
 * React bindings for the favorites store.
 * Prefer these helpers from screens so Legend imports stay in one place.
 */
export function useFavoriteIds(): string[] {
  return useValue(favorites$.ids);
}

/** True when the given activity id is favorited. */
export function useIsFavorite(id: string): boolean {
  return useValue(() => favorites$.ids.get().includes(id));
}

/** Offline snapshot for a saved activity, if present. */
export function useOfflineSnapshot(id: string): Activity | undefined {
  return useValue(() => favorites$.snapshots[id].get());
}

export { addFavorite, getOfflineSnapshot, isFavorite, listFavoriteIds, removeFavorite };
