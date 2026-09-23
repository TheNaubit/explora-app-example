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
  LIST_PAGE_SIZE,
  REFRESH_ACTIVITY_ID_PREFIX,
  SEEDED_CATALOG_SIZE,
} from "@/mocks/constants";
import { delay, MOCK_DELAY_MS } from "@/mocks/delay";
import {
  getReviewModeState,
  resetReviewModeState,
  setInitialLoadMode,
  setPageLoadMode,
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
    it(`returns the first page of ${LIST_PAGE_SIZE} and reports total ${SEEDED_CATALOG_SIZE}`, async () => {
      setInitialLoadMode("normal");

      const result = await listActivities({ cursor: null });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }

      expect(result.data.total).toBeGreaterThanOrEqual(ASSESSMENT_MIN_CATALOG_SIZE);
      expect(result.data.total).toBe(SEEDED_CATALOG_SIZE);
      expect(result.data.activities).toHaveLength(LIST_PAGE_SIZE);
      expect(result.data.nextCursor).toBe(String(LIST_PAGE_SIZE));
      expect(mockedDelay).toHaveBeenCalledWith(MOCK_DELAY_MS.normal);

      for (const supplied of SUPPLIED_ACTIVITIES) {
        const match = result.data.activities.find((activity) => activity.id === supplied.id);
        if (match) {
          expect(match).toEqual(supplied);
        }
      }
    });

    it("returns the next page with pageLoad delay and a null cursor on the last page", async () => {
      const first = await listActivities({ cursor: null });
      expect(first.ok).toBe(true);
      if (!first.ok) {
        return;
      }

      mockedDelay.mockClear();
      setPageLoadMode("slow");

      const second = await listActivities({ cursor: first.data.nextCursor });
      expect(second.ok).toBe(true);
      if (!second.ok) {
        return;
      }

      expect(second.data.activities).toHaveLength(LIST_PAGE_SIZE);
      expect(second.data.nextCursor).toBe(String(LIST_PAGE_SIZE * 2));
      expect(mockedDelay).toHaveBeenCalledWith(MOCK_DELAY_MS.slow);

      let cursor = second.data.nextCursor;
      let lastPageLength = 0;
      while (cursor !== null) {
        const page = await listActivities({ cursor });
        expect(page.ok).toBe(true);
        if (!page.ok) {
          return;
        }
        lastPageLength = page.data.activities.length;
        cursor = page.data.nextCursor;
      }

      const expectedLastPage = SEEDED_CATALOG_SIZE % LIST_PAGE_SIZE;
      expect(lastPageLength).toBe(expectedLastPage === 0 ? LIST_PAGE_SIZE : expectedLastPage);
    });

    it("filters by search and multiple categories across pages", async () => {
      const categories = ["Outdoors", "Culture"] as const;
      const result = await listActivities({
        cursor: null,
        categories: [...categories],
        limit: SEEDED_CATALOG_SIZE,
      });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }

      expect(result.data.total).toBeGreaterThan(0);
      for (const activity of result.data.activities) {
        expect(categories).toContain(activity.category);
      }
    });

    it("uses the slow delay when initial load is slow", async () => {
      setInitialLoadMode("slow");

      const result = await listActivities({ cursor: null });

      expect(result.ok).toBe(true);
      expect(mockedDelay).toHaveBeenCalledWith(MOCK_DELAY_MS.slow);
    });

    it("returns networkOffline on first-page fail without mutating the catalog", async () => {
      setInitialLoadMode("fail");
      const sizeBefore = getCatalogSize();

      const result = await listActivities({ cursor: null });

      expect(result.ok).toBe(false);
      if (result.ok) {
        return;
      }

      expect(result.errorKey).toBe("errors.networkOffline");
      expect(getCatalogSize()).toBe(sizeBefore);
      expect(mockedDelay).toHaveBeenCalledWith(MOCK_DELAY_MS.normal);
    });

    it("returns networkOffline on next-page fail when pageLoad is fail", async () => {
      setPageLoadMode("fail");

      const result = await listActivities({ cursor: String(LIST_PAGE_SIZE) });

      expect(result.ok).toBe(false);
      if (result.ok) {
        return;
      }

      expect(result.errorKey).toBe("errors.networkOffline");
    });

    it("treats an invalid cursor as offset zero", async () => {
      const result = await listActivities({ cursor: "not-a-number" });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        return;
      }

      expect(result.data.activities[0]?.id).toBe(SUPPLIED_ACTIVITIES[0]?.id);
      expect(result.data.nextCursor).toBe(String(LIST_PAGE_SIZE));
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

      const listed = await listActivities({ cursor: null, limit: SEEDED_CATALOG_SIZE + 10 });
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

      await expect(listActivities({ cursor: null })).rejects.toThrow("unexpected list failure");
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
      setReviewModeState({ initialLoad: "fail", pageLoad: "fail", refresh: "fail" });
      expect(getReviewModeState()).toEqual({
        initialLoad: "fail",
        pageLoad: "fail",
        refresh: "fail",
      });

      setInitialLoadMode("slow");
      setPageLoadMode("slow");
      setRefreshMode("slow");
      expect(getReviewModeState()).toEqual({
        initialLoad: "slow",
        pageLoad: "slow",
        refresh: "slow",
      });

      resetReviewModeState();
      expect(getReviewModeState()).toEqual({
        initialLoad: "normal",
        pageLoad: "normal",
        refresh: "success",
      });
    });
  });
});
