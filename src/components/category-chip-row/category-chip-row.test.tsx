import { createElement } from "react";
import { Keyboard } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { CategoryChipRow } from "@/components/category-chip-row";
import { createProviders } from "@/test/ui-test-utils";

describe("CategoryChipRow", () => {
  it("reports category toggles and keeps All exclusive", async () => {
    const onToggle = jest.fn();
    const dismissKeyboard = jest.spyOn(Keyboard, "dismiss");

    await render(
      createElement(CategoryChipRow, {
        selectedCategories: ["Outdoors", "Culture"],
        onToggle,
      }),
      { wrapper: createProviders() },
    );

    fireEvent.press(screen.getByTestId("category-chip-outdoors"));
    expect(onToggle).toHaveBeenCalledWith("Outdoors");
    expect(screen.getByTestId("category-chip-outdoors")).toHaveProp("accessibilityState", {
      selected: true,
    });
    expect(screen.getByTestId("category-chip-culture")).toHaveProp("accessibilityState", {
      selected: true,
    });
    expect(screen.getByTestId("category-chip-all")).toHaveProp("accessibilityState", {
      selected: false,
    });

    fireEvent.press(screen.getByTestId("category-chip-all"));
    expect(onToggle).toHaveBeenCalledWith(null);
    expect(dismissKeyboard).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId("category-chip-scroll").props.keyboardDismissMode).toBe("on-drag");
    fireEvent(screen.getByTestId("category-chip-scroll"), "scrollBeginDrag");
    expect(dismissKeyboard).toHaveBeenCalledTimes(3);

    expect(screen.getByTestId("category-chip-row-leading-edge")).toBeOnTheScreen();
    expect(screen.getByTestId("category-chip-row-trailing-edge")).toBeOnTheScreen();
    dismissKeyboard.mockRestore();
  });
});
