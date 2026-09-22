import { REFRESH_FAKER_BASE_SEED } from "@/mocks/constants";
import { generateActivity, refreshActivityId } from "@/mocks/generate-activity";
import { seedCatalog } from "@/mocks/seed-catalog";
import type { Activity } from "@/schemas/activity";

let catalog: Activity[] | null = null;
let refreshSequence = 0;

function ensureCatalog(): Activity[] {
  if (catalog === null) {
    catalog = seedCatalog();
  }

  return catalog;
}

/** Current in-memory catalog (seeds on first read). */
export function getCatalog(): readonly Activity[] {
  return ensureCatalog();
}

/** Current catalog length. */
export function getCatalogSize(): number {
  return ensureCatalog().length;
}

/** Find one activity by id, or undefined when missing. */
export function findActivityById(id: string): Activity | undefined {
  return ensureCatalog().find((activity) => activity.id === id);
}

/**
 * Append one refresh-generated activity.
 * Returns the new activity. Callers must only invoke this on a successful refresh path.
 */
export function appendRefreshActivity(): Activity {
  refreshSequence += 1;
  const activity = generateActivity({
    id: refreshActivityId(refreshSequence),
    seed: REFRESH_FAKER_BASE_SEED + refreshSequence,
  });

  ensureCatalog().push(activity);
  return activity;
}

/**
 * Reset the catalog to the seeded baseline and clear refresh sequence.
 * Does not change review modes.
 */
export function resetCatalog(): void {
  catalog = seedCatalog();
  refreshSequence = 0;
}

/**
 * Test-only: replace the in-memory catalog without reseeding.
 * Use this to exercise validation and not-found paths.
 */
export function replaceCatalogForTests(next: Activity[], nextRefreshSequence = 0): void {
  catalog = [...next];
  refreshSequence = nextRefreshSequence;
}

/**
 * Test-only: clear the catalog so the next read reseeds from `seedCatalog`.
 */
export function clearCatalogForTests(): void {
  catalog = null;
  refreshSequence = 0;
}
