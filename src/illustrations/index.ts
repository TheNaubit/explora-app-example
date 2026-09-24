import type { ImageSource } from "expo-image";

import type { ActivityCategory } from "@/schemas/activity";

/** Claymorphic empty-search illustration. */
export const emptySearchIllustration =
  require("../../assets/illustrations/empty-search.png") as ImageSource;

/** Transparent claymorphic Favorites collection illustration. */
export const emptyFavoritesIllustration =
  require("../../assets/illustrations/empty-favorites.png") as ImageSource;

const categoryIllustrations = {
  Outdoors: require("../../assets/illustrations/category-outdoors.png"),
  Culture: require("../../assets/illustrations/category-culture.png"),
  Workshops: require("../../assets/illustrations/category-workshops.png"),
  Leisure: require("../../assets/illustrations/category-leisure.png"),
} as const satisfies Record<ActivityCategory, ImageSource>;

const categoryChipIllustrations = {
  All: require("../../assets/illustrations/chip-all.png"),
  Outdoors: require("../../assets/illustrations/chip-outdoors.png"),
  Culture: require("../../assets/illustrations/chip-culture.png"),
  Workshops: require("../../assets/illustrations/chip-workshops.png"),
  Leisure: require("../../assets/illustrations/chip-leisure.png"),
} as const satisfies Record<ActivityCategory | "All", ImageSource>;

/** Claymorphic category cue when the activity has no photo URL. */
export function getCategoryIllustration(category: ActivityCategory): ImageSource {
  return categoryIllustrations[category];
}

/** Compact claymorphic cue for one discovery filter chip. */
export function getCategoryChipIllustration(category: ActivityCategory | null): ImageSource {
  return categoryChipIllustrations[category ?? "All"];
}
