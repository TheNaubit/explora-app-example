import { createElement } from "react";
import { StyleSheet } from "react-native";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import { delay } from "@/mocks/delay";
import { resetCatalog } from "@/mocks/catalog-store";
import { resetReviewModeState, setDetailLoadMode } from "@/mocks/review-mode";
import { showNativeToast } from "@/native-toast";
import { ActivityDetail } from "@/screens/activity-detail";
import {
  getCalendarStatusCopy,
  getCalendarFeedbackPresentation,
  shouldShowCalendarRecovery,
} from "@/screens/activity-detail/add-to-calendar-section";
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

const mockDelay = delay as jest.MockedFunction<typeof delay>;

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
    mockDelay.mockResolvedValue(undefined);
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
    expect(screen.getByTestId("activity-detail-fact-location").props.accessibilityLabel).toBe(
      `Location, ${activity.location}`,
    );
    expect(screen.getByTestId("activity-detail-fact-duration").props.accessibilityLabel).toMatch(
      /^Duration, /,
    );
    expect(screen.getByTestId("activity-detail-fact-location").props.focusable).toBe(false);
    expect(
      screen.getByTestId("activity-detail-compact-bar", { includeHiddenElements: true }).props
        .accessibilityElementsHidden,
    ).toBe(true);
    expect(
      screen.getByTestId("activity-detail-hero-blend", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      screen.getByTestId("activity-detail-hero-blur", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      screen.getByTestId("activity-detail-hero-surface-fade", { includeHiddenElements: true }),
    ).toBeTruthy();

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

    await fireEvent.press(favoriteButton);
    expect(isFavorite(activity.id)).toBe(true);
    await waitFor(() =>
      expect(screen.getByTestId("activity-detail-favorite").props.accessibilityState).toEqual({
        selected: true,
      }),
    );

    await fireEvent.press(screen.getByTestId("activity-detail-favorite"));
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

  it("exposes one accessible loading status while detail is pending", async () => {
    let resolveDelay: (() => void) | undefined;
    mockDelay.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveDelay = resolve;
        }),
    );
    setDetailLoadMode("slow");

    await render(createElement(ActivityDetail, { id: SUPPLIED_ACTIVITIES[0].id }), {
      wrapper: createProviders(createQueryClient()),
    });

    const skeleton = screen.getByTestId("activity-detail-skeleton");
    expect(skeleton.props.accessibilityRole).toBe("progressbar");
    expect(skeleton.props.accessibilityLabel).toBe("Loading activity details.");

    await act(async () => {
      resolveDelay?.();
    });
    await waitFor(() => expect(screen.getByTestId("activity-detail-content")).toBeTruthy());
  });

  it("handles invalid detail data without a render error", async () => {
    const activity = SUPPLIED_ACTIVITIES[0];
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
    setDetailLoadMode("invalid-data");

    await render(createElement(ActivityDetail, { id: activity.id }), {
      wrapper: createProviders(createQueryClient()),
    });

    await waitFor(() => expect(screen.getByTestId("activity-detail-error")).toBeTruthy());
    expect(screen.getByText("Could not load activity")).toBeTruthy();
    expect(screen.getByText("The data from the server was invalid.")).toBeTruthy();
    expect(screen.getByTestId("activity-detail-error").props.accessibilityRole).toBe("alert");
    expect(screen.getByTestId("activity-detail-error-retry").props.accessibilityRole).toBe(
      "button",
    );
    expect(screen.getByTestId("activity-detail-back")).toBeTruthy();
    expect(screen.queryByTestId("query-error-boundary")).toBeNull();
    expect(consoleError).not.toHaveBeenCalled();

    setDetailLoadMode("normal");
    await fireEvent.press(screen.getByTestId("activity-detail-error-retry"));
    await waitFor(() => expect(screen.getByText(activity.title)).toBeTruthy());

    consoleError.mockRestore();
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

    await fireEvent.press(calendarButton);

    expect(await screen.findByTestId("calendar-schedule-sheet")).toBeTruthy();
    expect(screen.getByText("Date and time")).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();
    expect(screen.getByText("Done")).toBeTruthy();
    expect(screen.getByTestId("calendar-date-time-picker").props.displayedComponents).toEqual([
      "date",
      "hourAndMinute",
    ]);

    await fireEvent.press(screen.getByTestId("calendar-schedule-cancel"));
    await waitFor(() => expect(screen.queryByTestId("calendar-schedule-sheet")).toBeNull());
  });

  it("keeps native calendar cancellation silent", () => {
    expect(getCalendarStatusCopy("canceled", jest.fn())).toBeNull();
  });

  it("shows native feedback only for confirmed calendar saves", () => {
    expect(getCalendarFeedbackPresentation("saved")).toBe("toast");
    expect(getCalendarFeedbackPresentation("submitted")).toBe("none");
    expect(getCalendarFeedbackPresentation("canceled")).toBe("none");
    expect(getCalendarFeedbackPresentation("duplicate")).toBe("none");
    expect(getCalendarFeedbackPresentation("permission-denied")).toBe("inline");
  });

  it("does not keep a persistent banner after calendar success", () => {
    expect(shouldShowCalendarRecovery("saved")).toBe(false);
    expect(shouldShowCalendarRecovery("submitted")).toBe(false);
    expect(shouldShowCalendarRecovery("past-date")).toBe(true);
    expect(shouldShowCalendarRecovery("permission-denied")).toBe(true);
    expect(shouldShowCalendarRecovery("native-error")).toBe(true);
  });

  it("keeps a saved snapshot visible when current detail loading fails", async () => {
    const activity = SUPPLIED_ACTIVITIES[0];
    const queryClient = createQueryClient();
    queryClient.setDefaultOptions({
      mutations: { gcTime: Infinity, networkMode: "always", retry: 0 },
      queries: { gcTime: Infinity, networkMode: "always", retry: false },
    });
    addFavorite(activity);
    setDetailLoadMode("fail");

    await render(createElement(ActivityDetail, { id: activity.id }), {
      wrapper: createProviders(queryClient),
    });

    await waitFor(() => expect(screen.getByText(activity.title)).toBeTruthy());
    await waitFor(() =>
      expect(showNativeToast).toHaveBeenCalledWith({
        message: expect.any(String),
        title: expect.any(String),
        type: "error",
      }),
    );
    expect(screen.queryByTestId("activity-detail-saved-fallback")).toBeNull();
  });
});
