import { createElement } from "react";
import { StyleSheet } from "react-native";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { MIN_TOUCH_TARGET } from "@/components/constants";
import { SearchField } from "@/components/search-field";
import { createProviders } from "@/test/ui-test-utils";

describe("SearchField", () => {
  it("debounces onDebouncedChange and clears", async () => {
    const onDebouncedChange = jest.fn();

    await render(createElement(SearchField, { debounceMs: 50, onDebouncedChange }), {
      wrapper: createProviders(),
    });

    await fireEvent.changeText(screen.getByTestId("search-field-input"), "Garden");
    expect(onDebouncedChange).not.toHaveBeenCalledWith("Garden");

    await waitFor(() => expect(onDebouncedChange).toHaveBeenCalledWith("Garden"));

    await fireEvent.press(screen.getByTestId("search-field-clear"));
    await waitFor(() => expect(onDebouncedChange).toHaveBeenCalledWith(""));

    const input = screen.getByTestId("search-field-input");
    const inputStyle = StyleSheet.flatten(input.props.style);
    const inputContainerStyle = StyleSheet.flatten(input.props.containerStyle);

    expect(input.props.multiline).toBe(false);
    expect(input.props.submitBehavior).toBe("blurAndSubmit");
    expect(inputContainerStyle.flex).toBe(1);
    expect(inputContainerStyle.minWidth).toBe(0);
    expect(inputStyle.height).toBeUndefined();
    expect(inputStyle.minHeight).toBe(MIN_TOUCH_TARGET);
    expect(inputStyle.paddingVertical).toBe(0);
    expect(inputStyle.textAlignVertical).toBe("center");
    expect(inputStyle.width).toBe("100%");
  });
});
