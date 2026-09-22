/**
 * @jest-environment node
 */
import { getCategoryIllustration, emptySearchIllustration } from "@/illustrations";

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
});
