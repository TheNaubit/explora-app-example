import { getActivityCoverImage } from "@/data/activity-image";
import type { Activity } from "@/schemas/activity";

describe("getActivityCoverImage", () => {
  const activity: Activity = {
    id: "act-001",
    title: "Botanical Garden Walk",
    description: "A relaxed walk.",
    category: "Outdoors",
    location: "North Garden",
    durationMinutes: 60,
  };

  it("returns a stable URI seeded by activity id", () => {
    const cover = getActivityCoverImage(activity);
    expect(cover.uri).toContain("act-001");
    expect(cover.uri).toContain("picsum.photos/seed/");
    expect(cover.blurhash.length).toBeGreaterThan(0);
  });

  it("keeps the same URI for the same activity", () => {
    expect(getActivityCoverImage(activity).uri).toBe(getActivityCoverImage(activity).uri);
  });
});
