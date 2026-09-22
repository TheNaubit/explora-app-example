import { createElement } from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { InlineStatusBanner } from "@/components/inline-status-banner";
import { createProviders } from "@/test/ui-test-utils";

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
    fireEvent.press(screen.getByTestId("inline-status-retry"));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
