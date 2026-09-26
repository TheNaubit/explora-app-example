import { createElement, Suspense, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react-native";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";

import { ApiError } from "@/query/errors";
import { showNativeToast } from "@/native-toast";
import { useExploreRefresh } from "@/screens/explore/use-explore-refresh";
import { createTestQueryClient as createQueryClient } from "@/test/create-test-query-client";

i18n.load("en", {});
i18n.activate("en");

const mockMutateAsync = jest.fn();
const mockShowNativeToast = showNativeToast as jest.MockedFunction<typeof showNativeToast>;

jest.mock("@/hooks/use-refresh-catalog", () => ({
  useRefreshCatalog: () => ({
    isPending: false,
    mutateAsync: mockMutateAsync,
  }),
}));

jest.mock("@/native-toast", () => ({
  showNativeToast: jest.fn(),
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

describe("useExploreRefresh", () => {
  beforeEach(() => {
    mockMutateAsync.mockReset();
    mockShowNativeToast.mockReset();
    mockMutateAsync.mockResolvedValue({ activity: { id: "new" } });
  });

  it("keeps refresh success silent", async () => {
    const { result } = await renderHook(() => useExploreRefresh(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleRefresh();
    });

    expect(result.current.banner).toBeNull();
    expect(mockShowNativeToast).not.toHaveBeenCalled();
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

  it("maps ApiError refresh failures to one transient toast", async () => {
    mockMutateAsync.mockRejectedValue(new ApiError("errors.refreshFailed"));

    const { result } = await renderHook(() => useExploreRefresh(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleRefresh();
    });

    expect(result.current.banner).toBeNull();
    expect(mockShowNativeToast).toHaveBeenCalledTimes(1);
    expect(mockShowNativeToast).toHaveBeenCalledWith(expect.objectContaining({ type: "error" }));
  });

  it("maps unknown refresh failures to errors.refreshFailed", async () => {
    mockMutateAsync.mockRejectedValue(new Error("boom"));

    const { result } = await renderHook(() => useExploreRefresh(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleRefresh();
    });

    expect(result.current.banner).toBeNull();
    expect(mockShowNativeToast).toHaveBeenCalledWith(expect.objectContaining({ type: "error" }));
  });
});
