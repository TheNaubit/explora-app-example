import { createElement } from "react";
import { cleanup, fireEvent, render } from "@testing-library/react-native";

import { ActivityCard } from "@/components/activity-card";
import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import { clearFavorites } from "@/state/favorites";
import { createProviders } from "@/test/ui-test-utils";

afterEach(async () => {
  await cleanup();
  clearFavorites();
});

describe("ActivityCard", () => {
  it("renders activity fields and optional press", async () => {
    const activity = SUPPLIED_ACTIVITIES[0];
    const onPress = jest.fn();
    const view = await render(createElement(ActivityCard, { activity, onPress }), {
      wrapper: createProviders(),
    });

    expect(view.getByText(activity.title)).toBeTruthy();
    expect(view.getByText(new RegExp(activity.location))).toBeTruthy();
    expect(view.getByText(activity.category)).toBeTruthy();
    expect(view.getByTestId(`activity-card-image-${activity.id}`)).toBeTruthy();
    fireEvent.press(view.getByTestId(`activity-card-${activity.id}`));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renders a non-interactive card without onPress", async () => {
    const activity = SUPPLIED_ACTIVITIES[0];
    const view = await render(createElement(ActivityCard, { activity }), {
      wrapper: createProviders(),
    });

    expect(view.getByTestId(`activity-card-${activity.id}`)).toBeTruthy();
  });
});
