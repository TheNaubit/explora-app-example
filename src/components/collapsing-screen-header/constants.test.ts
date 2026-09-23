import {
  COLLAPSING_HEADER_COMPACT_HEIGHT,
  getCollapsingHeaderTranslation,
} from "@/components/collapsing-screen-header/constants";

describe("collapsing header layout", () => {
  it("keeps collapsed content below the compact title", () => {
    expect(getCollapsingHeaderTranslation(76)).toBe(76 - COLLAPSING_HEADER_COMPACT_HEIGHT);
  });
});
