import { getActivityCardCarouselLayout } from "@/components/activity-card-carousel/layout";
import {
  ACTIVITY_CARD_BODY_HEIGHT,
  ACTIVITY_CARD_GAP,
  ACTIVITY_CARD_MEDIA_ASPECT_RATIO,
  ACTIVITY_CARD_MEDIA_MAX_HEIGHT,
  ACTIVITY_CARD_TOP_SPACING,
} from "@/components/activity-card-carousel/constants";

describe("activity card carousel layout", () => {
  it("gives loaded cards and skeletons one shared item frame", () => {
    const width = 402;
    const headerHeight = 235;
    const cardWidth = 354;
    const layout = getActivityCardCarouselLayout({
      fontScale: 1,
      headerHeight,
      height: 874,
      usesCardCarousel: true,
      width,
    });

    expect(layout.padTop).toBe(headerHeight + ACTIVITY_CARD_TOP_SPACING);
    expect(layout.mediaHeight).toBe(
      Math.min(cardWidth * ACTIVITY_CARD_MEDIA_ASPECT_RATIO, ACTIVITY_CARD_MEDIA_MAX_HEIGHT),
    );
    expect(layout.itemExtent).toBe(
      layout.mediaHeight + ACTIVITY_CARD_BODY_HEIGHT + ACTIVITY_CARD_GAP,
    );
  });

  it("removes a native safe-area origin from first-load list padding", () => {
    const layout = getActivityCardCarouselLayout({
      contentOriginInset: 59,
      fontScale: 1,
      headerHeight: 235,
      height: 874,
      usesCardCarousel: true,
      width: 402,
    });

    expect(layout.padTop).toBe(235 - 59 + ACTIVITY_CARD_TOP_SPACING);
  });
});
