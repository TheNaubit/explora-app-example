import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import { CATALOG_FAKER_BASE_SEED, SEEDED_CATALOG_SIZE } from "@/mocks/constants";
import { generateActivity, generatedActivityId } from "@/mocks/generate-activity";
import type { Activity } from "@/schemas/activity";

export { CATALOG_FAKER_BASE_SEED, SEEDED_CATALOG_SIZE } from "@/mocks/constants";

/**
 * Build a catalog from a base list, filling up to `targetSize` with generated items.
 */
export function seedCatalogFrom(
  baseActivities: readonly Activity[],
  targetSize: number = SEEDED_CATALOG_SIZE,
): Activity[] {
  const generatedCount = targetSize - baseActivities.length;

  if (generatedCount < 0) {
    throw new Error(
      `Supplied catalog has ${baseActivities.length} items; expected at most ${targetSize}.`,
    );
  }

  const generated: Activity[] = [];

  for (let index = 1; index <= generatedCount; index += 1) {
    generated.push(
      generateActivity({
        id: generatedActivityId(index),
        seed: CATALOG_FAKER_BASE_SEED + index,
      }),
    );
  }

  return [...baseActivities, ...generated];
}

/**
 * Build the local discovery catalog.
 * Keeps the supplied 12 activities unchanged, then fills to `SEEDED_CATALOG_SIZE`.
 */
export function seedCatalog(): Activity[] {
  return seedCatalogFrom(SUPPLIED_ACTIVITIES, SEEDED_CATALOG_SIZE);
}
