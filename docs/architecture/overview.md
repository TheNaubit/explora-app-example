# Architecture overview

This page describes how Explora is structured. Update it when layering, data flow, or main libraries change.

## Runtime

- Expo / React Native (TypeScript) with Expo Router under `src/app/`
- Thin routes. Screen UI in `src/screens/`
- Shared UI in `src/components/`. Schemas in `src/schemas/`. Mocks in `src/mocks/`

## Data and validation

- Supplied catalog: `assets/activities.json`, loaded in `src/data/activities.ts`
- Seeded discovery catalog (1,012): `src/mocks/seed-catalog.ts` plus a catalog store
- Persisted refresh delta: MMKV in `src/mocks/catalog-store.ts`
- Runtime validation: Zod (`src/schemas/`), helpers in `src/utils/parse-with-schema.ts`
- Mocked network: `src/mocks/api.ts` (paginated list, get, refresh) plus review modes
- TanStack Query: list / detail / refresh hooks under `src/hooks/` and `src/query/`
- Local-first favorites and offline snapshots: Legend State + MMKV in `src/state/favorites.ts`
- Discovery search/filter (session): `src/state/discovery.ts`

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
