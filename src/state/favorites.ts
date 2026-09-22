import { observable } from "@legendapp/state";
import { synced } from "@legendapp/state/sync";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";

import type { Activity } from "@/schemas/activity";
import { EXPLORA_MMKV_ID, FAVORITES_PERSIST_NAME } from "@/state/constants";

export type FavoritesState = {
  ids: string[];
  snapshots: Record<string, Activity>;
};

const initialFavoritesState: FavoritesState = {
  ids: [],
  snapshots: {},
};

/**
 * Persisted favorites ids and full Activity snapshots for offline detail.
 * Activate persistence by reading the store (get / React binders).
 */
export const favorites$ = observable(
  synced<FavoritesState>({
    initial: { ...initialFavoritesState },
    persist: {
      name: FAVORITES_PERSIST_NAME,
      plugin: ObservablePersistMMKV,
      mmkv: { id: EXPLORA_MMKV_ID },
    },
  }),
);

/** True when the activity id is in the favorites list. */
export function isFavorite(id: string): boolean {
  return favorites$.ids.get().includes(id);
}

/** Ordered list of favorite activity ids. */
export function listFavoriteIds(): string[] {
  return [...favorites$.ids.get()];
}

/** Offline snapshot for a saved activity, or undefined when missing. */
export function getOfflineSnapshot(id: string): Activity | undefined {
  return favorites$.snapshots[id].get();
}

/**
 * Save an activity as a favorite and store its full payload for offline detail.
 * Replacing an existing favorite refreshes the snapshot and keeps id order.
 */
export function addFavorite(activity: Activity): void {
  const ids = favorites$.ids.get();
  if (!ids.includes(activity.id)) {
    favorites$.ids.set([...ids, activity.id]);
  }
  favorites$.snapshots[activity.id].set(activity);
}

/** Remove a favorite id and its offline snapshot. */
export function removeFavorite(id: string): void {
  favorites$.ids.set(favorites$.ids.get().filter((favoriteId) => favoriteId !== id));
  const snapshots = { ...favorites$.snapshots.get() };
  delete snapshots[id];
  favorites$.snapshots.set(snapshots);
}

/** Clear all favorites and snapshots. Used by tests and local reset. */
export function clearFavorites(): void {
  favorites$.set({ ids: [], snapshots: {} });
}
