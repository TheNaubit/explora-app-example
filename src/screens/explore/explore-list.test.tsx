import { createElement, Suspense, type ReactNode } from "react";
import { Keyboard } from "react-native";
import { cleanup, fireEvent, render, screen } from "@testing-library/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";

import { ExploreList } from "@/screens/explore/explore-list";
import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import {
  EXPLORE_CARD_HAPTIC_AMPLITUDE,
  EXPLORE_CARD_HAPTIC_FREQUENCY,
} from "@/screens/explore/constants";
import {
  getDiscoveryScrollOffset,
  resetDiscoveryScrollOffsets,
  setDiscoveryScrollOffset,
} from "@/state/discovery";
import { createTestQueryClient as createQueryClient } from "@/test/create-test-query-client";

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
    resetDiscoveryScrollOffsets();
    mockHandleEndReached.mockReset();
    mockUseExploreList.mockReset();
    mockUseExploreList.mockReturnValue({
      activities: [SUPPLIED_ACTIVITIES[0]],
      isFetchingNextPage: false,
      handleEndReached: mockHandleEndReached,
    });
  });

  it("restores and updates the shared catalog position before search starts", async () => {
    setDiscoveryScrollOffset(defaultProps.filters, 248);

    await render(
      createElement(ExploreList, {
        ...defaultProps,
      }),
      { wrapper: createWrapper() },
    );

    const list = screen.getByTestId("explore-list");
    expect(list.props.initialScrollOffset).toBe(248);

    await fireEvent(list, "scrollEndDrag", {
      nativeEvent: { contentOffset: { y: 412 } },
    });
    expect(getDiscoveryScrollOffset(defaultProps.filters)).toBe(412);
  });

  it("restores search position without replacing the browse position", async () => {
    const searchFilters = { search: "museum", categories: [] } as const;
    setDiscoveryScrollOffset(defaultProps.filters, 248);
    setDiscoveryScrollOffset(searchFilters, 176);

    await render(
      createElement(ExploreList, {
        ...defaultProps,
        filters: searchFilters,
        mode: "search",
      }),
      { wrapper: createWrapper() },
    );

    const list = screen.getByTestId("search-list");
    expect(list.props.initialScrollOffset).toBe(176);

    await fireEvent(list, "scrollEndDrag", {
      nativeEvent: { contentOffset: { y: 412 } },
    });
    expect(getDiscoveryScrollOffset(searchFilters)).toBe(412);
    expect(getDiscoveryScrollOffset(defaultProps.filters)).toBe(248);
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
    const progress = screen.getByTestId("explore-next-page-progress", {
      includeHiddenElements: true,
    });
    expect(progress.props.accessibilityElementsHidden).toBe(true);
    expect(progress.props.importantForAccessibility).toBe("no-hide-descendants");
    expect(screen.getByTestId("explore-list").props.keyboardDismissMode).toBe("on-drag");
    expect(screen.getByTestId("explore-list").props.keyboardShouldPersistTaps).toBe("handled");
    await fireEvent(screen.getByTestId("explore-list"), "scrollBeginDrag");
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

    await fireEvent.press(screen.getByTestId("explore-next-page-retry"));
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

    await fireEvent.press(screen.getByTestId("list-end-reached"));
    expect(mockHandleEndReached).toHaveBeenCalled();
  });

  it("commits once at full pull and resets for the next gesture", async () => {
    const { useRealtimeComposer } = require("react-native-pulsar");
    const onRefresh = jest.fn();

    const view = await render(
      createElement(ExploreList, {
        ...defaultProps,
        onRefresh,
      }),
      { wrapper: createWrapper() },
    );

    const list = screen.getByTestId("explore-list");
    const pullComposer = useRealtimeComposer.mock.results.at(-2).value;

    await fireEvent(list, "scrollBeginDrag");
    await fireEvent(list, "scroll", {
      nativeEvent: { contentInset: { top: 0 }, contentOffset: { y: -36 } },
    });
    const forwardPull = pullComposer.set.mock.calls.at(-1);

    await fireEvent(list, "scroll", {
      nativeEvent: { contentInset: { top: 0 }, contentOffset: { y: -18 } },
    });
    const reversePull = pullComposer.set.mock.calls.at(-1);

    expect(onRefresh).not.toHaveBeenCalled();
    expect(forwardPull[0]).toBeGreaterThan(reversePull[0]);
    expect(forwardPull[1]).toBeGreaterThan(reversePull[1]);

    pullComposer.stop.mockClear();
    await fireEvent(list, "scrollEndDrag", {
      nativeEvent: { contentInset: { top: 0 }, contentOffset: { y: -18 } },
    });
    expect(pullComposer.stop).toHaveBeenCalled();

    await fireEvent(list, "scrollBeginDrag");
    await fireEvent(list, "scroll", {
      nativeEvent: { contentInset: { top: 0 }, contentOffset: { y: -72 } },
    });
    await fireEvent(list, "scroll", {
      nativeEvent: { contentInset: { top: 0 }, contentOffset: { y: -90 } },
    });
    expect(onRefresh).toHaveBeenCalledTimes(1);
    await fireEvent.press(screen.getByTestId("refresh-control"));
    expect(onRefresh).toHaveBeenCalledTimes(1);

    await view.rerender(
      createElement(ExploreList, {
        ...defaultProps,
        onRefresh,
        refreshing: true,
      }),
    );
    await view.rerender(
      createElement(ExploreList, {
        ...defaultProps,
        onRefresh,
        refreshing: false,
      }),
    );

    await fireEvent(list, "scrollBeginDrag");
    await fireEvent(list, "scroll", {
      nativeEvent: { contentInset: { top: 0 }, contentOffset: { y: -72 } },
    });
    expect(onRefresh).toHaveBeenCalledTimes(2);
    expect(
      screen.getByTestId("pull-to-refresh-indicator", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      screen.getByTestId("pull-to-refresh-progress-path", { includeHiddenElements: true }).props
        .fill,
    ).toBeNull();
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
