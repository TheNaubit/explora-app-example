import {
  getActivityResponseSchema,
  listActivitiesRequestSchema,
  listActivitiesResponseSchema,
  refreshCatalogResponseSchema,
  type GetActivityResponse,
  type ListActivitiesRequest,
  type ListActivitiesResponse,
  type RefreshCatalogResponse,
} from "@/schemas/api";
import type { Activity } from "@/schemas/activity";
import type { MockResult } from "@/schemas/mock-result";
import { parseWithSchema } from "@/utils/parse-with-schema";
import { ZodError } from "zod";

import * as catalogStore from "@/mocks/catalog-store";
import { LIST_PAGE_SIZE } from "@/mocks/constants";
import { delay, MOCK_DELAY_MS } from "@/mocks/delay";
import { getReviewModeState } from "@/mocks/review-mode";
import { mockFailure, mockSuccess } from "@/mocks/result";

export type {
  GetActivityResponse,
  ListActivitiesRequest,
  ListActivitiesResponse,
  RefreshCatalogResponse,
};

function validationFailure() {
  return mockFailure("errors.validationFailed");
}

function filterCatalog(
  catalog: readonly Activity[],
  search: string | undefined,
  categories: ListActivitiesRequest["categories"],
): Activity[] {
  const normalizedSearch = search?.trim().toLowerCase() ?? "";

  return catalog.filter((activity) => {
    if (categories && categories.length > 0 && !categories.includes(activity.category)) {
      return false;
    }

    if (normalizedSearch.length > 0 && !activity.title.toLowerCase().includes(normalizedSearch)) {
      return false;
    }

    return true;
  });
}

function parseCursorOffset(cursor: string | null): number {
  if (cursor === null) {
    return 0;
  }

  const offset = Number.parseInt(cursor, 10);
  if (!Number.isFinite(offset) || offset < 0) {
    return 0;
  }

  return offset;
}

/**
 * List one page of the discovery catalog.
 * First page (`cursor === null`) honors `initialLoad`. Later pages honor `pageLoad`.
 */
export async function listActivities(
  request: ListActivitiesRequest = { cursor: null },
): Promise<MockResult<ListActivitiesResponse>> {
  try {
    const parsedRequest = parseWithSchema(listActivitiesRequestSchema, request);
    const { cursor, search, categories } = parsedRequest;
    const limit = parsedRequest.limit ?? LIST_PAGE_SIZE;
    const isFirstPage = cursor === null;
    const { initialLoad, pageLoad } = getReviewModeState();
    const mode = isFirstPage ? initialLoad : pageLoad;

    if (mode === "fail") {
      await delay(MOCK_DELAY_MS.normal);
      return mockFailure("errors.networkOffline");
    }

    await delay(mode === "slow" ? MOCK_DELAY_MS.slow : MOCK_DELAY_MS.normal);

    const filtered = filterCatalog(catalogStore.getCatalog(), search, categories);
    const offset = parseCursorOffset(cursor);
    const page = filtered.slice(offset, offset + limit);
    const nextOffset = offset + page.length;
    const nextCursor = nextOffset < filtered.length ? String(nextOffset) : null;

    const payload = parseWithSchema(listActivitiesResponseSchema, {
      activities: page,
      total: filtered.length,
      nextCursor,
    });
    return mockSuccess(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationFailure();
    }

    throw error;
  }
}

/**
 * Load one activity by id.
 * Honors initial-load review modes for delay and hard fail.
 */
export async function getActivity(id: string): Promise<MockResult<GetActivityResponse>> {
  const { initialLoad } = getReviewModeState();

  if (initialLoad === "fail") {
    await delay(MOCK_DELAY_MS.normal);
    return mockFailure("errors.networkOffline");
  }

  await delay(initialLoad === "slow" ? MOCK_DELAY_MS.slow : MOCK_DELAY_MS.normal);

  const activity = catalogStore.findActivityById(id);

  if (!activity) {
    return mockFailure("errors.notFound");
  }

  try {
    const payload = parseWithSchema(getActivityResponseSchema, { activity });
    return mockSuccess(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationFailure();
    }

    throw error;
  }
}

/**
 * Successful refresh adds exactly one activity.
 * Fail and timeout paths add nothing.
 */
export async function refreshCatalog(): Promise<MockResult<RefreshCatalogResponse>> {
  const { refresh } = getReviewModeState();

  if (refresh === "fail") {
    await delay(MOCK_DELAY_MS.normal);
    return mockFailure("errors.refreshFailed");
  }

  await delay(refresh === "slow" ? MOCK_DELAY_MS.slow : MOCK_DELAY_MS.normal);

  try {
    const activity = catalogStore.appendRefreshActivity();
    const payload = parseWithSchema(refreshCatalogResponseSchema, { activity });
    return mockSuccess(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationFailure();
    }

    throw error;
  }
}
