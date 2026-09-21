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

- StyleSheet only. Support light and dark mode.
- Lists: Legend List. Keyboard: `react-native-keyboard-controller`
- Native UI: `expo-ui` and `expo-symbols` when needed

## Related pages

- [Product overview](../product/overview.md)
- [Project structure](./project-structure.md)
- [Decisions](../decisions/index.md)
- Stack rules: root `AGENTS.md`
