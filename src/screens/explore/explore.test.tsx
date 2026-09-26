import { createElement } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { Explore } from "@/screens/explore";
import { ApiError } from "@/query/errors";
import { resetCatalog } from "@/mocks/catalog-store";
import { resetReviewModeState, setInitialLoadMode } from "@/mocks/review-mode";
import { clearFavorites } from "@/state/favorites";
import {
  getDiscoveryFilters,
  getDiscoveryScrollOffset,
  resetDiscoveryFilters,
  resetDiscoveryScrollOffsets,
  setDiscoverySearch,
} from "@/state/discovery";
import { createProviders, createQueryClient } from "@/test/ui-test-utils";
import { showNativeToast } from "@/native-toast";

jest.mock("@/mocks/delay", () => ({
  MOCK_DELAY_MS: { normal: 1, slow: 2 },
  delay: jest.fn(() => Promise.resolve()),
}));

const mockMutateAsync = jest.fn();

jest.mock("@/hooks/use-refresh-catalog", () => ({
  useRefreshCatalog: () => ({
    isPending: false,
    mutateAsync: mockMutateAsync,
  }),
}));

jest.mock("@/native-toast", () => ({
  showNativeToast: jest.fn(),
}));

jest.mock("expo-router", () => {
  const React = require("react");
  const actual = jest.requireActual("expo-router");

  return {
    ...actual,
    useFocusEffect(callback: () => void | (() => void)) {
      React.useEffect(callback, [callback]);
    },
  };
});

describe("Explore screen", () => {
  beforeEach(() => {
    resetCatalog();
    resetReviewModeState();
    resetDiscoveryFilters();
    resetDiscoveryScrollOffsets();
    clearFavorites();
    mockMutateAsync.mockReset();
    mockMutateAsync.mockResolvedValue({ activity: { id: "new" } });
  });

  it("renders the activity list after the first request resolves", async () => {
    await render(createElement(Explore), {
      wrapper: createProviders(createQueryClient()),
    });

    await waitFor(() => expect(screen.getByTestId("explore-list")).toBeTruthy());
    expect(screen.getByTestId("explore-list")).toBeTruthy();
  });

  it("saves the live Explore position when its tab loses focus", async () => {
    const view = await render(createElement(Explore), {
      wrapper: createProviders(createQueryClient()),
    });

    await waitFor(() => expect(screen.getByTestId("explore-list")).toBeTruthy());
    await fireEvent(screen.getByTestId("explore-list"), "scroll", {
      nativeEvent: { contentInset: { top: 0 }, contentOffset: { y: 412 } },
    });
    await view.unmount();

    expect(getDiscoveryScrollOffset({ search: "", categories: [] })).toBe(412);
  });

  it("shows empty state and clears filters", async () => {
    setDiscoverySearch("zzz-no-such-activity-title");

    await render(createElement(Explore), {
      wrapper: createProviders(createQueryClient()),
    });

    await waitFor(() => expect(screen.getByTestId("explore-empty")).toBeTruthy());
    await fireEvent.press(screen.getByTestId("empty-state-action"));
    expect(getDiscoveryFilters().searchQuery).toBe("");
  });

  it("handles invalid first-load data without a render error", async () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
    setInitialLoadMode("invalid-data");

    await render(createElement(Explore), {
      wrapper: createProviders(createQueryClient()),
    });

    await waitFor(() => expect(screen.getByTestId("explore-load-error")).toBeTruthy());
    expect(screen.getByText("Could not load activities")).toBeTruthy();
    expect(screen.getByText("The data from the server was invalid.")).toBeTruthy();
    expect(screen.queryByTestId("query-error-boundary")).toBeNull();
    expect(consoleError).not.toHaveBeenCalled();

    setInitialLoadMode("normal");
    await fireEvent.press(screen.getByTestId("explore-load-error-retry"));
    await waitFor(() => expect(screen.getByTestId("explore-list")).toBeTruthy());

    consoleError.mockRestore();
  });

  it("shows one transient toast when refresh fails", async () => {
    mockMutateAsync.mockRejectedValue(new ApiError("errors.refreshFailed"));

    await render(createElement(Explore), {
      wrapper: createProviders(createQueryClient()),
    });

    await waitFor(() => expect(screen.getByTestId("explore-list")).toBeTruthy());

    await fireEvent.press(screen.getByTestId("refresh-control"));

    await waitFor(() =>
      expect(showNativeToast).toHaveBeenCalledWith({
        message: "Refresh failed. No new activity was added.",
        title: "Refresh failed",
        type: "error",
      }),
    );
    expect(screen.queryByTestId("inline-status-banner")).toBeNull();
  });
});
