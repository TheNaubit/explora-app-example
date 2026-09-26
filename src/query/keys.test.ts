import { activityKeys } from "@/query/keys";

describe("activityKeys", () => {
  it("builds stable list and detail keys", () => {
    expect(activityKeys.all).toEqual(["activities"]);
    expect(activityKeys.lists()).toEqual(["activities", "list"]);
    expect(activityKeys.list({ search: "walk", categories: ["Outdoors", "Culture"] })).toEqual([
      "activities",
      "list",
      "walk",
      ["Culture", "Outdoors"],
    ]);
    expect(activityKeys.detail("act-001")).toEqual(["activities", "detail", "act-001"]);
    expect(activityKeys.listForReview({ search: "walk", categories: ["Outdoors"] }, 3)).toEqual([
      "activities",
      "list",
      "walk",
      ["Outdoors"],
      "review",
      3,
    ]);
    expect(activityKeys.detailForReview("act-001", 3)).toEqual([
      "activities",
      "detail",
      "act-001",
      "review",
      3,
    ]);
  });
});
