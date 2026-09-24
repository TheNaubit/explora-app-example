import { createElement } from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import { resetCatalog } from "@/mocks/catalog-store";
import { resetReviewModeState, setInitialLoadMode } from "@/mocks/review-mode";
import { showNativeToast } from "@/native-toast";
import { ActivityDetail } from "@/screens/activity-detail";
import {
  getCalendarStatusCopy,
  getCalendarToastType,
  shouldShowCalendarRecovery,
} from "@/screens/activity-detail/add-to-calendar-section";
import { NativeFeedbackTestPanel } from "@/screens/activity-detail/native-feedback-test-panel";
import { addFavorite, clearFavorites, isFavorite } from "@/state/favorites";
import { createProviders, createQueryClient } from "@/test/ui-test-utils";

jest.mock("@/mocks/delay", () => ({
  MOCK_DELAY_MS: { normal: 1, slow: 2 },
  delay: jest.fn(() => Promise.resolve()),
}));

jest.mock("@/native-toast", () => ({
  isNativeToastAvailable: jest.fn(() => true),
  showNativeToast: jest.fn(),
}));

jest.mock("expo-glass-effect", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    GlassView: ({ children, ...rest }: { children: React.ReactNode }) =>
      React.createElement(View, rest, children),
    isGlassEffectAPIAvailable: () => false,
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
    jest.clearAllMocks();
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
    await waitFor(() => expect(screen.getByText(activity.title)).toBeTruthy());
    expect(screen.getByText(activity.description)).toBeTruthy();
    expect(screen.getByText(activity.location)).toBeTruthy();

    const categoryBadge = screen.getByTestId("activity-detail-category");
    expect(categoryBadge.props.focusable).toBe(false);
    expect(
      screen.getByTestId("activity-detail-category-icon", { includeHiddenElements: true }).props
        .accessibilityElementsHidden,
    ).toBe(true);

    const favoriteButton = screen.getByTestId("activity-detail-favorite");

    expect(favoriteButton.props.accessibilityState).toEqual({ selected: false });
    expect(screen.queryByText("Save for later")).toBeNull();
    expect(screen.queryByText("Remove from Favorites")).toBeNull();

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

    const calendarButton = screen.getByTestId("add-to-calendar-button");
    expect(calendarButton.props.accessibilityLabel).toBe("Add to Calendar");
    expect(calendarButton.props.accessibilityHint).toBe(
      "Opens a sheet to choose the activity date and start time.",
    );
    expect(calendarButton.props.accessibilityRole).toBe("button");
    expect(calendarButton.props.accessibilityState).toEqual({ busy: false, disabled: false });
    const calendarButtonStyle = StyleSheet.flatten(calendarButton.props.style);
    expect(calendarButtonStyle).toEqual(
      expect.objectContaining({ alignSelf: "stretch", minHeight: 44 }),
    );
    expect(calendarButtonStyle.width).toBeGreaterThan(calendarButtonStyle.minHeight);

    fireEvent.press(calendarButton);

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

  it("keeps native calendar cancellation silent", () => {
    expect(getCalendarStatusCopy("canceled", jest.fn())).toBeNull();
  });

  it("maps calendar outcomes to native feedback types", () => {
    expect(getCalendarToastType("saved")).toBe("success");
    expect(getCalendarToastType("submitted")).toBe("info");
    expect(getCalendarToastType("duplicate")).toBe("warning");
    expect(getCalendarToastType("permission-denied")).toBe("error");
  });

  it("does not keep a persistent banner after calendar success", () => {
    expect(shouldShowCalendarRecovery("saved")).toBe(false);
    expect(shouldShowCalendarRecovery("submitted")).toBe(false);
    expect(shouldShowCalendarRecovery("permission-denied")).toBe(true);
    expect(shouldShowCalendarRecovery("native-error")).toBe(true);
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

    await waitFor(() => expect(screen.getByText(activity.title)).toBeTruthy());
    await waitFor(() => expect(screen.getByTestId("activity-detail-saved-fallback")).toBeTruthy());
  });

  it("triggers each native feedback type from the development test panel", async () => {
    await render(createElement(NativeFeedbackTestPanel), {
      wrapper: createProviders(createQueryClient()),
    });

    expect(screen.getByTestId("native-feedback-test-panel")).toBeTruthy();
    expect(screen.getByTestId("native-feedback-module-status").props.children).toBe(
      "Native module ready",
    );

    fireEvent.press(screen.getByTestId("native-feedback-success"));
    fireEvent.press(screen.getByTestId("native-feedback-warning"));
    fireEvent.press(screen.getByTestId("native-feedback-error"));
    fireEvent.press(screen.getByTestId("native-feedback-info"));

    expect(showNativeToast).toHaveBeenNthCalledWith(1, {
      duration: 6000,
      message: "Native success feedback is working.",
      title: "Success",
      type: "success",
    });
    expect(showNativeToast).toHaveBeenNthCalledWith(2, {
      duration: 6000,
      message: "Native warning feedback is working.",
      title: "Warning",
      type: "warning",
    });
    expect(showNativeToast).toHaveBeenNthCalledWith(3, {
      duration: 6000,
      message: "Native error feedback is working.",
      title: "Error",
      type: "error",
    });
    expect(showNativeToast).toHaveBeenNthCalledWith(4, {
      duration: 6000,
      message: "Native information feedback is working.",
      title: "Info",
      type: "info",
    });
  });
});
