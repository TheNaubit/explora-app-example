import { useQuery } from "@tanstack/react-query";

import { fetchActivityDetail } from "@/query/activity-queries";
import { activityKeys } from "@/query/keys";
import { getOfflineSnapshot } from "@/state/favorites";

/**
 * Load one activity by id from the mock catalog.
 * Seeds from the favorites offline snapshot when present so detail stays usable offline.
 */
export function useActivity(id: string) {
  const snapshot = id.length > 0 ? getOfflineSnapshot(id) : undefined;

  return useQuery({
    queryKey: activityKeys.detail(id),
    queryFn: () => fetchActivityDetail(id),
    enabled: id.length > 0,
    placeholderData: snapshot ? { activity: snapshot } : undefined,
  });
}
