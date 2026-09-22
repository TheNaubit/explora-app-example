import type { MessageDescriptor } from "@lingui/core";
import { i18n } from "@lingui/core";
import { msg } from "@lingui/core/macro";

import type { ActivityCategory } from "@/schemas/activity";

/** Shared category labels for chips, cards, and spoken a11y. */
export const categoryMessages = {
  all: msg({
    id: "category.all",
    comment: "Category chip that clears the category filter",
    message: "All",
  }),
  Outdoors: msg({
    id: "category.outdoors",
    comment: "Activity category chip label",
    message: "Outdoors",
  }),
  Culture: msg({
    id: "category.culture",
    comment: "Activity category chip label",
    message: "Culture",
  }),
  Workshops: msg({
    id: "category.workshops",
    comment: "Activity category chip label",
    message: "Workshops",
  }),
  Leisure: msg({
    id: "category.leisure",
    comment: "Activity category chip label",
    message: "Leisure",
  }),
} as const satisfies {
  all: MessageDescriptor;
} & Record<ActivityCategory, MessageDescriptor>;

/** Localized display label for one catalog category. */
export function translateCategory(category: ActivityCategory): string {
  return i18n._(categoryMessages[category]);
}
