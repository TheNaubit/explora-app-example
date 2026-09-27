import { createElement } from "react";
import { Keyboard } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { CategoryChipRow } from "@/components/category-chip-row";
import { createProviders } from "@/test/ui-test-utils";

describe("CategoryChipRow", () => {
  it("reports category toggles and keeps All exclusive", async () => {
    const { Presets } = require("react-native-pulsar");
    const onToggle = jest.fn();
    const dismissKeyboard = jest.spyOn(Keyboard, "dismiss");

    await render(
      createElement(CategoryChipRow, {
        selectedCategories: ["Outdoors", "Culture"],
        onToggle,
      }),
      { wrapper: createProviders() },
    );

    await fireEvent.press(screen.getByTestId("category-chip-outdoors"));
    expect(onToggle).toHaveBeenCalledWith("Outdoors");
    expect(Presets.System.selection).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("category-chip-outdoors")).toHaveProp("accessibilityState", {
      selected: true,
    });
    expect(screen.getByTestId("category-chip-culture")).toHaveProp("accessibilityState", {
      selected: true,
    });
    expect(screen.getByTestId("category-chip-all")).toHaveProp("accessibilityState", {
      selected: false,
    });

    await fireEvent.press(screen.getByTestId("category-chip-all"));
    expect(onToggle).toHaveBeenCalledWith(null);
    expect(Presets.System.selection).toHaveBeenCalledTimes(2);
    expect(dismissKeyboard).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId("category-chip-scroll").props.keyboardDismissMode).toBe("on-drag");
    await fireEvent(screen.getByTestId("category-chip-scroll"), "scrollBeginDrag");
    expect(dismissKeyboard).toHaveBeenCalledTimes(3);

    expect(screen.getByTestId("category-chip-row-leading-edge")).toBeOnTheScreen();
    expect(screen.getByTestId("category-chip-row-trailing-edge")).toBeOnTheScreen();
    dismissKeyboard.mockRestore();
  });

  it("keeps the haptic silent when All is already selected", async () => {
    const { Presets } = require("react-native-pulsar");
    const onToggle = jest.fn();

    await render(
      createElement(CategoryChipRow, {
        selectedCategories: [],
        onToggle,
      }),
      { wrapper: createProviders() },
    );

    await fireEvent.press(screen.getByTestId("category-chip-all"));

    expect(onToggle).toHaveBeenCalledWith(null);
    expect(Presets.System.selection).not.toHaveBeenCalled();
  });
});
