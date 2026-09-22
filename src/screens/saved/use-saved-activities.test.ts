import { addFavorite, clearFavorites } from "@/state/favorites";
import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import { useSavedActivities } from "@/screens/saved/use-saved-activities";
import { renderHook } from "@testing-library/react-native";

describe("useSavedActivities", () => {
  beforeEach(() => {
    clearFavorites();
  });

  it("returns snapshots in favorite order", async () => {
    addFavorite(SUPPLIED_ACTIVITIES[1]);
    addFavorite(SUPPLIED_ACTIVITIES[0]);

    const { result } = await renderHook(() => useSavedActivities());

    expect(result.current.map((activity) => activity.id)).toEqual([
      SUPPLIED_ACTIVITIES[1].id,
      SUPPLIED_ACTIVITIES[0].id,
    ]);
  });
});
