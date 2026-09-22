import {
  getDiscoveryFilters,
  resetDiscoveryFilters,
  setDiscoveryCategory,
  setDiscoverySearch,
} from "@/state/discovery";

describe("discovery store", () => {
  beforeEach(() => {
    resetDiscoveryFilters();
  });

  it("stores search and category for the list query key", () => {
    setDiscoverySearch("museum");
    setDiscoveryCategory("Culture");

    expect(getDiscoveryFilters()).toEqual({
      searchQuery: "museum",
      category: "Culture",
    });

    resetDiscoveryFilters();
    expect(getDiscoveryFilters()).toEqual({
      searchQuery: "",
      category: null,
    });
  });
});
