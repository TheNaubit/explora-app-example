import dataset from "@/assets/activities.json";

import type { ActivitiesDataset, Activity } from "@/types/activity";

const activitiesDataset = dataset as ActivitiesDataset;

/** Supplied catalog (12 activities). Source of truth for the assessment dataset. */
export const SUPPLIED_ACTIVITIES: Activity[] = activitiesDataset.activities;

export const ACTIVITIES_SCHEMA_VERSION = activitiesDataset.schemaVersion;

export function getSuppliedActivityById(id: string): Activity | undefined {
  return SUPPLIED_ACTIVITIES.find((activity) => activity.id === id);
}
