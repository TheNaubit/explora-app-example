import {
  PARTICLE_DISSOLVE_MAX_COLUMNS,
  PARTICLE_DISSOLVE_MAX_PARTICLES_ANDROID,
  PARTICLE_DISSOLVE_MAX_PARTICLES_IOS,
  PARTICLE_DISSOLVE_MIN_COLUMNS,
  PARTICLE_DISSOLVE_TARGET_TILE_SIZE,
} from "@/components/particle-dissolve/constants";

type ParticleGrid = {
  columnCount: number;
  particleCount: number;
  rowCount: number;
};

/** Calculate one dense atlas grid while retaining a lower Android work limit. */
export function getParticleGrid(
  width: number,
  height: number,
  platform: "android" | "ios" | "other",
): ParticleGrid {
  const requestedColumnCount = Math.max(
    PARTICLE_DISSOLVE_MIN_COLUMNS,
    Math.min(PARTICLE_DISSOLVE_MAX_COLUMNS, Math.round(width / PARTICLE_DISSOLVE_TARGET_TILE_SIZE)),
  );
  const requestedRowCount = Math.max(1, Math.ceil(height / PARTICLE_DISSOLVE_TARGET_TILE_SIZE));
  const maxParticleCount =
    platform === "android"
      ? PARTICLE_DISSOLVE_MAX_PARTICLES_ANDROID
      : PARTICLE_DISSOLVE_MAX_PARTICLES_IOS;
  const densityScale = Math.min(
    1,
    Math.sqrt(maxParticleCount / (requestedColumnCount * requestedRowCount)),
  );
  const columnCount = Math.max(
    PARTICLE_DISSOLVE_MIN_COLUMNS,
    Math.floor(requestedColumnCount * densityScale),
  );
  const rowCount = Math.max(
    1,
    Math.min(
      Math.floor(requestedRowCount * densityScale),
      Math.floor(maxParticleCount / columnCount),
    ),
  );

  return { columnCount, particleCount: columnCount * rowCount, rowCount };
}
