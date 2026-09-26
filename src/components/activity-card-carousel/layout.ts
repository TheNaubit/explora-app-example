import {
  ACTIVITY_CARD_BODY_HEIGHT,
  ACTIVITY_CARD_GAP,
  ACTIVITY_CARD_MEDIA_ASPECT_RATIO,
  ACTIVITY_CARD_MEDIA_MAX_HEIGHT,
  ACTIVITY_CARD_TOP_SPACING,
} from "@/components/activity-card-carousel/constants";
import { spacing } from "@/theme";

type ActivityCardCarouselLayoutInput = {
  contentOriginInset?: number;
  fontScale: number;
  headerHeight: number;
  height: number;
  usesCardCarousel: boolean;
  width: number;
};

/** Shared list geometry for loaded cards and their first-load skeletons. */
export function getActivityCardCarouselLayout({
  contentOriginInset = 0,
  fontScale,
  headerHeight,
  height,
  usesCardCarousel,
  width,
}: ActivityCardCarouselLayoutInput) {
  const cardWidth = width - spacing.space48;
  const mediaHeight = Math.min(
    cardWidth * ACTIVITY_CARD_MEDIA_ASPECT_RATIO,
    ACTIVITY_CARD_MEDIA_MAX_HEIGHT,
  );
  const itemExtent = mediaHeight + ACTIVITY_CARD_BODY_HEIGHT * fontScale + ACTIVITY_CARD_GAP;
  const focusPadding = usesCardCarousel ? ACTIVITY_CARD_TOP_SPACING : spacing.space8;
  const padTop = Math.max(0, headerHeight - contentOriginInset) + focusPadding;
  const endPadding = usesCardCarousel
    ? Math.max(focusPadding, height - padTop - itemExtent)
    : spacing.space32;

  return { endPadding, itemExtent, mediaHeight, padTop };
}
