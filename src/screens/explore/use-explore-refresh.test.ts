import { createElement, Suspense, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";

import { ApiError } from "@/query/errors";
import { createQueryClient } from "@/query/client";
import { activityKeys } from "@/query/keys";
import { useExploreRefresh } from "@/screens/explore/use-explore-refresh";

i18n.load("en", {});
i18n.activate("en");

const mockMutateAsync = jest.fn();
const mockResetQueries = jest.fn();

jest.mock("@/hooks/use-refresh-catalog", () => ({
  useRefreshCatalog: () => ({
    isPending: false,
    mutateAsync: mockMutateAsync,
  }),
}));

jest.mock("@/a11y", () => ({
  announceStatus: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: () => ({
      resetQueries: mockResetQueries,
    }),
  };
});

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

describe("useExploreRefresh", () => {
  beforeEach(() => {
    mockMutateAsync.mockReset();
    mockResetQueries.mockReset();
    mockMutateAsync.mockResolvedValue({ activity: { id: "new" } });
  });

  it("clears the banner and announces on refresh success", async () => {
    const { result } = await renderHook(() => useExploreRefresh(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleRefresh();
    });

    expect(result.current.banner).toBeNull();
  });

  it("ignores a second refresh request while the first request is pending", async () => {
    let resolveRefresh: (() => void) | undefined;
    mockMutateAsync.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveRefresh = resolve;
      }),
    );
    const { result } = await renderHook(() => useExploreRefresh(), {
      wrapper: createWrapper(),
    });

    let firstRefresh: Promise<void> | undefined;
    let secondRefresh: Promise<void> | undefined;
    await act(async () => {
      firstRefresh = result.current.handleRefresh();
      secondRefresh = result.current.handleRefresh();
      await Promise.resolve();
    });

    expect(mockMutateAsync).toHaveBeenCalledTimes(1);
    resolveRefresh?.();
    await act(async () => {
      await Promise.all([firstRefresh, secondRefresh]);
    });
  });

  it("maps ApiError refresh failures to a banner", async () => {
    mockMutateAsync.mockRejectedValue(new ApiError("errors.refreshFailed"));

    const { result } = await renderHook(() => useExploreRefresh(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleRefresh();
    });

    expect(result.current.banner).toEqual({
      kind: "refresh",
      errorKey: "errors.refreshFailed",
    });
  });

  it("maps unknown refresh failures to errors.refreshFailed", async () => {
    mockMutateAsync.mockRejectedValue(new Error("boom"));

    const { result } = await renderHook(() => useExploreRefresh(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleRefresh();
    });

    expect(result.current.banner).toEqual({
      kind: "refresh",
      errorKey: "errors.refreshFailed",
    });
  });

  it("resets list queries on first-load error recovery", async () => {
    const { result } = await renderHook(() => useExploreRefresh(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.handleQueryErrorReset();
    });

    await waitFor(() =>
      expect(mockResetQueries).toHaveBeenCalledWith({ queryKey: activityKeys.lists() }),
    );
  });
});
