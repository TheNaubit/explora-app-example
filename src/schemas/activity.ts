import { z } from "zod";

/**
 * Zod schemas for the supplied activity catalog and generated items.
 * Infer domain types from these schemas. Do not keep a second hand-written type set.
 */

export const activityCategorySchema = z.enum(["Outdoors", "Culture", "Workshops", "Leisure"]);

export const activitySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  category: activityCategorySchema,
  location: z.string().min(1),
  durationMinutes: z.number().int().positive(),
});

/** Shape of supplied `activities.json`: schema version plus activities array. */
export const activitiesDatasetSchema = z.object({
  schemaVersion: z.number().int().positive(),
  activities: z.array(activitySchema).min(1),
});

export type ActivityCategory = z.infer<typeof activityCategorySchema>;
export type Activity = z.infer<typeof activitySchema>;
export type ActivitiesDataset = z.infer<typeof activitiesDatasetSchema>;
