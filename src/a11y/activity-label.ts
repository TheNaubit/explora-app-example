import type { MessageDescriptor } from "@lingui/core";
import { i18n } from "@lingui/core";
import { msg } from "@lingui/core/macro";

import { translateCategory } from "@/i18n/category-labels";
import type { Activity } from "@/types/activity";
import { formatDuration } from "@/utils/format-duration";

const favoriteRemove = msg({
  id: "a11y.favorite.remove",
  comment: "Spoken label for the favorite toggle when the activity is already a favorite",
  message: "Remove {title} from favorites",
});

const favoriteSave = msg({
  id: "a11y.favorite.save",
  comment: "Spoken label for the favorite toggle when the activity is not a favorite",
  message: "Save {title} to favorites",
});

const searchField = msg({
  id: "a11y.search.field",
  comment: "Spoken label for the discovery search text field",
  message: "Search activities by title",
});

const activityRow = msg({
  id: "a11y.activity.row",
  comment: "Spoken summary for an activity list row: title, category, duration, location",
  message: "{title}. {category}. {duration}. {location}.",
});

function translate(descriptor: MessageDescriptor, values?: Record<string, unknown>): string {
  return i18n._({ ...descriptor, values });
}

/**
 * Build one spoken label for an activity list row or card.
 * Include title, category, duration, and location.
 */
export function buildActivityAccessibilityLabel(activity: Activity): string {
  return translate(activityRow, {
    title: activity.title,
    category: translateCategory(activity.category),
    duration: formatDuration(activity.durationMinutes),
    location: activity.location,
  });
}

/**
 * Build the spoken label for a favorite toggle.
 * Pass the current favorite state after the user action when you announce.
 */
export function buildFavoriteToggleLabel(title: string, isFavorite: boolean): string {
  const descriptor = isFavorite ? favoriteRemove : favoriteSave;
  return translate(descriptor, { title });
}

/** Spoken label for the discovery search field. */
export function buildSearchFieldLabel(): string {
  return translate(searchField);
}
