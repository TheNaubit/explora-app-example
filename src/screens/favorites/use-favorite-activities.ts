import { useValue } from "@legendapp/state/react";

import type { Activity } from "@/schemas/activity";
import { favorites$ } from "@/state/favorites";

/**
 * Ordered favorite activities from persisted snapshots.
 * Skips ids that no longer have a snapshot.
 */
export function useFavoriteActivities(): Activity[] {
  const ids = useValue(favorites$.ids);
  const snapshots = useValue(favorites$.snapshots);

  return ids.flatMap((id) => {
    const activity = snapshots[id];
    return activity ? [activity] : [];
  });
}
