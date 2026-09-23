import { createElement, Suspense, type ReactNode } from "react";
import { Keyboard } from "react-native";
import { cleanup, fireEvent, render, screen } from "@testing-library/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";

import { ExploreList } from "@/screens/explore/explore-list";
import { createQueryClient } from "@/query/client";
import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import {
  EXPLORE_CARD_HAPTIC_AMPLITUDE,
  EXPLORE_CARD_HAPTIC_FREQUENCY,
} from "@/screens/explore/constants";
import { getDiscoveryScrollOffset, setDiscoveryScrollOffset } from "@/state/discovery";

i18n.load("en", {});
i18n.activate("en");

const mockHandleEndReached = jest.fn();
const mockUseExploreList = jest.fn();
const defaultProps = {
  banner: null,
  filters: { search: "", categories: [] },
  mode: "browse" as const,
  onBannerChange: jest.fn(),
  refreshing: false,
  onRefresh: jest.fn(),
};

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
  afterEach(async () => {
    await cleanup();
  });

  beforeEach(() => {
    setDiscoveryScrollOffset(0);
    mockHandleEndReached.mockReset();
    mockUseExploreList.mockReset();
    mockUseExploreList.mockReturnValue({
      activities: [SUPPLIED_ACTIVITIES[0]],
      isFetchingNextPage: false,
      handleEndReached: mockHandleEndReached,
    });
  });

  it("restores and updates the shared catalog position before search starts", async () => {
    setDiscoveryScrollOffset(248);

    await render(
      createElement(ExploreList, {
        ...defaultProps,
      }),
      { wrapper: createWrapper() },
    );

    const list = screen.getByTestId("explore-list");
    expect(list.props.initialScrollOffset).toBe(248);

    fireEvent(list, "scrollEndDrag", {
      nativeEvent: { contentOffset: { y: 412 } },
    });
    expect(getDiscoveryScrollOffset()).toBe(412);
  });

  it("keeps the shared catalog position after search starts", async () => {
    setDiscoveryScrollOffset(248);

    await render(
      createElement(ExploreList, {
        ...defaultProps,
        filters: { search: "museum", categories: [] },
        mode: "search",
      }),
      { wrapper: createWrapper() },
    );

    const list = screen.getByTestId("search-list");
    expect(list.props.initialScrollOffset).toBeUndefined();

    fireEvent(list, "scrollEndDrag", {
      nativeEvent: { contentOffset: { y: 412 } },
    });
    expect(getDiscoveryScrollOffset()).toBe(248);
  });

  it("shows a next-page footer spinner while fetching", async () => {
    const dismissKeyboard = jest.spyOn(Keyboard, "dismiss");
    mockUseExploreList.mockReturnValue({
      activities: [SUPPLIED_ACTIVITIES[0]],
      isFetchingNextPage: true,
      handleEndReached: mockHandleEndReached,
    });

    await render(
      createElement(ExploreList, {
        ...defaultProps,
      }),
      { wrapper: createWrapper() },
    );

    expect(screen.getByTestId("explore-list")).toBeTruthy();
    expect(screen.getByTestId("explore-list").props.keyboardDismissMode).toBe("on-drag");
    expect(screen.getByTestId("explore-list").props.keyboardShouldPersistTaps).toBe("handled");
    fireEvent(screen.getByTestId("explore-list"), "scrollBeginDrag");
    expect(dismissKeyboard).toHaveBeenCalledTimes(1);
    dismissKeyboard.mockRestore();
  });

  it("retries next page from the status banner", async () => {
    const onBannerChange = jest.fn();
    const onRefresh = jest.fn();

    await render(
      createElement(ExploreList, {
        ...defaultProps,
        banner: { kind: "nextPage", errorKey: "errors.unknown" },
        onBannerChange,
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
        ...defaultProps,
      }),
      { wrapper: createWrapper() },
    );

    fireEvent.press(screen.getByTestId("list-end-reached"));
    expect(mockHandleEndReached).toHaveBeenCalled();
  });

  it("snaps cards and plays one custom haptic for a new settled card", async () => {
    const { useRealtimeComposer } = require("react-native-pulsar");
    const ReactNative = require("react-native");
    const windowDimensions = jest.spyOn(ReactNative, "useWindowDimensions").mockReturnValue({
      width: 402,
      height: 874,
      scale: 3,
      fontScale: 1,
    });

    await render(
      createElement(ExploreList, {
        ...defaultProps,
      }),
      { wrapper: createWrapper() },
    );

    const list = screen.getByTestId("explore-list");
    const composer = useRealtimeComposer.mock.results.at(-1).value;

    expect(list.props.snapToInterval).toBeGreaterThan(0);
    expect(list.props.decelerationRate).toBe("fast");
    expect(list.props.disableIntervalMomentum).toBe(true);

    await fireEvent(list, "momentumScrollEnd", {
      nativeEvent: { contentOffset: { y: list.props.snapToInterval } },
    });
    await fireEvent(list, "momentumScrollEnd", {
      nativeEvent: { contentOffset: { y: list.props.snapToInterval } },
    });

    expect(composer.playDiscrete).toHaveBeenCalledTimes(1);
    expect(composer.playDiscrete).toHaveBeenCalledWith(
      EXPLORE_CARD_HAPTIC_AMPLITUDE,
      EXPLORE_CARD_HAPTIC_FREQUENCY,
    );
    windowDimensions.mockRestore();
  });

  it("keeps the automatic-height list at a large font scale", async () => {
    const ReactNative = require("react-native");
    const windowDimensions = jest.spyOn(ReactNative, "useWindowDimensions").mockReturnValue({
      width: 402,
      height: 874,
      scale: 3,
      fontScale: 1.4,
    });

    await render(
      createElement(ExploreList, {
        ...defaultProps,
      }),
      { wrapper: createWrapper() },
    );

    const list = screen.getByTestId("explore-list");

    expect(list.props.snapToInterval).toBeUndefined();
    expect(list.props.decelerationRate).toBe("normal");
    expect(list.props.disableIntervalMomentum).toBe(false);
    windowDimensions.mockRestore();
  });
});
