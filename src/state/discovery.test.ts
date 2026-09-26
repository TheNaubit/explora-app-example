import {
  getDiscoveryScrollOffset,
  getDiscoveryFilters,
  resetDiscoveryFilters,
  resetDiscoveryScrollOffsets,
  setDiscoveryScrollOffset,
  setDiscoverySearch,
  toggleDiscoveryCategory,
} from "@/state/discovery";

describe("discovery store", () => {
  beforeEach(() => {
    resetDiscoveryFilters();
    resetDiscoveryScrollOffsets();
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

  it("stores a non-negative scroll offset for each filter state", () => {
    const browseFilters = { search: "", categories: [] } as const;
    const searchFilters = { search: "museum", categories: ["Culture"] } as const;

    setDiscoveryScrollOffset(browseFilters, 248);
    setDiscoveryScrollOffset(searchFilters, 412);

    expect(getDiscoveryScrollOffset(browseFilters)).toBe(248);
    expect(getDiscoveryScrollOffset(searchFilters)).toBe(412);

    setDiscoveryScrollOffset(searchFilters, -24);
    expect(getDiscoveryScrollOffset(searchFilters)).toBe(0);
    expect(getDiscoveryScrollOffset(browseFilters)).toBe(248);
  });
});
