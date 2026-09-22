import { Faker, en } from "@faker-js/faker";

import {
  ACTIVITY_ID_PAD_LENGTH,
  GENERATED_ACTIVITY_ID_PREFIX,
  GENERATED_ACTIVITY_TITLE_SUFFIX,
  GENERATED_DURATION_MINUTES_MAX,
  GENERATED_DURATION_MINUTES_MIN,
  REFRESH_ACTIVITY_ID_PREFIX,
} from "@/mocks/constants";
import {
  activityCategorySchema,
  activitySchema,
  type Activity,
  type ActivityCategory,
} from "@/schemas/activity";
import { parseWithSchema } from "@/utils/parse-with-schema";

const CATEGORIES = activityCategorySchema.options;

/**
 * Build one activity with a stable unique id.
 * Use a fixed Faker seed so the same index always yields the same fields.
 */
export function generateActivity(options: { id: string; seed: number }): Activity {
  const faker = new Faker({ locale: [en] });
  faker.seed(options.seed);

  const category = faker.helpers.arrayElement(CATEGORIES) as ActivityCategory;
  const titleStem = faker.commerce.productName();
  const place = faker.location.city();

  const candidate = {
    id: options.id,
    title: `${titleStem}${GENERATED_ACTIVITY_TITLE_SUFFIX}`,
    description: faker.lorem.paragraph(),
    category,
    location: place,
    durationMinutes: faker.number.int({
      min: GENERATED_DURATION_MINUTES_MIN,
      max: GENERATED_DURATION_MINUTES_MAX,
    }),
  };

  return parseWithSchema(activitySchema, candidate);
}

/** Stable id for a seeded performance-scale activity. */
export function generatedActivityId(index: number): string {
  return `${GENERATED_ACTIVITY_ID_PREFIX}${String(index).padStart(ACTIVITY_ID_PAD_LENGTH, "0")}`;
}

/** Stable id for an activity created by a successful refresh. */
export function refreshActivityId(sequence: number): string {
  return `${REFRESH_ACTIVITY_ID_PREFIX}${String(sequence).padStart(ACTIVITY_ID_PAD_LENGTH, "0")}`;
}
