import { createElement, Suspense, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react-native";

import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import { useActivities } from "@/hooks/use-activities";
import { useActivity } from "@/hooks/use-activity";
import {
  addFavorite,
  useFavoriteIds,
  useIsFavorite,
  useOfflineSnapshot,
} from "@/hooks/use-favorites";
import { useRefreshCatalog } from "@/hooks/use-refresh-catalog";
import { resetCatalog, setCatalogMode } from "@/mocks/catalog-store";
import { LIST_PAGE_SIZE, SUPPLIED_CATALOG_SIZE } from "@/mocks/constants";
import { resetReviewModeState, setInitialLoadMode, setRefreshMode } from "@/mocks/review-mode";
import { clearFavorites } from "@/state/favorites";
import { resetDiscoveryFilters } from "@/state/discovery";
import { createTestQueryClient as createQueryClient } from "@/test/create-test-query-client";

jest.mock("@/mocks/delay", () => ({
  MOCK_DELAY_MS: { normal: 1, slow: 2 },
  delay: jest.fn(() => Promise.resolve()),
}));

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(Suspense, { fallback: null }, children),
    );
  };
}

describe("catalog and favorites hooks", () => {
  afterEach(async () => {
    await cleanup();
  });

  beforeEach(() => {
    resetCatalog();
    resetReviewModeState();
    resetDiscoveryFilters();
    clearFavorites();
  });

  it("loads the supplied activities by default", async () => {
    const queryClient = createQueryClient();
    const { result } = await renderHook(() => useActivities({ search: "", categories: [] }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() =>
      expect(result.current.data?.pages[0]?.activities).toHaveLength(SUPPLIED_CATALOG_SIZE),
    );
    expect(result.current.hasNextPage).toBe(false);
  });

  it("loads paginated activities in performance mode", async () => {
    setCatalogMode("performance");
    const queryClient = createQueryClient();
    const { result } = await renderHook(() => useActivities({ search: "", categories: [] }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() =>
      expect(result.current.data?.pages[0]?.activities).toHaveLength(LIST_PAGE_SIZE),
    );
    expect(result.current.hasNextPage).toBe(true);
  });

  it("reloads a kept-alive catalog after a review mode changes", async () => {
    const queryClient = createQueryClient();
    const { result } = await renderHook(() => useActivities({ search: "", categories: [] }), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() =>
      expect(result.current.data?.pages[0]?.activities).toHaveLength(SUPPLIED_CATALOG_SIZE),
    );

    await act(async () => {
      setInitialLoadMode("empty");
    });

    await waitFor(() => expect(result.current.data?.pages[0]?.activities).toHaveLength(0));
  });

  it("applies discovery search and categories to the list query", async () => {
    const queryClient = createQueryClient();
    const { result } = await renderHook(
      () =>
        useActivities({
          search: SUPPLIED_ACTIVITIES[0].title,
          categories: ["Outdoors", "Culture"],
        }),
      {
        wrapper: createWrapper(queryClient),
      },
    );

    await waitFor(() => expect(result.current.data?.pages.length).toBeGreaterThan(0));
    expect(
      result.current.data?.pages[0]?.activities.every(
        (activity) =>
          ["Outdoors", "Culture"].includes(activity.category) &&
          activity.title.toLowerCase().includes(SUPPLIED_ACTIVITIES[0].title.toLowerCase()),
      ),
    ).toBe(true);
  });

  it("loads activity detail with an offline snapshot placeholder", async () => {
    const activity = SUPPLIED_ACTIVITIES[0];
    addFavorite(activity);

    const queryClient = createQueryClient();
    const { result } = await renderHook(() => useActivity(activity.id), {
      wrapper: createWrapper(queryClient),
    });

    expect(result.current.data?.activity).toEqual(activity);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.activity).toEqual(activity);
  });

  it("returns not-found when the detail id is empty", async () => {
    const queryClient = createQueryClient();
    const { result } = await renderHook(() => useActivity(""), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.data).toBeNull());
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("refreshes without clearing favorite hook state", async () => {
    const activity = SUPPLIED_ACTIVITIES[0];
    addFavorite(activity);

    const queryClient = createQueryClient();
    const { result: refresh } = await renderHook(() => useRefreshCatalog(), {
      wrapper: createWrapper(queryClient),
    });
    const { result: favorites } = await renderHook(() => ({
      ids: useFavoriteIds(),
      isFavorite: useIsFavorite(activity.id),
      snapshot: useOfflineSnapshot(activity.id),
    }));

    expect(favorites.current.isFavorite).toBe(true);
    expect(favorites.current.snapshot).toEqual(activity);

    setRefreshMode("success");
    await act(async () => {
      refresh.current.mutate();
    });
    await waitFor(() => expect(refresh.current.isSuccess).toBe(true));

    expect(favorites.current.ids).toEqual([activity.id]);
    expect(favorites.current.snapshot).toEqual(activity);
  });
});
