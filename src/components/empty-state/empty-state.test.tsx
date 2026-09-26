import { createElement } from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { EmptyState } from "@/components/empty-state";
import { createProviders } from "@/test/ui-test-utils";

describe("EmptyState", () => {
  it("renders copy and runs the action", async () => {
    const onAction = jest.fn();
    await render(
      createElement(EmptyState, {
        title: "No matches",
        body: "Try again",
        actionLabel: "Clear filters",
        onAction,
      }),
      { wrapper: createProviders() },
    );

    expect(screen.getByText("No matches")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("empty-state-action"));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("centers the body in the centered presentation", async () => {
    await render(
      createElement(EmptyState, {
        title: "No saved activities",
        body: "Save an activity from Explore to find it here later.",
        actionLabel: "Browse activities",
        onAction: jest.fn(),
        presentation: "centered",
      }),
      { wrapper: createProviders() },
    );

    const bodyStyle = StyleSheet.flatten(
      screen.getByText("Save an activity from Explore to find it here later.").props.style,
    );
    expect(bodyStyle.textAlign).toBe("center");
  });
});
