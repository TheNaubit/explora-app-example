import { createElement } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { useReducedMotion } from "react-native-reanimated";

import { Favorites } from "@/screens/favorites";
import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import { addFavorite, clearFavorites } from "@/state/favorites";
import { createProviders } from "@/test/ui-test-utils";

jest.mock("expo-router", () => {
  const React = require("react");
  const { View } = require("react-native");
  const passthrough = ({ children }: { children: React.ReactNode }) =>
    React.createElement(View, null, children);
  const Link = Object.assign(passthrough, {
    AppleZoom: passthrough,
  });

  return {
    Link,
    useFocusEffect: (effect: () => void) => effect(),
    router: {
      navigate: jest.fn(),
    },
  };
});

const mockUseReducedMotion = useReducedMotion as jest.MockedFunction<typeof useReducedMotion>;

describe("Favorites screen", () => {
  beforeEach(() => {
    clearFavorites();
    mockUseReducedMotion.mockReturnValue(false);
  });

  it("shows empty state and navigates to Explore", async () => {
    const { router } = require("expo-router");

    await render(createElement(Favorites), {
      wrapper: createProviders(),
    });

    await waitFor(() => expect(screen.getByTestId("favorites-empty")).toBeTruthy());
    expect(screen.queryByTestId("favorites-summary")).toBeNull();
    await fireEvent.press(screen.getByTestId("empty-state-action"));
    expect(router.navigate).toHaveBeenCalledWith("/(explore)");
  });

  it("lists favorite activities", async () => {
    const ReactNative = require("react-native");
    const windowDimensions = jest.spyOn(ReactNative, "useWindowDimensions").mockReturnValue({
      width: 402,
      height: 874,
      scale: 3,
      fontScale: 1,
    });
    addFavorite(SUPPLIED_ACTIVITIES[0]);

    await render(createElement(Favorites), {
      wrapper: createProviders(),
    });

    await waitFor(() => expect(screen.getByTestId("favorites-list")).toBeTruthy());
    const list = screen.getByTestId("favorites-list");
    expect(screen.getByText(SUPPLIED_ACTIVITIES[0].title)).toBeTruthy();
    expect(screen.queryByText("Favorite details stay available offline.")).toBeNull();
    expect(screen.getByTestId("favorites-summary").props.accessibilityLabel).toBe(
      "1 activity, available offline",
    );
    expect(list.props.snapToInterval).toBeGreaterThan(0);
    expect(list.props.decelerationRate).toBe("fast");
    expect(list.props.disableIntervalMomentum).toBe(true);
    expect(screen.queryByTestId("search-field")).toBeNull();
    expect(screen.queryByTestId("category-chip-row")).toBeNull();
    expect(screen.queryByTestId("refresh-control")).toBeNull();
    expect(screen.queryByTestId("list-end-reached")).toBeNull();
    windowDimensions.mockRestore();
  });

  it("removes a favorite card immediately when reduced motion is active", async () => {
    mockUseReducedMotion.mockReturnValue(true);
    const activity = SUPPLIED_ACTIVITIES[0];
    addFavorite(activity);

    await render(createElement(Favorites), {
      wrapper: createProviders(),
    });

    await fireEvent.press(screen.getByTestId(`favorite-button-${activity.id}`));

    await waitFor(() => expect(screen.getByTestId("favorites-empty")).toBeTruthy());
  });
});
