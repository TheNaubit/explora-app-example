import type { Activity } from "@/types/activity";
import { formatDuration } from "@/utils/format-duration";

/**
 * Build one spoken label for an activity list row or card.
 * Include title, category, duration, and location.
 */
export function buildActivityAccessibilityLabel(activity: Activity): string {
  return `${activity.title}. ${activity.category}. ${formatDuration(activity.durationMinutes)}. ${activity.location}.`;
}

/**
 * Build the spoken label for a favorite toggle.
 * Pass the current favorite state after the user action when you announce.
 */
export function buildFavoriteToggleLabel(title: string, isFavorite: boolean): string {
  if (isFavorite) {
    return `Remove ${title} from favorites`;
  }

  return `Save ${title} to favorites`;
}

/** Spoken label for the discovery search field. */
export function buildSearchFieldLabel(): string {
  return "Search activities by title";
}
