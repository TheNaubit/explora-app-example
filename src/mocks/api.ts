import {
  getActivityResponseSchema,
  listActivitiesResponseSchema,
  refreshCatalogResponseSchema,
  type GetActivityResponse,
  type ListActivitiesResponse,
  type RefreshCatalogResponse,
} from "@/schemas/api";
import type { MockResult } from "@/schemas/mock-result";
import { parseWithSchema } from "@/utils/parse-with-schema";
import { ZodError } from "zod";

import * as catalogStore from "@/mocks/catalog-store";
import { delay, MOCK_DELAY_MS } from "@/mocks/delay";
import { getReviewModeState } from "@/mocks/review-mode";
import { mockFailure, mockSuccess } from "@/mocks/result";

export type { GetActivityResponse, ListActivitiesResponse, RefreshCatalogResponse };

function validationFailure() {
  return mockFailure("errors.validationFailed");
}

/**
 * List the full discovery catalog.
 * Honors initial-load review modes (normal, slow, fail).
 */
export async function listActivities(): Promise<MockResult<ListActivitiesResponse>> {
  const { initialLoad } = getReviewModeState();

  if (initialLoad === "fail") {
    await delay(MOCK_DELAY_MS.normal);
    return mockFailure("errors.networkOffline");
  }

  await delay(initialLoad === "slow" ? MOCK_DELAY_MS.slow : MOCK_DELAY_MS.normal);

  try {
    const activities = [...catalogStore.getCatalog()];
    const payload = parseWithSchema(listActivitiesResponseSchema, {
      activities,
      total: activities.length,
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
