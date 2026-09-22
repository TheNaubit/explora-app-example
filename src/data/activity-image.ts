import type { Activity, ActivityCategory } from "@/schemas/activity";

/**
 * Cover photo for list and detail media.
 * The supplied catalog has no image URLs, so Explora builds a stable remote
 * cover from the activity id. BlurHash paints first, then the photo fades in.
 */
export type ActivityCoverImage = {
  uri: string;
  blurhash: string;
};

/** Cover width requested from the image host (points × ~2 for retina). */
export const ACTIVITY_COVER_IMAGE_WIDTH = 960;

/** Cover height requested from the image host. */
export const ACTIVITY_COVER_IMAGE_HEIGHT = 640;

/**
 * Soft BlurHash placeholders tuned per category so the first paint matches
 * the eventual photo mood before the network image arrives.
 */
const CATEGORY_BLURHASH: Record<ActivityCategory, string> = {
  Outdoors: "L6Pj0^jE.AyE_3t7t7R**0o#DgR4",
  Culture: "LGF5]+Yk^6#M@-5c,1J5@[or[Q6.",
  Workshops: "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
  Leisure: "LKO2?U%2Tw=w]~RBVZRi};RPxuwH",
};

/**
 * Build a deterministic cover URI and BlurHash for an activity.
 * Picsum seeds the photo from the activity id so the same row keeps one image.
 */
export function getActivityCoverImage(activity: Activity): ActivityCoverImage {
  const seed = encodeURIComponent(activity.id);
  return {
    uri: `https://picsum.photos/seed/${seed}/${ACTIVITY_COVER_IMAGE_WIDTH}/${ACTIVITY_COVER_IMAGE_HEIGHT}`,
    blurhash: CATEGORY_BLURHASH[activity.category],
  };
}
