import { getLocales } from "expo-localization";

import { resolveTextDirection, sourceLocale } from "@/i18n/locales";

/**
 * Read layout direction from the current device locale (sync).
 * Prefer `textDirection` from expo-localization. Fall back to language-based RTL set.
 */
export function readDeviceTextDirection(): "ltr" | "rtl" {
  const device = getLocales()[0];
  return resolveTextDirection(device?.textDirection, device?.languageTag ?? sourceLocale);
}
