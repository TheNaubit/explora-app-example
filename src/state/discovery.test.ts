import {
  getDiscoveryScrollOffset,
  getDiscoveryFilters,
  resetDiscoveryFilters,
  setDiscoveryScrollOffset,
  setDiscoverySearch,
  toggleDiscoveryCategory,
} from "@/state/discovery";

describe("discovery store", () => {
  beforeEach(() => {
    resetDiscoveryFilters();
  });

  it("stores search and multiple categories for the list query key", () => {
    setDiscoverySearch("museum");
    toggleDiscoveryCategory("Culture");
    toggleDiscoveryCategory("Outdoors");

    expect(getDiscoveryFilters()).toEqual({
      searchQuery: "museum",
      categories: ["Culture", "Outdoors"],
    });

    resetDiscoveryFilters();
    expect(getDiscoveryFilters()).toEqual({
      searchQuery: "",
      categories: [],
    });
  });

  it("returns to All when the final selected category is removed", () => {
    toggleDiscoveryCategory("Culture");
    toggleDiscoveryCategory("Culture");

    expect(getDiscoveryFilters().categories).toEqual([]);
  });

  it("clears selected categories when All is selected", () => {
    toggleDiscoveryCategory("Culture");
    toggleDiscoveryCategory("Outdoors");
    toggleDiscoveryCategory(null);

    expect(getDiscoveryFilters().categories).toEqual([]);
  });

  it("shares a non-negative catalog scroll offset between discovery routes", () => {
    setDiscoveryScrollOffset(248);

    expect(getDiscoveryScrollOffset()).toBe(248);

    setDiscoveryScrollOffset(-24);
    expect(getDiscoveryScrollOffset()).toBe(0);
  });
});
