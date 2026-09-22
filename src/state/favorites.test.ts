import { createMMKV } from "react-native-mmkv";

import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import { refreshCatalog } from "@/mocks/api";
import { resetCatalog } from "@/mocks/catalog-store";
import { resetReviewModeState, setRefreshMode } from "@/mocks/review-mode";
import type { Activity } from "@/schemas/activity";
import { EXPLORA_MMKV_ID, FAVORITES_PERSIST_NAME } from "@/state/constants";
import {
  addFavorite,
  clearFavorites,
  favorites$,
  getOfflineSnapshot,
  isFavorite,
  listFavoriteIds,
  removeFavorite,
} from "@/state/favorites";

jest.mock("@/mocks/delay", () => ({
  MOCK_DELAY_MS: { normal: 1, slow: 2 },
  delay: jest.fn(() => Promise.resolve()),
}));

/** Flush Legend persist microtasks before reading MMKV. */
async function flushPersist(): Promise<void> {
  await Promise.resolve();
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });
}

describe("favorites store", () => {
  beforeEach(async () => {
    clearFavorites();
    await flushPersist();
    resetCatalog();
    resetReviewModeState();
  });

  it("saves ids and full activity snapshots", () => {
    const activity = SUPPLIED_ACTIVITIES[0];

    addFavorite(activity);

    expect(listFavoriteIds()).toEqual([activity.id]);
    expect(isFavorite(activity.id)).toBe(true);
    expect(getOfflineSnapshot(activity.id)).toEqual(activity);
    expect(favorites$.get()).toEqual({
      ids: [activity.id],
      snapshots: { [activity.id]: activity },
    });
  });

  it("refreshes the snapshot when saving an existing favorite again", () => {
    const original = SUPPLIED_ACTIVITIES[0];
    const updated = { ...original, title: "Updated title" };
    addFavorite(original);
    addFavorite(updated);

    expect(listFavoriteIds()).toEqual([original.id]);
    expect(getOfflineSnapshot(original.id)).toEqual(updated);
  });

  it("removes id and snapshot together", () => {
    const activity = SUPPLIED_ACTIVITIES[0];
    addFavorite(activity);
    removeFavorite(activity.id);

    expect(listFavoriteIds()).toEqual([]);
    expect(isFavorite(activity.id)).toBe(false);
    expect(getOfflineSnapshot(activity.id)).toBeUndefined();
  });

  it("round-trips snapshots through MMKV persist storage", async () => {
    const activity = SUPPLIED_ACTIVITIES[1];
    addFavorite(activity);
    await flushPersist();

    const storage = createMMKV({ id: EXPLORA_MMKV_ID });
    const raw = storage.getString(FAVORITES_PERSIST_NAME);
    expect(raw).toBeDefined();

    const parsed = JSON.parse(raw as string) as {
      ids: string[];
      snapshots: Record<string, Activity>;
    };
    expect(parsed.ids).toEqual([activity.id]);
    expect(parsed.snapshots[activity.id]).toEqual(activity);

    clearFavorites();
    await flushPersist();
    expect(listFavoriteIds()).toEqual([]);

    favorites$.set({
      ids: parsed.ids,
      snapshots: parsed.snapshots,
    });

    expect(getOfflineSnapshot(activity.id)).toEqual(activity);
    expect(isFavorite(activity.id)).toBe(true);
  });

  it("keeps favorites when refresh succeeds or fails", async () => {
    const activity = SUPPLIED_ACTIVITIES[0];
    addFavorite(activity);

    setRefreshMode("fail");
    const failed = await refreshCatalog();
    expect(failed.ok).toBe(false);
    expect(listFavoriteIds()).toEqual([activity.id]);
    expect(getOfflineSnapshot(activity.id)).toEqual(activity);

    setRefreshMode("success");
    const succeeded = await refreshCatalog();
    expect(succeeded.ok).toBe(true);
    expect(listFavoriteIds()).toEqual([activity.id]);
    expect(getOfflineSnapshot(activity.id)).toEqual(activity);
  });
});
