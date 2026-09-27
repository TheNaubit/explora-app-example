import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import {
  clearCatalogForTests,
  getCatalogMode,
  getCatalog,
  getCatalogSize,
  prependRefreshActivity,
  resetCatalog,
  setCatalogMode,
} from "@/mocks/catalog-store";
import {
  PERFORMANCE_CATALOG_SIZE,
  PERFORMANCE_GENERATED_ACTIVITY_COUNT,
  SUPPLIED_CATALOG_SIZE,
} from "@/mocks/constants";
import { seedCatalog, seedCatalogFrom, seedPerformanceCatalog } from "@/mocks/seed-catalog";

describe("seed catalog", () => {
  it("uses only the supplied activities for the default catalog", () => {
    const catalog = seedCatalog();

    expect(catalog).toHaveLength(SUPPLIED_CATALOG_SIZE);
    expect(catalog).toEqual(SUPPLIED_ACTIVITIES);
  });

  it("adds 1,000 generated activities for the performance catalog", () => {
    const catalog = seedPerformanceCatalog();

    expect(catalog).toHaveLength(PERFORMANCE_CATALOG_SIZE);
    expect(catalog.slice(0, SUPPLIED_ACTIVITIES.length)).toEqual(SUPPLIED_ACTIVITIES);
    expect(catalog.length - SUPPLIED_ACTIVITIES.length).toBe(PERFORMANCE_GENERATED_ACTIVITY_COUNT);
  });

  it("throws when the base list is larger than the target size", () => {
    expect(() => seedCatalogFrom(SUPPLIED_ACTIVITIES, 1)).toThrow(/expected at most 1/);
  });
});

describe("catalog store cold start", () => {
  afterEach(() => {
    resetCatalog();
  });

  it("seeds on first read after a clear", () => {
    clearCatalogForTests();

    expect(getCatalogMode()).toBe("supplied");
    expect(getCatalogSize()).toBe(SUPPLIED_CATALOG_SIZE);
    expect(getCatalog()).toEqual(SUPPLIED_ACTIVITIES);
  });

  it("persists the selected performance catalog across a cold start", () => {
    setCatalogMode("performance");

    expect(getCatalogMode()).toBe("performance");
    expect(getCatalogSize()).toBe(PERFORMANCE_CATALOG_SIZE);

    clearCatalogForTests();

    expect(getCatalogMode()).toBe("performance");
    expect(getCatalogSize()).toBe(PERFORMANCE_CATALOG_SIZE);
  });

  it("keeps refresh activities when the catalog mode changes", () => {
    const refreshed = prependRefreshActivity();

    setCatalogMode("performance");
    expect(getCatalogSize()).toBe(PERFORMANCE_CATALOG_SIZE + 1);
    expect(getCatalog()[0]).toEqual(refreshed);

    setCatalogMode("supplied");
    expect(getCatalogSize()).toBe(SUPPLIED_CATALOG_SIZE + 1);
    expect(getCatalog()[0]).toEqual(refreshed);
  });

  it("restores refresh-added activities and their sequence after a cold start", () => {
    const firstRefresh = prependRefreshActivity();

    clearCatalogForTests();

    expect(getCatalogSize()).toBe(SUPPLIED_CATALOG_SIZE + 1);
    expect(getCatalog()[0]).toEqual(firstRefresh);
    expect(prependRefreshActivity().id).toBe("ref-0002");
  });
});
