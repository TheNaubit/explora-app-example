import { createElement } from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { ExploreStatusBanner } from "@/screens/explore/explore-status-banner";
import { createProviders } from "@/test/ui-test-utils";

describe("ExploreStatusBanner", () => {
  it("retries next page after dismiss", async () => {
    const onDismiss = jest.fn();
    const onRetryNextPage = jest.fn();

    await render(
      createElement(ExploreStatusBanner, {
        banner: { kind: "nextPage", errorKey: "errors.unknown" },
        onDismiss,
        onRetryNextPage,
      }),
      { wrapper: createProviders() },
    );

    expect(screen.getByTestId("explore-next-page-error")).toBeTruthy();
    fireEvent.press(screen.getByTestId("explore-next-page-retry"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onRetryNextPage).toHaveBeenCalledTimes(1);
  });
});
