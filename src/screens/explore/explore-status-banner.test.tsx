import { createElement } from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { ExploreStatusBanner } from "@/screens/explore/explore-status-banner";
import { createProviders } from "@/test/ui-test-utils";

describe("ExploreStatusBanner", () => {
  it("retries refresh after dismiss", async () => {
    const onDismiss = jest.fn();
    const onRetryRefresh = jest.fn();
    const onRetryNextPage = jest.fn();

    await render(
      createElement(ExploreStatusBanner, {
        banner: { kind: "refresh", errorKey: "errors.refreshFailed" },
        onDismiss,
        onRetryRefresh,
        onRetryNextPage,
      }),
      { wrapper: createProviders() },
    );

    fireEvent.press(screen.getByTestId("inline-status-retry"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onRetryRefresh).toHaveBeenCalledTimes(1);
    expect(onRetryNextPage).not.toHaveBeenCalled();
  });

  it("retries next page after dismiss", async () => {
    const onDismiss = jest.fn();
    const onRetryRefresh = jest.fn();
    const onRetryNextPage = jest.fn();

    await render(
      createElement(ExploreStatusBanner, {
        banner: { kind: "nextPage", errorKey: "errors.unknown" },
        onDismiss,
        onRetryRefresh,
        onRetryNextPage,
      }),
      { wrapper: createProviders() },
    );

    fireEvent.press(screen.getByTestId("inline-status-retry"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onRetryNextPage).toHaveBeenCalledTimes(1);
    expect(onRetryRefresh).not.toHaveBeenCalled();
  });
});
