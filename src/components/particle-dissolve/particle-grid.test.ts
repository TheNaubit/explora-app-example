import { getParticleGrid } from "@/components/particle-dissolve/particle-grid";
import {
  PARTICLE_DISSOLVE_MAX_PARTICLES_ANDROID,
  PARTICLE_DISSOLVE_MAX_PARTICLES_IOS,
} from "@/components/particle-dissolve/constants";

describe("particle dissolve grid", () => {
  it("uses a dense iOS grid for a full activity card", () => {
    const grid = getParticleGrid(354, 480, "ios");

    expect(grid.particleCount).toBeGreaterThanOrEqual(8_000);
    expect(grid.particleCount).toBeLessThanOrEqual(PARTICLE_DISSOLVE_MAX_PARTICLES_IOS);
  });

  it("keeps the Android-compatible grid within its lower cap", () => {
    const grid = getParticleGrid(354, 480, "android");

    expect(grid.particleCount).toBeLessThanOrEqual(PARTICLE_DISSOLVE_MAX_PARTICLES_ANDROID);
  });
});
