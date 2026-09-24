import { useLocalSearchParams } from "expo-router";

import { ActivityDetail } from "@/screens/activity-detail";

/** Activity Detail route. The route stays thin and passes only the activity id. */
export default function ActivityDetailRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const activityId = Array.isArray(id) ? (id[0] ?? "") : (id ?? "");

  return <ActivityDetail id={activityId} />;
}
