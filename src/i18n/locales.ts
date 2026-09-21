/** App message catalogs. Add a locale here when you ship translations. */
export const locales = ["en"] as const;

export type Locale = (typeof locales)[number];

/** Source language for message IDs and fallback catalog. */
export const sourceLocale: Locale = "en";

const RTL_LANGUAGE_CODES = new Set(["ar", "he", "fa", "ur"]);

/**
 * Resolve a device language tag to a supported catalog locale.
 * Falls back to the source locale when the device language is not shipped yet.
 */
export function resolveLocale(candidate: string | null | undefined): Locale {
  if (!candidate) {
    return sourceLocale;
  }

  if ((locales as readonly string[]).includes(candidate)) {
    return candidate as Locale;
  }

  const base = candidate.split("-")[0];
  if ((locales as readonly string[]).includes(base)) {
    return base as Locale;
  }

  return sourceLocale;
}

/**
 * Layout direction for a language tag or catalog locale.
 * Use for Expo Router `LocaleProvider` and RTL layout rules.
 */
export function getDirection(locale: string): "ltr" | "rtl" {
  const base = locale.split("-")[0]?.toLowerCase() ?? sourceLocale;
  return RTL_LANGUAGE_CODES.has(base) ? "rtl" : "ltr";
}

/** Language display name in that language (for future selectors; app has none). */
export function localeDisplayName(locale: string): string {
  return new Intl.DisplayNames([locale], { type: "language" }).of(locale) ?? locale;
}
