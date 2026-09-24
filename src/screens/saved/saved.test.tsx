import { createElement } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { useReducedMotion } from "react-native-reanimated";

import { Saved } from "@/screens/saved";
import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import { addFavorite, clearFavorites } from "@/state/favorites";
import { createProviders } from "@/test/ui-test-utils";

jest.mock("expo-router", () => ({
  router: {
    navigate: jest.fn(),
  },
}));

const mockUseReducedMotion = useReducedMotion as jest.MockedFunction<typeof useReducedMotion>;

describe("Saved screen", () => {
  beforeEach(() => {
    clearFavorites();
    mockUseReducedMotion.mockReturnValue(false);
  });

  it("shows empty state and navigates to Explore", async () => {
    const { router } = require("expo-router");

    await render(createElement(Saved), {
      wrapper: createProviders(),
    });

    await waitFor(() => expect(screen.getByTestId("saved-empty")).toBeTruthy());
    fireEvent.press(screen.getByTestId("empty-state-action"));
    expect(router.navigate).toHaveBeenCalledWith("/");
  });

  it("lists saved activities", async () => {
    const ReactNative = require("react-native");
    const windowDimensions = jest.spyOn(ReactNative, "useWindowDimensions").mockReturnValue({
      width: 402,
      height: 874,
      scale: 3,
      fontScale: 1,
    });
    addFavorite(SUPPLIED_ACTIVITIES[0]);

    await render(createElement(Saved), {
      wrapper: createProviders(),
    });

    await waitFor(() => expect(screen.getByTestId("saved-list")).toBeTruthy());
    const list = screen.getByTestId("saved-list");
    expect(screen.getByText(SUPPLIED_ACTIVITIES[0].title)).toBeTruthy();
    expect(screen.queryByText("Saved details stay available offline.")).toBeNull();
    expect(list.props.snapToInterval).toBeGreaterThan(0);
    expect(list.props.decelerationRate).toBe("fast");
    expect(list.props.disableIntervalMomentum).toBe(true);
    expect(screen.queryByTestId("search-field")).toBeNull();
    expect(screen.queryByTestId("category-chip-row")).toBeNull();
    expect(screen.queryByTestId("refresh-control")).toBeNull();
    expect(screen.queryByTestId("list-end-reached")).toBeNull();
    windowDimensions.mockRestore();
  });

  it("removes a saved card immediately when reduced motion is active", async () => {
    mockUseReducedMotion.mockReturnValue(true);
    const activity = SUPPLIED_ACTIVITIES[0];
    addFavorite(activity);

    await render(createElement(Saved), {
      wrapper: createProviders(),
    });

    fireEvent.press(screen.getByTestId(`favorite-button-${activity.id}`));

    await waitFor(() => expect(screen.getByTestId("saved-empty")).toBeTruthy());
  });
});
