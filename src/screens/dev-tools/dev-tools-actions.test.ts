import { QueryClient } from "@tanstack/react-query";

import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import {
  clearRequestCache,
  resetLocalData,
  updateReviewMode,
} from "@/screens/dev-tools/dev-tools-actions";
import { getCatalogSize, prependRefreshActivity } from "@/mocks/catalog-store";
import { getReviewModeState, resetReviewModeState } from "@/mocks/review-mode";
import { addFavorite, listFavoriteIds } from "@/state/favorites";
import { getDiscoveryFilters, setDiscoverySearch } from "@/state/discovery";

describe("Dev Tools actions", () => {
  beforeEach(() => {
    resetLocalData(new QueryClient());
    resetReviewModeState();
  });

  it("updates one review mode without changing the other modes", () => {
    updateReviewMode("initialLoad", "slow");
    updateReviewMode("pageLoad", "fail");

    expect(getReviewModeState()).toEqual({
      detailLoad: "normal",
      initialLoad: "slow",
      pageLoad: "fail",
      refresh: "success",
    });
  });

  it("clears request data without changing local user data", () => {
    const queryClient = new QueryClient();
    const resetQueries = jest.spyOn(queryClient, "resetQueries");
    queryClient.setQueryData(["activities", "detail", "sample"], {
      activity: SUPPLIED_ACTIVITIES[0],
    });
    addFavorite(SUPPLIED_ACTIVITIES[0]);
    prependRefreshActivity();

    clearRequestCache(queryClient);

    expect(resetQueries).toHaveBeenCalledTimes(1);
    expect(queryClient.getQueryData(["activities", "detail", "sample"])).toBeUndefined();
    expect(listFavoriteIds()).toEqual([SUPPLIED_ACTIVITIES[0].id]);
    expect(getCatalogSize()).toBeGreaterThan(1_012);
  });

  it("resets the catalog, favorites, filters, and query cache", () => {
    const queryClient = new QueryClient();
    const clear = jest.spyOn(queryClient, "clear");
    addFavorite(SUPPLIED_ACTIVITIES[0]);
    prependRefreshActivity();
    setDiscoverySearch("museum");

    const result = resetLocalData(queryClient);

    expect(clear).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ catalogCount: 1_012, favoriteCount: 0 });
    expect(listFavoriteIds()).toEqual([]);
    expect(getDiscoveryFilters()).toEqual({ categories: [], searchQuery: "" });
  });
});
