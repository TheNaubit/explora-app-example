import type { ErrorKey } from "@/i18n/error-keys";
import type { MockResult } from "@/schemas/mock-result";

/**
 * Error thrown when a mock or API envelope returns `ok: false`.
 * UI resolves `errorKey` with `resolveErrorMessage` and Lingui.
 */
export class ApiError extends Error {
  readonly errorKey: ErrorKey;

  constructor(errorKey: ErrorKey) {
    super(errorKey);
    this.name = "ApiError";
    this.errorKey = errorKey;
  }
}

/** True when the value is an `ApiError`. */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Unwrap a mock envelope into data or throw `ApiError`.
 * Use inside Query `queryFn` / `mutationFn` bodies.
 */
export function unwrapMockResult<T>(result: MockResult<T>): T {
  if (!result.ok) {
    throw new ApiError(result.errorKey);
  }

  return result.data;
}
