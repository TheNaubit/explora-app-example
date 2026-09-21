import type { ErrorKey } from "@/i18n/error-keys";

/**
 * Shape of a failed mock / network response body.
 * Always return `errorKey` (stable). Never return a localized `message` for UI copy.
 * The UI resolves `errorKey` with Lingui via `resolveErrorMessage`.
 */
export type MockErrorBody = {
  ok: false;
  errorKey: ErrorKey;
};

/** Shape of a successful mock response wrapper. */
export type MockSuccessBody<T> = {
  ok: true;
  data: T;
};

export type MockResult<T> = MockSuccessBody<T> | MockErrorBody;

/** Build a failed mock body with a stable error key. */
export function mockFailure(errorKey: ErrorKey): MockErrorBody {
  return { ok: false, errorKey };
}

/** Build a successful mock body. */
export function mockSuccess<T>(data: T): MockSuccessBody<T> {
  return { ok: true, data };
}
