import { createElement } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { Saved } from "@/screens/saved";
import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import { addFavorite, clearFavorites } from "@/state/favorites";
import { createProviders } from "@/test/ui-test-utils";

jest.mock("expo-router", () => ({
  router: {
    navigate: jest.fn(),
  },
}));

describe("Saved screen", () => {
  beforeEach(() => {
    clearFavorites();
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
    addFavorite(SUPPLIED_ACTIVITIES[0]);

    await render(createElement(Saved), {
      wrapper: createProviders(),
    });

    await waitFor(() => expect(screen.getByTestId("saved-list")).toBeTruthy());
    expect(screen.getByText(SUPPLIED_ACTIVITIES[0].title)).toBeTruthy();
  });
});
