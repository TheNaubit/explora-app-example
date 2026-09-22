import "@/i18n/polyfills";

import { i18n, type Messages } from "@lingui/core";
import { getLocales } from "expo-localization";

import { readDeviceTextDirection } from "@/i18n/device-direction";
import { resolveLocale, sourceLocale, type Locale } from "@/i18n/locales";
import { messages as enMessages } from "@/locales/en/messages.po";

const catalogLoaders: Record<Locale, () => Promise<Messages>> = {
  en: async () => {
    const catalog = await import("@/locales/en/messages.po");
    return catalog.messages;
  },
};

// Activate the source catalog at module load so the first paint has messages.
i18n.loadAndActivate({ locale: sourceLocale, messages: enMessages });

/**
 * Load the message catalog for a locale and activate it on the shared `i18n` instance.
 * Pass `formatLocales` so ICU formatting can follow the device language tag.
 */
export async function activateLocale(
  locale: Locale,
  formatLocales?: string | string[],
): Promise<Locale> {
  const load = catalogLoaders[locale] ?? catalogLoaders[sourceLocale];
  const messages = await load();
  i18n.loadAndActivate({
    locale,
    locales: formatLocales,
    messages,
  });
  return locale;
}

/**
 * Pick the catalog locale from device preferences and activate it.
 * Formatting (numbers, dates) still uses device tags via `@/i18n/format`.
 * When a catalog for the device language is not shipped yet, falls back to the source locale.
 * Layout direction still follows the device (see `readDeviceTextDirection`).
 */
export async function activateFromDevice(): Promise<{
  locale: Locale;
  direction: "ltr" | "rtl";
  languageTag: string;
}> {
  const device = getLocales()[0];
  const languageTag = device?.languageTag ?? sourceLocale;
  const locale = resolveLocale(device?.languageCode ?? languageTag);
  await activateLocale(locale, languageTag);

  return {
    locale,
    direction: readDeviceTextDirection(),
    languageTag,
  };
}

export { i18n };
