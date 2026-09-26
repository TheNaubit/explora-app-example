import { createElement } from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { InlineStatusBanner } from "@/components/inline-status-banner";
import { createProviders } from "@/test/ui-test-utils";
import { lightTheme, radii, typography } from "@/theme";

describe("InlineStatusBanner", () => {
  it("renders copy and runs retry", async () => {
    const onAction = jest.fn();
    await render(
      createElement(InlineStatusBanner, {
        title: "Refresh failed",
        body: "No activity added",
        actionLabel: "Retry",
        onAction,
      }),
      { wrapper: createProviders() },
    );

    expect(screen.getByText("Refresh failed")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("inline-status-retry"));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("uses a compact tonal recovery treatment", async () => {
    await render(
      createElement(InlineStatusBanner, {
        title: "Refresh failed",
        body: "No activity added",
        actionLabel: "Retry",
        onAction: jest.fn(),
      }),
      { wrapper: createProviders() },
    );

    expect(
      StyleSheet.flatten(screen.getByTestId("inline-status-banner").props.style),
    ).toMatchObject({
      backgroundColor: lightTheme.colors.dangerSurface,
      borderRadius: radii.medium,
      boxShadow: lightTheme.elevation.none,
    });
    expect(StyleSheet.flatten(screen.getByText("Refresh failed").props.style).fontSize).toBe(
      typography.bodyStrong.fontSize,
    );
  });
});
