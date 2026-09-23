/**
 * @jest-environment node
 */
import {
  emptySearchIllustration,
  getCategoryChipIllustration,
  getCategoryIllustration,
} from "@/illustrations";

describe("illustrations", () => {
  it("returns a source for every category", () => {
    expect(getCategoryIllustration("Outdoors")).toBeTruthy();
    expect(getCategoryIllustration("Culture")).toBeTruthy();
    expect(getCategoryIllustration("Workshops")).toBeTruthy();
    expect(getCategoryIllustration("Leisure")).toBeTruthy();
  });

  it("exports the empty search illustration", () => {
    expect(emptySearchIllustration).toBeTruthy();
  });

  it("returns a compact source for All and every category", () => {
    expect(getCategoryChipIllustration(null)).toBeTruthy();
    expect(getCategoryChipIllustration("Outdoors")).toBeTruthy();
    expect(getCategoryChipIllustration("Culture")).toBeTruthy();
    expect(getCategoryChipIllustration("Workshops")).toBeTruthy();
    expect(getCategoryChipIllustration("Leisure")).toBeTruthy();
  });
});
