import { z } from "zod";

import { activitySchema } from "@/schemas/activity";

/** Success payload for listing the discovery catalog. */
export const listActivitiesResponseSchema = z.object({
  activities: z.array(activitySchema).min(1),
  total: z.number().int().nonnegative(),
});

/** Success payload for loading one activity by id. */
export const getActivityResponseSchema = z.object({
  activity: activitySchema,
});

/** Success payload for refresh: exactly one new activity. */
export const refreshCatalogResponseSchema = z.object({
  activity: activitySchema,
});

export type ListActivitiesResponse = z.infer<typeof listActivitiesResponseSchema>;
export type GetActivityResponse = z.infer<typeof getActivityResponseSchema>;
export type RefreshCatalogResponse = z.infer<typeof refreshCatalogResponseSchema>;
