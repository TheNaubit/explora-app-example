import {
  getQueryRetryDelay,
  QUERY_RETRY_BASE_DELAY_MS,
  QUERY_RETRY_COUNT,
  QUERY_RETRY_JITTER_MS,
  QUERY_RETRY_MAX_DELAY_MS,
} from "@/query/constants";
import { shouldRetryQuery } from "@/query/client";
import { ApiError } from "@/query/errors";

describe("query retry policy", () => {
  it("retries network-style failures up to QUERY_RETRY_COUNT", () => {
    const error = new ApiError("errors.networkOffline");
    expect(shouldRetryQuery(0, error)).toBe(true);
    expect(shouldRetryQuery(QUERY_RETRY_COUNT - 1, error)).toBe(true);
    expect(shouldRetryQuery(QUERY_RETRY_COUNT, error)).toBe(false);
  });

  it("does not retry notFound or validationFailed", () => {
    expect(shouldRetryQuery(0, new ApiError("errors.notFound"))).toBe(false);
    expect(shouldRetryQuery(0, new ApiError("errors.validationFailed"))).toBe(false);
  });

  it("uses exponential backoff capped with jitter", () => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);

    expect(getQueryRetryDelay(0)).toBe(QUERY_RETRY_BASE_DELAY_MS + 0.5 * QUERY_RETRY_JITTER_MS);
    expect(getQueryRetryDelay(1)).toBe(QUERY_RETRY_BASE_DELAY_MS * 2 + 0.5 * QUERY_RETRY_JITTER_MS);
    expect(getQueryRetryDelay(10)).toBe(QUERY_RETRY_MAX_DELAY_MS + 0.5 * QUERY_RETRY_JITTER_MS);

    jest.restoreAllMocks();
  });
});
