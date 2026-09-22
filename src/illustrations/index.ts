import type { ImageSource } from "expo-image";

import type { ActivityCategory } from "@/schemas/activity";

/** Claymorphic empty-search illustration. */
export const emptySearchIllustration =
  require("../../assets/illustrations/empty-search.png") as ImageSource;

const categoryIllustrations = {
  Outdoors: require("../../assets/illustrations/category-outdoors.png"),
  Culture: require("../../assets/illustrations/category-culture.png"),
  Workshops: require("../../assets/illustrations/category-workshops.png"),
  Leisure: require("../../assets/illustrations/category-leisure.png"),
} as const satisfies Record<ActivityCategory, ImageSource>;

/** Claymorphic category cue when the activity has no photo URL. */
export function getCategoryIllustration(category: ActivityCategory): ImageSource {
  return categoryIllustrations[category];
}
