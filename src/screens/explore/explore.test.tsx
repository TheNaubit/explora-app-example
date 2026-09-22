import { createElement } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { Explore } from "@/screens/explore";
import { ApiError } from "@/query/errors";
import { resetCatalog } from "@/mocks/catalog-store";
import { resetReviewModeState } from "@/mocks/review-mode";
import { clearFavorites } from "@/state/favorites";
import { getDiscoveryFilters, resetDiscoveryFilters, setDiscoverySearch } from "@/state/discovery";
import { createProviders, createQueryClient } from "@/test/ui-test-utils";

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

describe("Explore screen", () => {
  beforeEach(() => {
    resetCatalog();
    resetReviewModeState();
    resetDiscoveryFilters();
    clearFavorites();
    mockMutateAsync.mockReset();
    mockMutateAsync.mockResolvedValue({ activity: { id: "new" } });
  });

  it("renders the activity list after Suspense resolves", async () => {
    await render(createElement(Explore), {
      wrapper: createProviders(createQueryClient()),
    });

    await waitFor(() => expect(screen.getByTestId("explore-list")).toBeTruthy());
    expect(screen.getByTestId("explore-screen")).toBeTruthy();
  });

  it("shows empty state and clears filters", async () => {
    setDiscoverySearch("zzz-no-such-activity-title");

    await render(createElement(Explore), {
      wrapper: createProviders(createQueryClient()),
    });

    await waitFor(() => expect(screen.getByTestId("explore-empty")).toBeTruthy());
    fireEvent.press(screen.getByTestId("empty-state-action"));
    expect(getDiscoveryFilters().searchQuery).toBe("");
  });

  it("shows an inline banner when refresh fails", async () => {
    mockMutateAsync.mockRejectedValue(new ApiError("errors.refreshFailed"));

    await render(createElement(Explore), {
      wrapper: createProviders(createQueryClient()),
    });

    await waitFor(() => expect(screen.getByTestId("explore-list")).toBeTruthy());

    await act(async () => {
      fireEvent.press(screen.getByTestId("refresh-control"));
    });

    await waitFor(() => expect(screen.getByTestId("inline-status-banner")).toBeTruthy());

    mockMutateAsync.mockResolvedValue({ activity: { id: "new" } });
    await act(async () => {
      fireEvent.press(screen.getByTestId("inline-status-retry"));
    });

    await waitFor(() => expect(mockMutateAsync).toHaveBeenCalled());
  });
});
