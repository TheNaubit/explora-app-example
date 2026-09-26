import { createElement } from "react";
import { cleanup, fireEvent, render } from "@testing-library/react-native";

import { FavoriteButton } from "@/components/favorite-button";
import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import { clearFavorites, isFavorite } from "@/state/favorites";
import { createProviders } from "@/test/ui-test-utils";

afterEach(async () => {
  await cleanup();
  clearFavorites();
});

describe("FavoriteButton", () => {
  it("saves and removes a favorite", async () => {
    const activity = SUPPLIED_ACTIVITIES[0];
    const view = await render(createElement(FavoriteButton, { activity }), {
      wrapper: createProviders(),
    });

    await fireEvent.press(view.getByTestId(`favorite-button-${activity.id}`));
    expect(isFavorite(activity.id)).toBe(true);

    await view.rerender(createElement(FavoriteButton, { activity }));
    await fireEvent.press(view.getByTestId(`favorite-button-${activity.id}`));
    expect(isFavorite(activity.id)).toBe(false);
  });
});
