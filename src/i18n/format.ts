import { getCalendars, getLocales } from "expo-localization";

/**
 * Device locale tag for `Intl` number and date formatting.
 * Always follows device settings. Do not tie this to the message catalog locale alone.
 * There is no in-app language selector.
 */
export function getFormatLocale(): string {
  return getLocales()[0]?.languageTag ?? "en-US";
}

/** Format a number with the device locale. */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(getFormatLocale(), options).format(value);
}

/** Format a date with the device locale and calendar preferences when useful. */
export function formatDate(value: Date, options?: Intl.DateTimeFormatOptions): string {
  const calendar = getCalendars()[0];
  const hour12 = calendar?.uses24hourClock == null ? undefined : !calendar.uses24hourClock;

  return new Intl.DateTimeFormat(getFormatLocale(), {
    ...options,
    ...(hour12 === undefined ? {} : { hour12 }),
  }).format(value);
}

/** Format a currency amount with the device locale. Pass an ISO currency code. */
export function formatCurrency(
  value: number,
  currencyCode: string,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(getFormatLocale(), {
    style: "currency",
    currency: currencyCode,
    ...options,
  }).format(value);
}
