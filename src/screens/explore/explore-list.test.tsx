import { createElement, Suspense, type ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";

import { ExploreList } from "@/screens/explore/explore-list";
import { createQueryClient } from "@/query/client";
import { SUPPLIED_ACTIVITIES } from "@/data/activities";

i18n.load("en", {});
i18n.activate("en");

const mockHandleEndReached = jest.fn();
const mockUseExploreList = jest.fn();

jest.mock("@/screens/explore/use-explore-list", () => ({
  useExploreList: (...args: unknown[]) => mockUseExploreList(...args),
}));

jest.mock("@/components/activity-card", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    ActivityCard: ({ activity }: { activity: { title: string } }) =>
      React.createElement(Text, null, activity.title),
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

describe("ExploreList", () => {
  beforeEach(() => {
    mockHandleEndReached.mockReset();
    mockUseExploreList.mockReset();
    mockUseExploreList.mockReturnValue({
      activities: [SUPPLIED_ACTIVITIES[0]],
      isFetchingNextPage: false,
      handleEndReached: mockHandleEndReached,
    });
  });

  it("shows a next-page footer spinner while fetching", async () => {
    mockUseExploreList.mockReturnValue({
      activities: [SUPPLIED_ACTIVITIES[0]],
      isFetchingNextPage: true,
      handleEndReached: mockHandleEndReached,
    });

    await render(
      createElement(ExploreList, {
        banner: null,
        onBannerChange: jest.fn(),
        refreshing: false,
        onRefresh: jest.fn(),
      }),
      { wrapper: createWrapper() },
    );

    expect(screen.getByTestId("explore-list")).toBeTruthy();
  });

  it("retries next page from the status banner", async () => {
    const onBannerChange = jest.fn();
    const onRefresh = jest.fn();

    await render(
      createElement(ExploreList, {
        banner: { kind: "nextPage", errorKey: "errors.unknown" },
        onBannerChange,
        refreshing: false,
        onRefresh,
      }),
      { wrapper: createWrapper() },
    );

    fireEvent.press(screen.getByTestId("inline-status-retry"));
    expect(onBannerChange).toHaveBeenCalledWith(null);
    expect(mockHandleEndReached).toHaveBeenCalled();
    expect(onRefresh).not.toHaveBeenCalled();
  });

  it("invokes end reached from the list footer control", async () => {
    await render(
      createElement(ExploreList, {
        banner: null,
        onBannerChange: jest.fn(),
        refreshing: false,
        onRefresh: jest.fn(),
      }),
      { wrapper: createWrapper() },
    );

    fireEvent.press(screen.getByTestId("list-end-reached"));
    expect(mockHandleEndReached).toHaveBeenCalled();
  });
});
