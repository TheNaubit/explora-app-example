import {
  hapticFavoriteRemoved,
  hapticFavoriteSaved,
  hapticNavigationSelection,
} from "@/haptics/feedback";

jest.mock("react-native-pulsar", () => require("react-native-pulsar/jest-mock"));

describe("haptic feedback helpers", () => {
  it("exposes save and remove helpers", () => {
    expect(() => hapticFavoriteSaved()).not.toThrow();
    expect(() => hapticFavoriteRemoved()).not.toThrow();
  });

  it("uses a system selection for an explicit tab action", () => {
    const { Presets } = require("react-native-pulsar");

    hapticNavigationSelection();

    expect(Presets.System.selection).toHaveBeenCalledTimes(1);
  });
});
