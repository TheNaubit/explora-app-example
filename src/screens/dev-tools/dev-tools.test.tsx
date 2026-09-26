import { Alert, StyleSheet } from "react-native";
import { createElement } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { DevTools } from "@/screens/dev-tools";
import { resetLocalData } from "@/screens/dev-tools/dev-tools-actions";
import { getReviewModeState, resetReviewModeState } from "@/mocks/review-mode";
import { showNativeToast } from "@/native-toast";
import { createProviders, createQueryClient } from "@/test/ui-test-utils";

jest.mock("@/native-toast", () => ({
  isNativeToastAvailable: jest.fn(() => true),
  showNativeToast: jest.fn(),
}));

jest.mock("expo-router", () => {
  const React = require("react");

  return {
    useFocusEffect(callback: () => void) {
      React.useEffect(callback, [callback]);
    },
  };
});

describe("Dev Tools screen", () => {
  afterEach(async () => {
    await cleanup();
  });

  beforeEach(() => {
    resetLocalData(createQueryClient());
    resetReviewModeState();
  });

  it("shows grouped request modes and local counts", async () => {
    await render(createElement(DevTools), { wrapper: createProviders() });

    expect(screen.getByTestId("dev-tools-screen")).toBeTruthy();
    expect(screen.getByText("First catalog load")).toBeTruthy();
    expect(screen.getByText("Activity detail")).toBeTruthy();
    expect(screen.getByText("Later page load")).toBeTruthy();
    expect(screen.getByText("Refresh")).toBeTruthy();
    expect(screen.getByLabelText("Catalog activities, 1,012")).toBeTruthy();
    expect(screen.getByTestId("dev-tools-favorite-count")).toBeTruthy();
  });

  it("uses the screen root as the native large-title scroll view", async () => {
    await render(createElement(DevTools), { wrapper: createProviders() });

    const devToolsScreen = screen.getByTestId("dev-tools-screen");

    expect(devToolsScreen.props.contentInsetAdjustmentBehavior).toBe("automatic");
    expect(StyleSheet.flatten(devToolsScreen.props.contentContainerStyle)).toMatchObject({
      paddingHorizontal: 20,
    });
    expect(
      StyleSheet.flatten(devToolsScreen.props.contentContainerStyle).paddingStart,
    ).toBeUndefined();
    expect(
      StyleSheet.flatten(devToolsScreen.props.contentContainerStyle).paddingEnd,
    ).toBeUndefined();
  });

  it("selects a slow initial load with radio semantics", async () => {
    await render(createElement(DevTools), { wrapper: createProviders() });

    await fireEvent.press(screen.getByTestId("dev-tools-initial-load-slow"));

    await waitFor(() => {
      expect(screen.getByTestId("dev-tools-initial-load-slow").props.accessibilityState).toEqual({
        checked: true,
      });
    });
    expect(getReviewModeState().initialLoad).toBe("slow");
  });

  it("offers a valid empty first catalog state", async () => {
    await render(createElement(DevTools), { wrapper: createProviders() });

    await fireEvent.press(screen.getByTestId("dev-tools-initial-load-empty"));

    await waitFor(() => expect(getReviewModeState().initialLoad).toBe("empty"));
  });

  it("offers timeout, invalid-data, and not-found scenarios", async () => {
    await render(createElement(DevTools), { wrapper: createProviders() });

    await fireEvent.press(screen.getByTestId("dev-tools-initial-load-timeout"));
    await fireEvent.press(screen.getByTestId("dev-tools-page-load-invalid-data"));
    await fireEvent.press(screen.getByTestId("dev-tools-detail-load-not-found"));

    await waitFor(() => {
      expect(getReviewModeState()).toEqual({
        detailLoad: "not-found",
        initialLoad: "timeout",
        pageLoad: "invalid-data",
        refresh: "success",
      });
    });
  });

  it("previews only the feedback surfaces allowed by policy", async () => {
    await render(createElement(DevTools), { wrapper: createProviders() });

    expect(screen.getByLabelText("Native feedback module, Ready")).toBeTruthy();

    await fireEvent.press(screen.getByTestId("dev-tools-transient-error"));
    expect(showNativeToast).toHaveBeenLastCalledWith({
      message: "Your current activities are still available.",
      title: "Could not refresh",
      type: "error",
    });

    await fireEvent.press(screen.getByTestId("dev-tools-actionable-error"));
    const recoveryPreview = await screen.findByTestId("dev-tools-inline-recovery-preview");

    expect(StyleSheet.flatten(recoveryPreview.props.style).marginHorizontal).toBeUndefined();
    expect(screen.getByLabelText("Try again")).toBeTruthy();

    await fireEvent.press(screen.getByTestId("dev-tools-calendar-success"));
    expect(showNativeToast).toHaveBeenLastCalledWith({
      message: "The event was saved to your calendar.",
      title: "Added to Calendar",
      type: "success",
    });
  });

  it("asks for confirmation before resetting local data", async () => {
    const alert = jest.spyOn(Alert, "alert").mockImplementation(jest.fn());
    await render(createElement(DevTools), { wrapper: createProviders() });

    await fireEvent.press(screen.getByTestId("dev-tools-reset-local-data"));

    expect(alert).toHaveBeenCalledWith(
      "Reset local data?",
      expect.any(String),
      expect.arrayContaining([expect.objectContaining({ style: "destructive", text: "Reset" })]),
    );
    alert.mockRestore();
  });
});
