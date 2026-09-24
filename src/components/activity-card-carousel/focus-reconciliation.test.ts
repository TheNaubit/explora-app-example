import {
  getReconciledFocusIndex,
  getReconciledScrollParams,
} from "@/components/activity-card-carousel/focus-reconciliation";

describe("carousel focus reconciliation", () => {
  it("selects the next card when the focused card is removed", () => {
    expect(getReconciledFocusIndex(["a", "b", "c"], ["b", "c"], 0)).toBe(0);
    expect(getReconciledFocusIndex(["a", "b", "c"], ["a", "c"], 1)).toBe(1);
  });

  it("selects the previous card when the focused last card is removed", () => {
    expect(getReconciledFocusIndex(["a", "b", "c"], ["a", "b"], 2)).toBe(1);
  });

  it("keeps the same activity selected when an earlier card is removed", () => {
    expect(getReconciledFocusIndex(["a", "b", "c"], ["b", "c"], 2)).toBe(1);
  });

  it("uses an animated scroll for the replacement card", () => {
    expect(getReconciledScrollParams(640)).toEqual({ animated: true, offset: 640 });
  });
});
