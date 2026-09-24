import {
  PARTICLE_DISSOLVE_MAX_LIFETIME,
  PARTICLE_DISSOLVE_MIN_LIFETIME,
  PARTICLE_DISSOLVE_RANDOM_STAGGER,
  PARTICLE_DISSOLVE_WAVE_SPAN,
  PARTICLE_RANDOM_FRACTION_FACTOR,
  PARTICLE_RANDOM_INDEX_FACTOR,
  PARTICLE_RANDOM_SALT_FACTOR,
} from "@/components/particle-dissolve/constants";

/** Clamp an animation value to its normalized range. */
export function clampParticleProgress(value: number): number {
  "worklet";
  return Math.max(0, Math.min(1, value));
}

/** Return one stable pseudo-random fraction for a particle and salt. */
export function particleRandom(index: number, salt: number): number {
  "worklet";
  const value =
    Math.sin((index + 1) * PARTICLE_RANDOM_INDEX_FACTOR + salt * PARTICLE_RANDOM_SALT_FACTOR) *
    PARTICLE_RANDOM_FRACTION_FACTOR;
  return value - Math.floor(value);
}

/** Return the local dissolve progress for one particle in the left-to-right wave. */
export function getParticleProgress(
  progress: number,
  index: number,
  column: number,
  columnCount: number,
): number {
  "worklet";
  const columnFraction = columnCount <= 1 ? 0 : column / (columnCount - 1);
  const start =
    columnFraction * PARTICLE_DISSOLVE_WAVE_SPAN +
    particleRandom(index, 1) * PARTICLE_DISSOLVE_RANDOM_STAGGER;
  const lifetime =
    PARTICLE_DISSOLVE_MIN_LIFETIME +
    particleRandom(index, 4) * (PARTICLE_DISSOLVE_MAX_LIFETIME - PARTICLE_DISSOLVE_MIN_LIFETIME);
  const end = Math.min(1, start + lifetime);

  return clampParticleProgress((progress - start) / Math.max(0.001, end - start));
}
