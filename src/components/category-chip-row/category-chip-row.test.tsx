import { createElement } from "react";
import { Keyboard } from "react-native";
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
    const dismissKeyboard = jest.spyOn(Keyboard, "dismiss");

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
    expect(dismissKeyboard).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId("category-chip-scroll").props.keyboardDismissMode).toBe("on-drag");
    fireEvent(screen.getByTestId("category-chip-scroll"), "scrollBeginDrag");
    expect(dismissKeyboard).toHaveBeenCalledTimes(3);

    expect(screen.getByTestId("category-chip-row-leading-edge")).toBeOnTheScreen();
    expect(screen.getByTestId("category-chip-row-trailing-edge")).toBeOnTheScreen();
    dismissKeyboard.mockRestore();
  });
});
