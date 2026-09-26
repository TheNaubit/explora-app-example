import { createElement } from "react";
import * as ReactNative from "react-native";
import { cleanup, fireEvent, render } from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";

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
    expect(
      view.getByTestId(`activity-card-image-blend-${activity.id}`, {
        includeHiddenElements: true,
      }),
    ).toBeTruthy();
    expect(view.getByTestId(`activity-card-image-${activity.id}`)).toBeTruthy();
    await fireEvent.press(view.getByTestId(`activity-card-${activity.id}`));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renders a non-interactive card without onPress", async () => {
    const activity = SUPPLIED_ACTIVITIES[0];
    const view = await render(createElement(ActivityCard, { activity }), {
      wrapper: createProviders(),
    });

    expect(view.getByTestId(`activity-card-${activity.id}`)).toBeTruthy();
  });

  it("renders the optional focus blur layer", async () => {
    const activity = SUPPLIED_ACTIVITIES[0];

    function CardWithFocusBlur() {
      const imageBlurOpacity = useSharedValue(0.82);

      return (
        <ActivityCard activity={activity} imageBlurOpacity={imageBlurOpacity} imageBlurRadius={7} />
      );
    }

    const view = await render(createElement(CardWithFocusBlur), {
      wrapper: createProviders(),
    });

    expect(
      view.getByTestId(`activity-card-focus-blur-${activity.id}`, {
        includeHiddenElements: true,
      }),
    ).toBeTruthy();
  });

  it("allows the title and metadata to wrap with large text", async () => {
    const dimensions = jest.spyOn(ReactNative, "useWindowDimensions").mockReturnValue({
      fontScale: 2,
      height: 844,
      scale: 3,
      width: 390,
    });
    const activity = SUPPLIED_ACTIVITIES[0];
    const view = await render(createElement(ActivityCard, { activity }), {
      wrapper: createProviders(),
    });

    expect(view.getByText(activity.title).props.numberOfLines).toBeUndefined();
    expect(view.getByText(new RegExp(activity.location)).props.numberOfLines).toBeUndefined();
    dimensions.mockRestore();
  });
});
