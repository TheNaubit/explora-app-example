import { QueryClient } from "@tanstack/react-query";

import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import { LIST_PAGE_SIZE } from "@/mocks/constants";
import { resetCatalog } from "@/mocks/catalog-store";
import { resetReviewModeState, setDetailLoadMode, setRefreshMode } from "@/mocks/review-mode";
import {
  fetchActivitiesPage,
  fetchActivityDetail,
  getNextActivitiesPageParam,
  runRefreshCatalog,
  toActivityListFilters,
} from "@/query/activity-queries";
import { activityKeys } from "@/query/keys";
import { ApiError } from "@/query/errors";
import { createQueryClient } from "@/query/client";
import {
  addFavorite,
  clearFavorites,
  getOfflineSnapshot,
  listFavoriteIds,
} from "@/state/favorites";

jest.mock("@/mocks/delay", () => ({
  MOCK_DELAY_MS: { normal: 1, slow: 2 },
  delay: jest.fn(() => Promise.resolve()),
}));

describe("activity query helpers", () => {
  beforeEach(() => {
    resetCatalog();
    resetReviewModeState();
    clearFavorites();
  });

  it("fetches the first catalog page", async () => {
    const page = await fetchActivitiesPage(toActivityListFilters("", []), null);
    expect(page.activities).toHaveLength(LIST_PAGE_SIZE);
    expect(page.nextCursor).toBe(String(LIST_PAGE_SIZE));
    expect(getNextActivitiesPageParam(page)).toBe(String(LIST_PAGE_SIZE));
  });

  it("passes search text into the list request", async () => {
    const page = await fetchActivitiesPage(toActivityListFilters("Walk", []), null);
    expect(page.total).toBeGreaterThan(0);
    for (const activity of page.activities) {
      expect(activity.title.toLowerCase()).toContain("walk");
    }
  });

  it("fetches a detail activity and throws ApiError on failure", async () => {
    const target = SUPPLIED_ACTIVITIES[0];
    const detail = await fetchActivityDetail(target.id);
    expect(detail.activity).toEqual(target);

    setDetailLoadMode("fail");
    await expect(fetchActivityDetail(target.id)).rejects.toBeInstanceOf(ApiError);
  });

  it("refreshes without clearing favorites and updates detail cache", async () => {
    const favorite = SUPPLIED_ACTIVITIES[0];
    addFavorite(favorite);

    const queryClient = createQueryClient();
    const data = await runRefreshCatalog(queryClient);

    expect(listFavoriteIds()).toEqual([favorite.id]);
    expect(getOfflineSnapshot(favorite.id)).toEqual(favorite);
    expect(queryClient.getQueryData(activityKeys.detail(data.activity.id))).toEqual(data);
  });

  it("does not add a favorite-clearing side effect when refresh fails", async () => {
    const favorite = SUPPLIED_ACTIVITIES[0];
    addFavorite(favorite);
    setRefreshMode("fail");

    const queryClient = new QueryClient();
    await expect(runRefreshCatalog(queryClient)).rejects.toBeInstanceOf(ApiError);
    expect(listFavoriteIds()).toEqual([favorite.id]);
  });

  it("keeps refresh pending until the visible list cache finishes updating", async () => {
    let resolveInvalidation: (() => void) | undefined;
    const invalidation = new Promise<void>((resolve) => {
      resolveInvalidation = resolve;
    });
    const queryClient = createQueryClient();
    const invalidateQueries = jest
      .spyOn(queryClient, "invalidateQueries")
      .mockReturnValue(invalidation);
    let settled = false;

    const refresh = runRefreshCatalog(queryClient).then(() => {
      settled = true;
    });

    while (invalidateQueries.mock.calls.length === 0) {
      await Promise.resolve();
    }
    await Promise.resolve();
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: activityKeys.lists() });
    expect(settled).toBe(false);

    resolveInvalidation?.();
    await refresh;
    expect(settled).toBe(true);
  });
});
