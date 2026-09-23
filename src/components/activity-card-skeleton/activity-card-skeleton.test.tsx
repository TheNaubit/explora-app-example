import { createElement } from "react";
import { cleanup, render } from "@testing-library/react-native";
import { useReducedMotion } from "react-native-reanimated";

import { ActivityCardSkeleton } from "@/components/activity-card-skeleton";
import { createProviders } from "@/test/ui-test-utils";

const mockUseReducedMotion = useReducedMotion as jest.MockedFunction<typeof useReducedMotion>;

afterEach(async () => {
  await cleanup();
  mockUseReducedMotion.mockReturnValue(false);
});

describe("ActivityCardSkeleton", () => {
  it("renders a skeleton card", async () => {
    const view = await render(
      createElement(ActivityCardSkeleton, { mediaHeight: 320, testID: "skeleton" }),
      { wrapper: createProviders() },
    );
    expect(view.getByTestId("skeleton", { includeHiddenElements: true })).toBeTruthy();
    expect(view.getByTestId("skeleton-cover", { includeHiddenElements: true })).toBeTruthy();
    expect(view.getByTestId("skeleton-favorite", { includeHiddenElements: true })).toBeTruthy();
    expect(view.getByTestId("skeleton-copy", { includeHiddenElements: true })).toBeTruthy();
  });

  it("skips the pulse when reduced motion is preferred", async () => {
    mockUseReducedMotion.mockReturnValue(true);

    const view = await render(createElement(ActivityCardSkeleton, { testID: "skeleton-reduced" }), {
      wrapper: createProviders(),
    });
    expect(view.getByTestId("skeleton-reduced", { includeHiddenElements: true })).toBeTruthy();
  });
});
