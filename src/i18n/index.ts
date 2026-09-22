/**
 * Canonical i18n entry. Import from `@/i18n` in app code.
 * Do not invent a second localization stack.
 * Docs: `docs/features/internationalization.md` and root `AGENTS.md`.
 * Library: https://lingui.dev/introduction
 * Device locale: https://docs.expo.dev/versions/latest/sdk/localization/
 */

export { activateFromDevice, activateLocale, i18n } from "@/i18n/activate";
export {
  errorKeys,
  errorMessages,
  isErrorKey,
  resolveErrorMessage,
  type ErrorKey,
} from "@/i18n/error-keys";
export { formatCurrency, formatDate, formatNumber, getFormatLocale } from "@/i18n/format";
export { I18nBootstrap } from "@/i18n/i18n-bootstrap";
export { readDeviceTextDirection } from "@/i18n/device-direction";
export {
  getDirection,
  localeDisplayName,
  locales,
  resolveLocale,
  resolveTextDirection,
  sourceLocale,
  type Locale,
} from "@/i18n/locales";
