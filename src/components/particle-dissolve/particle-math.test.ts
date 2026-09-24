import { getParticleProgress, particleRandom } from "@/components/particle-dissolve/particle-math";

describe("particle dissolve math", () => {
  it("keeps deterministic random values inside the normalized range", () => {
    const first = particleRandom(12, 3);

    expect(first).toBeGreaterThanOrEqual(0);
    expect(first).toBeLessThan(1);
    expect(particleRandom(12, 3)).toBe(first);
  });

  it("starts on the left and finishes every particle", () => {
    expect(getParticleProgress(0.3, 4, 0, 10)).toBeGreaterThan(0);
    expect(getParticleProgress(0.3, 4, 9, 10)).toBe(0);
    expect(getParticleProgress(1, 4, 9, 10)).toBe(1);
  });
});
