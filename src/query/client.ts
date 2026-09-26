import { QueryClient } from "@tanstack/react-query";

import { getQueryRetryDelay, QUERY_RETRY_COUNT, QUERY_STALE_TIME_MS } from "@/query/constants";
import { isApiError } from "@/query/errors";

type CreateQueryClientOptions = {
  gcTime?: number;
};

/** Do not retry client or validation failures from the mock envelope. */
export function shouldRetryQuery(failureCount: number, error: Error): boolean {
  if (isApiError(error)) {
    if (error.errorKey === "errors.notFound" || error.errorKey === "errors.validationFailed") {
      return false;
    }
  }

  return failureCount < QUERY_RETRY_COUNT;
}

/** Shared QueryClient for the app. Prefer this instance from providers and tests. */
export function createQueryClient({ gcTime }: CreateQueryClientOptions = {}): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime,
        staleTime: QUERY_STALE_TIME_MS,
        retry: shouldRetryQuery,
        retryDelay: getQueryRetryDelay,
        // Mock API runs on-device. Do not pause queries when the radio is offline.
        networkMode: "always",
      },
      mutations: {
        gcTime,
        retry: 0,
        networkMode: "always",
      },
    },
  });
}

export const queryClient = createQueryClient();
