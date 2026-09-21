import dataset from "@/assets/activities.json";

import { activitiesDatasetSchema, type Activity } from "@/schemas/activity";
import { parseWithSchema } from "@/utils/parse-with-schema";

const activitiesDataset = parseWithSchema(activitiesDatasetSchema, dataset);

/**
 * Supplied catalog from `assets/activities.json` (12 activities).
 * Keep these IDs/titles intact; performance scale and refresh add *additional* items elsewhere.
 */
export const SUPPLIED_ACTIVITIES: Activity[] = activitiesDataset.activities;

/** `schemaVersion` from the supplied dataset fixture. */
export const ACTIVITIES_SCHEMA_VERSION = activitiesDataset.schemaVersion;

/** Lookup within the supplied catalog only (not generated/refresh items). */
export function getSuppliedActivityById(id: string): Activity | undefined {
  return SUPPLIED_ACTIVITIES.find((activity) => activity.id === id);
}
