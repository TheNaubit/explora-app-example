import { createElement, Suspense, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";

import { ApiError } from "@/query/errors";
import { useExploreList } from "@/screens/explore/use-explore-list";
import { createTestQueryClient as createQueryClient } from "@/test/create-test-query-client";

i18n.load("en", {});
i18n.activate("en");

const mockFetchNextPage = jest.fn();
const mockUseActivities = jest.fn();
const defaultArgs = {
  filters: { search: "", categories: [] },
};

jest.mock("@/hooks/use-activities", () => ({
  useActivities: () => mockUseActivities(),
}));

jest.mock("@/a11y", () => ({
  announceStatus: jest.fn(),
}));

function createWrapper() {
  const queryClient = createQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(I18nProvider, { i18n }, createElement(Suspense, { fallback: null }, children)),
    );
  };
}

describe("useExploreList", () => {
  beforeEach(() => {
    mockFetchNextPage.mockReset();
    mockUseActivities.mockReset();
    mockUseActivities.mockReturnValue({
      data: {
        pages: [
          {
            activities: [
              {
                id: "1",
                title: "A",
                category: "Outdoors",
                location: "X",
                description: "d",
                durationMinutes: 30,
              },
            ],
            nextCursor: "1",
            total: 2,
          },
        ],
        pageParams: [null],
      },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
      isFetchNextPageError: false,
      failureReason: null,
      fetchStatus: "idle",
    });
  });

  it("maps fetchNextPage ApiError to a nextPage banner", async () => {
    mockFetchNextPage.mockRejectedValue(new ApiError("errors.networkTimeout"));
    const onBannerChange = jest.fn();

    const { result } = await renderHook(() => useExploreList({ ...defaultArgs, onBannerChange }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleEndReached();
    });

    expect(onBannerChange).toHaveBeenCalledWith({
      kind: "nextPage",
      errorKey: "errors.networkTimeout",
    });
  });

  it("maps isFetchNextPageError to a banner", async () => {
    mockUseActivities.mockReturnValue({
      data: {
        pages: [{ activities: [], nextCursor: null, total: 0 }],
        pageParams: [null],
      },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
      isFetchingNextPage: false,
      isFetchNextPageError: true,
      failureReason: new ApiError("errors.unknown"),
      fetchStatus: "idle",
    });

    const onBannerChange = jest.fn();
    await renderHook(() => useExploreList({ ...defaultArgs, onBannerChange }), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(onBannerChange).toHaveBeenCalledWith({
        kind: "nextPage",
        errorKey: "errors.unknown",
      }),
    );
  });

  it("skips end reached while fetching", async () => {
    mockUseActivities.mockReturnValue({
      data: {
        pages: [
          {
            activities: [
              {
                id: "1",
                title: "A",
                category: "Outdoors",
                location: "X",
                description: "d",
                durationMinutes: 30,
              },
            ],
            nextCursor: "1",
            total: 2,
          },
        ],
        pageParams: [null],
      },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: true,
      isFetchNextPageError: false,
      failureReason: null,
      fetchStatus: "fetching",
    });

    const onBannerChange = jest.fn();
    const { result } = await renderHook(() => useExploreList({ ...defaultArgs, onBannerChange }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleEndReached();
    });

    expect(mockFetchNextPage).not.toHaveBeenCalled();
  });

  it("maps unknown fetchNextPage errors to errors.unknown", async () => {
    mockFetchNextPage.mockRejectedValue(new Error("boom"));
    const onBannerChange = jest.fn();

    const { result } = await renderHook(() => useExploreList({ ...defaultArgs, onBannerChange }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleEndReached();
    });

    expect(onBannerChange).toHaveBeenCalledWith({
      kind: "nextPage",
      errorKey: "errors.unknown",
    });
  });

  it("maps non-ApiError fetch next page failures from query state", async () => {
    mockUseActivities.mockReturnValue({
      data: {
        pages: [{ activities: [], nextCursor: null, total: 0 }],
        pageParams: [null],
      },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
      isFetchingNextPage: false,
      isFetchNextPageError: true,
      failureReason: new Error("nope"),
      fetchStatus: "idle",
    });

    const onBannerChange = jest.fn();
    await renderHook(() => useExploreList({ ...defaultArgs, onBannerChange }), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(onBannerChange).toHaveBeenCalledWith({
        kind: "nextPage",
        errorKey: "errors.unknown",
      }),
    );
  });
});
