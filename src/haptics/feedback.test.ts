import { hapticFavoriteRemoved, hapticFavoriteSaved } from "@/haptics/feedback";

jest.mock("react-native-pulsar", () => require("react-native-pulsar/jest-mock"));

describe("haptic feedback helpers", () => {
  it("exposes save and remove helpers", () => {
    expect(() => hapticFavoriteSaved()).not.toThrow();
    expect(() => hapticFavoriteRemoved()).not.toThrow();
  });
});
