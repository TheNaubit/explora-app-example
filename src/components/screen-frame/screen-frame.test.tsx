import { createElement } from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";

import { ScreenFrame } from "@/components/screen-frame";
import { createProviders } from "@/test/ui-test-utils";

const mockUseFocusEffect = jest.fn();

jest.mock("expo-router", () => ({
  useFocusEffect: (effect: () => void) => mockUseFocusEffect(effect),
}));

describe("ScreenFrame", () => {
  beforeEach(() => {
    mockUseFocusEffect.mockReset();
  });

  it("announces its title again when a kept-alive screen regains focus", async () => {
    const { announce } = require("react-native-a11y");
    announce.mockClear();

    await render(
      createElement(ScreenFrame, {
        title: "Explore",
        children: createElement(Text, null, "Content"),
      }),
      { wrapper: createProviders() },
    );

    expect(mockUseFocusEffect).toHaveBeenCalledTimes(1);
    const onFocus = mockUseFocusEffect.mock.calls[0][0];

    onFocus();
    expect(announce).not.toHaveBeenCalled();

    onFocus();
    expect(announce).toHaveBeenCalledWith("Explore");
  });
});
