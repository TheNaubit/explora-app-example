import dataset from "@/assets/activities.json";

import { activitiesDatasetSchema, type Activity } from "@/schemas/activity";
import { parseWithSchema } from "@/utils/parse-with-schema";

const activitiesDataset = parseWithSchema(activitiesDatasetSchema, dataset);

/**
 * Supplied catalog from `assets/activities.json` (12 activities).
 * Keep these IDs and titles. Add performance-scale and refresh items elsewhere.
 */
export const SUPPLIED_ACTIVITIES: Activity[] = activitiesDataset.activities;

/** `schemaVersion` from the supplied dataset file. */
export const ACTIVITIES_SCHEMA_VERSION = activitiesDataset.schemaVersion;

/** Find an activity in the supplied catalog only. Do not search generated or refresh items here. */
export function getSuppliedActivityById(id: string): Activity | undefined {
  return SUPPLIED_ACTIVITIES.find((activity) => activity.id === id);
}
