import { createElement } from "react";
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
    fireEvent.press(screen.getByTestId("empty-state-action"));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
