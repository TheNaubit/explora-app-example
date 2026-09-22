import { activityKeys } from "@/query/keys";

describe("activityKeys", () => {
  it("builds stable list and detail keys", () => {
    expect(activityKeys.all).toEqual(["activities"]);
    expect(activityKeys.lists()).toEqual(["activities", "list"]);
    expect(activityKeys.list({ search: "walk", category: "Outdoors" })).toEqual([
      "activities",
      "list",
      "walk",
      "Outdoors",
    ]);
    expect(activityKeys.detail("act-001")).toEqual(["activities", "detail", "act-001"]);
  });
});
