import { SUPPLIED_ACTIVITIES } from "@/data/activities";
import { getActivity, listActivities, refreshCatalog } from "@/mocks/api";
import * as catalogStore from "@/mocks/catalog-store";
import {
  findActivityById,
  getCatalogSize,
  replaceCatalogForTests,
  resetCatalog,
} from "@/mocks/catalog-store";
import {
  ACTIVITY_ID_PAD_LENGTH,
  ASSESSMENT_MIN_CATALOG_SIZE,
  REFRESH_ACTIVITY_ID_PREFIX,
  SEEDED_CATALOG_SIZE,
} from "@/mocks/constants";
import { delay, MOCK_DELAY_MS } from "@/mocks/delay";
import {
  getReviewModeState,
  resetReviewModeState,
  setInitialLoadMode,
  setRefreshMode,
  setReviewModeState,
} from "@/mocks/review-mode";
import type { Activity } from "@/schemas/activity";
import * as parseUtils from "@/utils/parse-with-schema";

jest.mock("@/mocks/delay", () => ({
  MOCK_DELAY_MS: { normal: 1, slow: 2 },
  delay: jest.fn(() => Promise.resolve()),
}));

const mockedDelay = jest.mocked(delay);

const refreshIdPattern = new RegExp(
  `^${REFRESH_ACTIVITY_ID_PREFIX}\\d{${ACTIVITY_ID_PAD_LENGTH}}$`,
);

const invalidActivity = {
  id: "",
  title: "",
  description: "",
  category: "Outdoors",
  location: "",
  durationMinutes: -1,
} as unknown as Activity;

describe("mock API", () => {
  beforeEach(() => {
    resetCatalog();
    resetReviewModeState();
    mockedDelay.mockClear();
  });

  describe("listActivities", () => {
    it(`returns ${SEEDED_CATALOG_SIZE} activities and keeps the supplied ids`, async () => {
      setInitialLoadMode("normal");

      const result = await listActivities();

      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }

      expect(result.data.total).toBeGreaterThanOrEqual(ASSESSMENT_MIN_CATALOG_SIZE);
      expect(result.data.total).toBe(SEEDED_CATALOG_SIZE);
      expect(result.data.activities).toHaveLength(SEEDED_CATALOG_SIZE);
      expect(mockedDelay).toHaveBeenCalledWith(MOCK_DELAY_MS.normal);

      for (const supplied of SUPPLIED_ACTIVITIES) {
        const match = result.data.activities.find((activity) => activity.id === supplied.id);
        expect(match).toEqual(supplied);
      }
    });

    it("uses the slow delay when initial load is slow", async () => {
      setInitialLoadMode("slow");

      const result = await listActivities();

      expect(result.ok).toBe(true);
      expect(mockedDelay).toHaveBeenCalledWith(MOCK_DELAY_MS.slow);
    });

    it("returns networkOffline and does not seed-mutate on initial load fail", async () => {
      setInitialLoadMode("fail");
      const sizeBefore = getCatalogSize();

      const result = await listActivities();

      expect(result.ok).toBe(false);
      if (result.ok) {
        return;
      }

      expect(result.errorKey).toBe("errors.networkOffline");
      expect(getCatalogSize()).toBe(sizeBefore);
      expect(mockedDelay).toHaveBeenCalledWith(MOCK_DELAY_MS.normal);
    });

    it("returns validationFailed when the catalog payload is invalid", async () => {
      replaceCatalogForTests([]);

      const result = await listActivities();

      expect(result.ok).toBe(false);
      if (result.ok) {
        return;
      }

      expect(result.errorKey).toBe("errors.validationFailed");
    });
  });

  describe("getActivity", () => {
    it("returns a supplied activity by id", async () => {
      const target = SUPPLIED_ACTIVITIES[0];

      const result = await getActivity(target.id);

      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }

      expect(result.data.activity).toEqual(target);
      expect(findActivityById(target.id)).toEqual(target);
    });

    it("returns notFound for an unknown id", async () => {
      const result = await getActivity("missing-activity-id");

      expect(result.ok).toBe(false);
      if (result.ok) {
        return;
      }

      expect(result.errorKey).toBe("errors.notFound");
    });

    it("returns networkOffline when initial load is fail", async () => {
      setInitialLoadMode("fail");

      const result = await getActivity(SUPPLIED_ACTIVITIES[0].id);

      expect(result.ok).toBe(false);
      if (result.ok) {
        return;
      }

      expect(result.errorKey).toBe("errors.networkOffline");
    });

    it("uses the slow delay when initial load is slow", async () => {
      setInitialLoadMode("slow");

      const result = await getActivity(SUPPLIED_ACTIVITIES[0].id);

      expect(result.ok).toBe(true);
      expect(mockedDelay).toHaveBeenCalledWith(MOCK_DELAY_MS.slow);
    });

    it("returns validationFailed when a stored activity is invalid", async () => {
      replaceCatalogForTests([invalidActivity]);

      const result = await getActivity("");

      expect(result.ok).toBe(false);
      if (result.ok) {
        return;
      }

      expect(result.errorKey).toBe("errors.validationFailed");
    });
  });

  describe("refreshCatalog", () => {
    it("does not add an activity when refresh fails, and adds one unique activity on success", async () => {
      const sizeBeforeFail = getCatalogSize();

      setRefreshMode("fail");
      const failed = await refreshCatalog();

      expect(failed.ok).toBe(false);
      if (failed.ok) {
        return;
      }

      expect(failed.errorKey).toBe("errors.refreshFailed");
      expect(getCatalogSize()).toBe(sizeBeforeFail);
      expect(mockedDelay).toHaveBeenCalledWith(MOCK_DELAY_MS.normal);

      setRefreshMode("success");
      const succeeded = await refreshCatalog();

      expect(succeeded.ok).toBe(true);
      if (!succeeded.ok) {
        return;
      }

      expect(getCatalogSize()).toBe(sizeBeforeFail + 1);
      expect(succeeded.data.activity.id).toMatch(refreshIdPattern);

      const listed = await listActivities();
      expect(listed.ok).toBe(true);
      if (!listed.ok) {
        return;
      }

      const matches = listed.data.activities.filter(
        (activity) => activity.id === succeeded.data.activity.id,
      );
      expect(matches).toHaveLength(1);
    });

    it("adds one activity after the slow delay when refresh is slow", async () => {
      const sizeBefore = getCatalogSize();
      setRefreshMode("slow");

      const result = await refreshCatalog();

      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }

      expect(getCatalogSize()).toBe(sizeBefore + 1);
      expect(result.data.activity.id).toMatch(refreshIdPattern);
      expect(mockedDelay).toHaveBeenCalledWith(MOCK_DELAY_MS.slow);
    });

    it("returns validationFailed when the appended activity is invalid", async () => {
      const spy = jest
        .spyOn(catalogStore, "appendRefreshActivity")
        .mockReturnValue(invalidActivity);

      const result = await refreshCatalog();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errorKey).toBe("errors.validationFailed");
      }

      spy.mockRestore();
    });
  });

  describe("non-Zod failures", () => {
    it("rethrows unexpected errors from listActivities", async () => {
      const spy = jest.spyOn(parseUtils, "parseWithSchema").mockImplementation(() => {
        throw new Error("unexpected list failure");
      });

      await expect(listActivities()).rejects.toThrow("unexpected list failure");
      spy.mockRestore();
    });

    it("rethrows unexpected errors from getActivity", async () => {
      const spy = jest.spyOn(parseUtils, "parseWithSchema").mockImplementation(() => {
        throw new Error("unexpected get failure");
      });

      await expect(getActivity(SUPPLIED_ACTIVITIES[0].id)).rejects.toThrow(
        "unexpected get failure",
      );
      spy.mockRestore();
    });

    it("rethrows unexpected errors from refreshCatalog", async () => {
      const spy = jest.spyOn(parseUtils, "parseWithSchema").mockImplementation(() => {
        throw new Error("unexpected refresh failure");
      });

      await expect(refreshCatalog()).rejects.toThrow("unexpected refresh failure");
      spy.mockRestore();
    });
  });

  describe("review mode helpers", () => {
    it("updates and resets review mode state", () => {
      setReviewModeState({ initialLoad: "fail", refresh: "fail" });
      expect(getReviewModeState()).toEqual({ initialLoad: "fail", refresh: "fail" });

      setInitialLoadMode("slow");
      setRefreshMode("slow");
      expect(getReviewModeState()).toEqual({ initialLoad: "slow", refresh: "slow" });

      resetReviewModeState();
      expect(getReviewModeState()).toEqual({ initialLoad: "normal", refresh: "success" });
    });
  });
});
