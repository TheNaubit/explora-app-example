# Internationalization

Explora keeps all user-facing copy in Lingui catalogs. Device locale drives catalog choice and `Intl` formatting. There is no in-app language selector.

## Status

| Area                        | Status                                      |
| --------------------------- | ------------------------------------------- |
| Lingui + expo-localization  | Shipped (English catalog only)              |
| RTL skeleton                | Shipped (`supportsRTL`, `LocaleProvider`)   |
| Native app metadata locales | Shipped (`src/locales/native/en.json`)      |
| Mock error keys             | Shipped (`src/i18n/error-keys.ts`)          |
| Extra UI languages          | Not shipped (add locale to `locales` array) |

## Stack

- Messages: [Lingui](https://lingui.dev/introduction) (`@lingui/core`, `@lingui/react`) via `@/i18n`.
- Device locale and RTL: [expo-localization](https://docs.expo.dev/versions/latest/sdk/localization/).
- Numbers and dates: `Intl` helpers in `@/i18n/format` using the device language tag.
- Catalogs: `src/locales/{locale}/messages.po`. Metro compiles `.po` with `@lingui/metro-transformer`.
- Babel: `@lingui/babel-plugin-lingui-macro` stays in root `plugins` in `babel.config.js`. Babel runs those plugins before `babel-preset-expo`, so macros expand before React Compiler (`experiments.reactCompiler`).
- Intl polyfills: `@formatjs/intl-locale` and `@formatjs/intl-pluralrules` via `/polyfill-force` (see [Lingui RN tutorial](https://lingui.dev/tutorials/react-native)). English plural locale data is loaded today. When you add a catalog locale, import that locale’s pluralrules data in `src/i18n/polyfills.ts`.
- Lint: `eslint-plugin-lingui` as an **Oxlint** JS plugin (not the ESLint CLI).
- After Lingui or Metro config changes, clear the Metro cache once: `npx expo start -c`.

## Project entry points

| Path                          | Role                                               |
| ----------------------------- | -------------------------------------------------- |
| `src/i18n/index.ts`           | Canonical exports                                  |
| `src/i18n/locales.ts`         | Supported locales, `resolveLocale`, `getDirection` |
| `src/i18n/activate.ts`        | Load catalog from device preferences               |
| `src/i18n/i18n-bootstrap.tsx` | Root `I18nProvider` bootstrap                      |
| `src/i18n/format.ts`          | Number, date, currency formatting                  |
| `src/i18n/error-keys.ts`      | Stable mock / API error keys                       |
| `src/locales/en/messages.po`  | English message catalog                            |
| `src/locales/native/en.json`  | App name and permission usage strings              |
| `src/mocks/result.ts`         | Mock success / failure shape with `errorKey`       |
| `lingui.config.ts`            | Extract configuration                              |

## Rules for every screen, component, and feature

1. Every user-facing string must go through Lingui macros (`Trans`, `t`, `msg`, `plural`).
2. Import runtime helpers from `@/i18n`. Import macros from `@lingui/react/macro` or `@lingui/core/macro`.
3. Do not hardcode UI copy in screens, components, alerts, or a11y labels.
4. Format numbers, dates, and currency with `@/i18n/format` (device settings). Do not hand-roll locale strings.
5. Use `plural` / `Plural` for count-dependent copy. Do not bake English plural rules into plain strings.
6. Add translator `comment` for short or ambiguous strings (see enhanced-message-context skill).
7. After you add or change messages, run `npm run lingui:extract` and commit the `.po` updates.
8. Mock and API errors return `errorKey` values from `errorKeys`. Never return a localized display string from the mock layer. Resolve keys in the UI with `resolveErrorMessage` + `t` / `i18n._`.
9. Put permission and app display names in `src/locales/native/{locale}.json` and register them under `locales` in `app.config.ts`. Expo `name` in `app.config.ts` may stay hardcoded.
10. Support RTL layout: use `start` / `end` flex values, set `textAlign: "left"` on text so it mirrors, and keep `supportsRTL: true`.
11. Do not add an in-app language picker. The OS / per-app language setting chooses the locale.
12. Treat missing i18n on new or changed UI as incomplete work.
13. Follow project Lingui skills: `lingui-best-practices`, `lingui-framework-setup`, `enhanced-message-context`, `find-unwrapped-strings`.

## Error keys (mocks)

```ts
import { mockFailure } from "@/mocks/result";
import { resolveErrorMessage } from "@/i18n";
import { useLingui } from "@lingui/react/macro";

// Mock / network layer
return mockFailure("errors.refreshFailed");

// UI layer
const { t } = useLingui();
const text = t(resolveErrorMessage(result.errorKey));
```

## Commands

```bash
npm run lingui:extract   # update .po catalogs
npm run i18n:check       # fail if catalogs drifted without extract
npx oxlint . --deny-warnings   # includes lingui/no-unlocalized-strings
```

## Related

- Library docs: [Lingui](https://lingui.dev/introduction)
- Expo localization: [guide](https://docs.expo.dev/guides/localization/) · [SDK](https://docs.expo.dev/versions/latest/sdk/localization/)
- ADR: [ADR-006 Lingui + expo-localization](../decisions/adr-006-lingui-i18n.md)
- Agent rules: root `AGENTS.md`
