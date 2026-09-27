import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import {
  clearRequestCache,
  resetLocalData,
  updateCatalogMode,
  updateReviewMode,
} from "@/screens/dev-tools/dev-tools-actions";
import {
  getCatalogMode,
  getCatalogSize,
  prependRefreshActivity,
} from "@/mocks/catalog-store";
import { PERFORMANCE_CATALOG_SIZE, SUPPLIED_CATALOG_SIZE } from "@/mocks/constants";
import { getReviewModeState, resetReviewModeState } from "@/mocks/review-mode";
import { addFavorite, listFavoriteIds } from "@/state/favorites";
import { getDiscoveryFilters, setDiscoverySearch } from "@/state/discovery";
import { createTestQueryClient } from "@/test/create-test-query-client";

describe("Dev Tools actions", () => {
  beforeEach(() => {
    resetLocalData(createTestQueryClient());
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
    const queryClient = createTestQueryClient();
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
    expect(getCatalogSize()).toBe(SUPPLIED_CATALOG_SIZE + 1);
  });

  it("switches catalog modes without clearing favorites or filters", () => {
    const queryClient = createTestQueryClient();
    const resetQueries = jest.spyOn(queryClient, "resetQueries");
    addFavorite(SUPPLIED_ACTIVITIES[0]);
    prependRefreshActivity();
    setDiscoverySearch("garden");

    const performanceResult = updateCatalogMode(queryClient, "performance");

    expect(performanceResult).toEqual({
      catalogCount: PERFORMANCE_CATALOG_SIZE + 1,
      catalogMode: "performance",
    });
    expect(getCatalogMode()).toBe("performance");
    expect(listFavoriteIds()).toEqual([SUPPLIED_ACTIVITIES[0].id]);
    expect(getDiscoveryFilters().searchQuery).toBe("garden");
    expect(resetQueries).toHaveBeenCalledTimes(1);

    const suppliedResult = updateCatalogMode(queryClient, "supplied");

    expect(suppliedResult).toEqual({
      catalogCount: SUPPLIED_CATALOG_SIZE + 1,
      catalogMode: "supplied",
    });
  });

  it("resets the catalog, favorites, filters, and query cache", () => {
    const queryClient = createTestQueryClient();
    const clear = jest.spyOn(queryClient, "clear");
    addFavorite(SUPPLIED_ACTIVITIES[0]);
    prependRefreshActivity();
    setDiscoverySearch("museum");

    const result = resetLocalData(queryClient);

    expect(clear).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ catalogCount: SUPPLIED_CATALOG_SIZE, favoriteCount: 0 });
    expect(getCatalogMode()).toBe("supplied");
    expect(listFavoriteIds()).toEqual([]);
    expect(getDiscoveryFilters()).toEqual({ categories: [], searchQuery: "" });
  });
});
