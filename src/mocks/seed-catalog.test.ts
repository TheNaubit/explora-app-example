import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import {
  clearCatalogForTests,
  getCatalog,
  getCatalogSize,
  resetCatalog,
} from "@/mocks/catalog-store";
import { SEEDED_CATALOG_SIZE } from "@/mocks/constants";
import { seedCatalog, seedCatalogFrom } from "@/mocks/seed-catalog";

describe("seed catalog", () => {
  it("builds the default seeded catalog size", () => {
    const catalog = seedCatalog();

    expect(catalog).toHaveLength(SEEDED_CATALOG_SIZE);
    expect(catalog.slice(0, SUPPLIED_ACTIVITIES.length)).toEqual(SUPPLIED_ACTIVITIES);
  });

  it("defaults target size when seedCatalogFrom omits it", () => {
    const catalog = seedCatalogFrom(SUPPLIED_ACTIVITIES);

    expect(catalog).toHaveLength(SEEDED_CATALOG_SIZE);
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

    expect(getCatalogSize()).toBe(SEEDED_CATALOG_SIZE);
    expect(getCatalog()).toHaveLength(SEEDED_CATALOG_SIZE);
  });
});
