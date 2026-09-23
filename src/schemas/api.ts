import { z } from "zod";

import { activityCategorySchema, activitySchema } from "@/schemas/activity";

/**
 * Request for a paginated catalog page.
 * `cursor` is null on the first page. Later pages pass `nextCursor` from the prior response.
 */
export const listActivitiesRequestSchema = z.object({
  cursor: z.string().nullable(),
  limit: z.number().int().positive().optional(),
  search: z.string().optional(),
  categories: z.array(activityCategorySchema).optional(),
});

/**
 * Success payload for one catalog page.
 * `total` is the filtered catalog size. `nextCursor` is null when no more pages exist.
 */
export const listActivitiesResponseSchema = z.object({
  activities: z.array(activitySchema),
  total: z.number().int().nonnegative(),
  nextCursor: z.string().nullable(),
});

/** Success payload for loading one activity by id. */
export const getActivityResponseSchema = z.object({
  activity: activitySchema,
});

/** Success payload for refresh: exactly one new activity. */
export const refreshCatalogResponseSchema = z.object({
  activity: activitySchema,
});

export type ListActivitiesRequest = z.infer<typeof listActivitiesRequestSchema>;
export type ListActivitiesResponse = z.infer<typeof listActivitiesResponseSchema>;
export type GetActivityResponse = z.infer<typeof getActivityResponseSchema>;
export type RefreshCatalogResponse = z.infer<typeof refreshCatalogResponseSchema>;
