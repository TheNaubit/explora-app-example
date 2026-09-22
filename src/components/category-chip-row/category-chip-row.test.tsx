import { createElement } from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { CategoryChipRow } from "@/components/category-chip-row";
import { resetDiscoveryFilters, setDiscoveryCategory } from "@/state/discovery";
import { createProviders } from "@/test/ui-test-utils";

describe("CategoryChipRow", () => {
  beforeEach(() => {
    resetDiscoveryFilters();
  });

  it("selects a category and All", async () => {
    const onSelect = jest.fn((category) => setDiscoveryCategory(category));

    await render(
      createElement(CategoryChipRow, {
        selected: null,
        onSelect,
      }),
      { wrapper: createProviders() },
    );

    fireEvent.press(screen.getByTestId("category-chip-outdoors"));
    expect(onSelect).toHaveBeenCalledWith("Outdoors");

    fireEvent.press(screen.getByTestId("category-chip-all"));
    expect(onSelect).toHaveBeenCalledWith(null);
  });
});
