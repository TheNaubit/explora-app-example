import {
  getFavoritesFocusedIndex,
  resetFavoritesView,
  setFavoritesFocusedActivity,
} from "@/state/favorites-view";

describe("Favorites carousel position", () => {
  beforeEach(() => {
    resetFavoritesView();
  });

  it("keeps the focused activity when an earlier favorite is removed", () => {
    setFavoritesFocusedActivity(["a", "b", "c"], 1);

    expect(getFavoritesFocusedIndex(["b", "c"])).toBe(0);
  });

  it("selects the nearest remaining activity when the focused favorite is removed", () => {
    setFavoritesFocusedActivity(["a", "b", "c"], 2);

    expect(getFavoritesFocusedIndex(["a", "b"])).toBe(1);
  });

  it("resets an empty Favorites list to its first position", () => {
    setFavoritesFocusedActivity(["a", "b"], 1);

    expect(getFavoritesFocusedIndex([])).toBe(0);
  });

  it("bounds stored indexes and starts at the first activity", () => {
    expect(getFavoritesFocusedIndex(["a", "b"])).toBe(0);

    setFavoritesFocusedActivity(["a", "b"], 99);
    expect(getFavoritesFocusedIndex(["a", "b"])).toBe(1);

    setFavoritesFocusedActivity(["a", "b"], -1);
    expect(getFavoritesFocusedIndex(["a", "b"])).toBe(0);

    setFavoritesFocusedActivity([], 0);
    expect(getFavoritesFocusedIndex(["a", "b"])).toBe(0);
  });
});
