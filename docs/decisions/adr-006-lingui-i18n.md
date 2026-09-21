# ADR-006: Lingui and expo-localization for i18n

- Status: Accepted
- Date: 2026-09-21

## Context

The assessment does not require multiple languages. Shipping hardcoded English in every screen still makes later localization expensive. The app also needs stable mock error messages, native permission copy, RTL readiness, and device-correct number and date formatting.

## Decision

Adopt [Lingui](https://lingui.dev/introduction) for message catalogs and [expo-localization](https://docs.expo.dev/versions/latest/sdk/localization/) for device locale and RTL.

- Initial catalog locale: English only (`en`).
- No in-app language selector. Follow device / per-app language settings.
- Format numbers and dates with `Intl` using the device language tag (`@/i18n/format`).
- Enable RTL via the `expo-localization` config plugin (`supportsRTL: true`).
- Store app metadata and permission strings in `src/locales/native/{locale}.json`.
- Mocks return stable `errorKey` values. The UI localizes them.
- Lint unwrapped strings with `eslint-plugin-lingui` through Oxlint JS plugins. Do not add the ESLint CLI.

## Consequences

- Every screen, component, and feature must ship translated copy in the same change.
- Agents run `npm run lingui:extract` when messages change.
- Adding a language means a new catalog, a `locales` entry, and a native metadata file.
- Metro compiles `.po` catalogs at bundle time.
