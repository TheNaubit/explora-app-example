import type { Activity } from "@/schemas/activity";
import type { ActivitiesInfiniteData } from "@/query/activity-queries";

/** Flatten infinite query pages into one activity list. */
export function flattenActivityPages(data: ActivitiesInfiniteData | undefined): Activity[] {
  if (!data) {
    return [];
  }

  return data.pages.flatMap((page) => page.activities);
}
