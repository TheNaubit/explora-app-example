import { createElement } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import { resetCatalog } from "@/mocks/catalog-store";
import { resetReviewModeState, setInitialLoadMode } from "@/mocks/review-mode";
import { ActivityDetail } from "@/screens/activity-detail";
import { addFavorite, clearFavorites, isFavorite } from "@/state/favorites";
import { createProviders, createQueryClient } from "@/test/ui-test-utils";

jest.mock("@/mocks/delay", () => ({
  MOCK_DELAY_MS: { normal: 1, slow: 2 },
  delay: jest.fn(() => Promise.resolve()),
}));

jest.mock("expo-glass-effect", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    GlassView: ({ children, ...rest }: { children: React.ReactNode }) =>
      React.createElement(View, rest, children),
    isLiquidGlassAvailable: () => false,
  };
});

jest.mock("expo-router", () => {
  const React = require("react");
  const { View } = require("react-native");
  const passthrough = ({ children }: { children: React.ReactNode }) =>
    React.createElement(View, null, children);
  const Link = Object.assign(passthrough, {
    AppleZoom: passthrough,
    AppleZoomTarget: passthrough,
  });

  return {
    Link,
    router: {
      back: jest.fn(),
    },
  };
});

describe("ActivityDetail", () => {
  beforeEach(() => {
    clearFavorites();
    resetCatalog();
    resetReviewModeState();
  });

  it("shows activity content and toggles the header favorite action", async () => {
    const activity = SUPPLIED_ACTIVITIES[0];

    await render(createElement(ActivityDetail, { id: activity.id }), {
      wrapper: createProviders(createQueryClient()),
    });

    await waitFor(() => expect(screen.getByTestId("activity-detail-content")).toBeTruthy());
    expect(screen.getByText(activity.title)).toBeTruthy();
    expect(screen.getByText(activity.description)).toBeTruthy();
    expect(screen.getByText(activity.location)).toBeTruthy();

    const favoriteButton = screen.getByTestId("activity-detail-favorite");

    expect(favoriteButton.props.accessibilityState).toEqual({ selected: false });
    expect(screen.queryByText("Save for later")).toBeNull();
    expect(screen.queryByText("Remove from Saved")).toBeNull();

    fireEvent.press(favoriteButton);
    expect(isFavorite(activity.id)).toBe(true);
    await waitFor(() =>
      expect(screen.getByTestId("activity-detail-favorite").props.accessibilityState).toEqual({
        selected: true,
      }),
    );

    fireEvent.press(screen.getByTestId("activity-detail-favorite"));
    await waitFor(() => expect(isFavorite(activity.id)).toBe(false));
  });

  it("shows a designed not-found state", async () => {
    await render(createElement(ActivityDetail, { id: "missing-activity" }), {
      wrapper: createProviders(createQueryClient()),
    });

    await waitFor(() => expect(screen.getByTestId("activity-detail-not-found")).toBeTruthy());
    expect(screen.getByText("Activity unavailable")).toBeTruthy();
    expect(screen.getByText("Go back")).toBeTruthy();
  });

  it("opens a compact calendar sheet from one Activity Detail action", async () => {
    const activity = SUPPLIED_ACTIVITIES[0];

    await render(createElement(ActivityDetail, { id: activity.id }), {
      wrapper: createProviders(createQueryClient()),
    });

    await waitFor(() => expect(screen.getByTestId("activity-detail-content")).toBeTruthy());
    expect(screen.queryByText("Plan this activity")).toBeNull();
    expect(screen.queryByText("Date and start time")).toBeNull();

    fireEvent.press(screen.getByTestId("add-to-calendar-button"));

    expect(await screen.findByTestId("calendar-schedule-sheet")).toBeTruthy();
    expect(screen.getByText("Date and time")).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();
    expect(screen.getByText("Done")).toBeTruthy();
    expect(screen.getByTestId("calendar-date-time-picker").props.displayedComponents).toEqual([
      "date",
      "hourAndMinute",
    ]);

    fireEvent.press(screen.getByTestId("calendar-schedule-cancel"));
    await waitFor(() => expect(screen.queryByTestId("calendar-schedule-sheet")).toBeNull());
  });

  it("keeps a saved snapshot visible when current detail loading fails", async () => {
    const activity = SUPPLIED_ACTIVITIES[0];
    const queryClient = createQueryClient();
    queryClient.setDefaultOptions({
      mutations: { networkMode: "always", retry: 0 },
      queries: { networkMode: "always", retry: false },
    });
    addFavorite(activity);
    setInitialLoadMode("fail");

    await render(createElement(ActivityDetail, { id: activity.id }), {
      wrapper: createProviders(queryClient),
    });

    expect(screen.getByText(activity.title)).toBeTruthy();
    await waitFor(() => expect(screen.getByTestId("activity-detail-saved-fallback")).toBeTruthy());
  });
});
