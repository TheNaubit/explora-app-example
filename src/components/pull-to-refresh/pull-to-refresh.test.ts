import {
  getPullHapticValues,
  getPullIndicatorState,
  getPullProgress,
  getPullStrokeState,
} from "@/components/pull-to-refresh/pull-to-refresh";

describe("pull-to-refresh progress", () => {
  it("maps overscroll to a clamped completion value", () => {
    expect(getPullProgress(12)).toBe(0);
    expect(getPullProgress(0)).toBe(0);
    expect(getPullProgress(-36)).toBe(0.5);
    expect(getPullProgress(-72)).toBe(1);
    expect(getPullProgress(-120)).toBe(1);
  });

  it("maps forward and reverse pull progress to the same bounded haptic curve", () => {
    expect(getPullHapticValues(0)).toBeNull();

    const halfPull = getPullHapticValues(0.5);
    const completePull = getPullHapticValues(1);

    expect(halfPull).not.toBeNull();
    expect(completePull).not.toBeNull();
    expect(halfPull!.amplitude).toBeGreaterThan(0);
    expect(completePull!.amplitude).toBeGreaterThan(halfPull!.amplitude);
    expect(completePull!.frequency).toBeGreaterThan(halfPull!.frequency);
    expect(completePull!.amplitude).toBeLessThanOrEqual(1);
    expect(completePull!.frequency).toBeLessThanOrEqual(1);
  });

  it("reveals the hollow outline continuously without a completion jump", () => {
    expect(getPullStrokeState(0, 1_000)).toEqual({
      strokeDashOffset: 1_000,
    });
    expect(getPullStrokeState(0.5, 1_000)).toEqual({
      strokeDashOffset: 500,
    });
    expect(getPullStrokeState(0.99, 1_000).strokeDashOffset).toBeCloseTo(10);
    expect(getPullStrokeState(1, 1_000)).toEqual({
      strokeDashOffset: 0,
    });
  });

  it("keeps partial pulls smaller and translucent", () => {
    expect(getPullIndicatorState(0)).toEqual({ opacity: 0, scale: 0.88 });
    expect(getPullIndicatorState(0.5)).toEqual({ opacity: 0.5, scale: 0.94 });
    expect(getPullIndicatorState(1)).toEqual({ opacity: 1, scale: 1 });
  });
});
