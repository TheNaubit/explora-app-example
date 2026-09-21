import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";

/**
 * Stable API / mock error keys.
 * Mocks and network layers return these keys, never localized display strings.
 * Resolve with `t(errorMessages[key])` or `i18n._(errorMessages[key])` in the UI.
 */
export const errorKeys = [
  "errors.networkTimeout",
  "errors.networkOffline",
  "errors.refreshFailed",
  "errors.validationFailed",
  "errors.unknown",
] as const;

export type ErrorKey = (typeof errorKeys)[number];

/** Message descriptors keyed by the stable error key returned from mocks. */
export const errorMessages = {
  "errors.networkTimeout": msg({
    id: "errors.networkTimeout",
    comment: "Shown when a mocked or network request times out",
    message: "The request took too long. Try again.",
  }),
  "errors.networkOffline": msg({
    id: "errors.networkOffline",
    comment: "Shown when the device has no network for a fetch that needs it",
    message: "You are offline. Check your connection and try again.",
  }),
  "errors.refreshFailed": msg({
    id: "errors.refreshFailed",
    comment: "Shown when refresh fails and no new activity is added",
    message: "Refresh failed. No new activity was added.",
  }),
  "errors.validationFailed": msg({
    id: "errors.validationFailed",
    comment: "Shown when a Zod-validated payload is invalid",
    message: "The data from the server was invalid.",
  }),
  "errors.unknown": msg({
    id: "errors.unknown",
    comment: "Fallback when an error key is missing or unrecognized",
    message: "Something went wrong. Try again.",
  }),
} as const satisfies Record<ErrorKey, MessageDescriptor>;

/** True when the value is a known error key. */
export function isErrorKey(value: string): value is ErrorKey {
  return (errorKeys as readonly string[]).includes(value);
}

/**
 * Resolve an error key to a message descriptor.
 * Unknown keys fall back to `errors.unknown`.
 */
export function resolveErrorMessage(key: string): MessageDescriptor {
  if (isErrorKey(key)) {
    return errorMessages[key];
  }

  return errorMessages["errors.unknown"];
}
