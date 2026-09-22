# Architecture overview

This page describes how Explora is structured. Update it when layering, data flow, or main libraries change.

## Runtime

- Expo / React Native (TypeScript) with Expo Router under `src/app/`
- Thin routes. Screen UI in `src/screens/`
- Shared UI in `src/components/`. Schemas in `src/schemas/`. Mocks in `src/mocks/`

## Data and validation

- Supplied catalog: `assets/activities.json`, loaded in `src/data/activities.ts`
- Runtime validation: Zod (`src/schemas/`), helpers in `src/utils/parse-with-schema.ts`
- Mocked network plus TanStack Query (production shape, no real backend)
- Local-first favorites and offline: Legend State plus MMKV (document stores here when you add them)

## UI and platform

- Design contract: root [`DESIGN.md`](../../DESIGN.md)
- Theme tokens: `src/theme.ts`, with system light and dark themes
- StyleSheet only. Support light and dark mode.
- Lists: Legend List. Soft keyboard: `react-native-keyboard-controller`
- Accessibility: [`react-native-a11y`](https://github.com/ArturKalach/react-native-a11y) via `@/a11y` and `ScreenFrame` / `a11y-*` wrappers. See [accessibility](../features/accessibility.md).
- Internationalization: [Lingui](https://lingui.dev/introduction) + [expo-localization](https://docs.expo.dev/versions/latest/sdk/localization/) via `@/i18n`. See [internationalization](../features/internationalization.md).
- Native UI: `expo-ui` and `expo-symbols` when needed

## Related pages

- [Product overview](../product/overview.md)
- [Project structure](./project-structure.md)
- [Decisions](../decisions/index.md)
- Stack rules: root `AGENTS.md`
