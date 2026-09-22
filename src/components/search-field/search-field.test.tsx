import { createElement } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { SearchField } from "@/components/search-field";
import { createProviders } from "@/test/ui-test-utils";

describe("SearchField", () => {
  it("debounces onDebouncedChange and clears", async () => {
    const onDebouncedChange = jest.fn();

    await render(createElement(SearchField, { debounceMs: 50, onDebouncedChange }), {
      wrapper: createProviders(),
    });

    fireEvent.changeText(screen.getByTestId("search-field-input"), "Garden");
    expect(onDebouncedChange).not.toHaveBeenCalledWith("Garden");

    await waitFor(() => expect(onDebouncedChange).toHaveBeenCalledWith("Garden"));

    fireEvent.press(screen.getByTestId("search-field-clear"));
    await waitFor(() => expect(onDebouncedChange).toHaveBeenCalledWith(""));
  });
});
