/**
 * @jest-environment node
 */
import { flattenActivityPages } from "@/screens/explore/flatten-activity-pages";
import type { ActivitiesInfiniteData } from "@/query/activity-queries";
import { SUPPLIED_ACTIVITIES } from "@/data/activities";

describe("flattenActivityPages", () => {
  it("returns an empty list when data is missing", () => {
    expect(flattenActivityPages(undefined)).toEqual([]);
  });

  it("flattens pages into one activity list", () => {
    const data = {
      pages: [
        { activities: [SUPPLIED_ACTIVITIES[0]], nextCursor: "1" },
        { activities: [SUPPLIED_ACTIVITIES[1]], nextCursor: null },
      ],
      pageParams: [null, "1"],
    } as ActivitiesInfiniteData;

    expect(flattenActivityPages(data)).toEqual([SUPPLIED_ACTIVITIES[0], SUPPLIED_ACTIVITIES[1]]);
  });
});
