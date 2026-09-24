import { Alert } from "react-native";
import { createElement } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { DevTools } from "@/screens/dev-tools";
import { resetLocalData } from "@/screens/dev-tools/dev-tools-actions";
import { getReviewModeState, resetReviewModeState } from "@/mocks/review-mode";
import { createProviders, createQueryClient } from "@/test/ui-test-utils";

jest.mock("expo-router", () => {
  const React = require("react");

  return {
    useFocusEffect(callback: () => void) {
      React.useEffect(callback, [callback]);
    },
  };
});

describe("Dev Tools screen", () => {
  beforeEach(() => {
    resetLocalData(createQueryClient());
    resetReviewModeState();
  });

  it("shows grouped request modes and local counts", async () => {
    await render(createElement(DevTools), { wrapper: createProviders() });

    expect(screen.getByTestId("dev-tools-screen")).toBeTruthy();
    expect(screen.getByText("Initial load")).toBeTruthy();
    expect(screen.getByText("Later page load")).toBeTruthy();
    expect(screen.getByText("Refresh")).toBeTruthy();
    expect(screen.getByLabelText("Catalog activities, 1,012")).toBeTruthy();
    expect(screen.getByTestId("dev-tools-favorite-count")).toBeTruthy();
  });

  it("selects a slow initial load with radio semantics", async () => {
    await render(createElement(DevTools), { wrapper: createProviders() });

    fireEvent.press(screen.getByTestId("dev-tools-initial-load-slow"));

    await waitFor(() => {
      expect(screen.getByTestId("dev-tools-initial-load-slow").props.accessibilityState).toEqual({
        checked: true,
      });
    });
    expect(getReviewModeState().initialLoad).toBe("slow");
  });

  it("asks for confirmation before resetting local data", async () => {
    const alert = jest.spyOn(Alert, "alert").mockImplementation(jest.fn());
    await render(createElement(DevTools), { wrapper: createProviders() });

    fireEvent.press(screen.getByTestId("dev-tools-reset-local-data"));

    expect(alert).toHaveBeenCalledWith(
      "Reset local data?",
      expect.any(String),
      expect.arrayContaining([expect.objectContaining({ style: "destructive", text: "Reset" })]),
    );
    alert.mockRestore();
  });
});
