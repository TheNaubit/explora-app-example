# Project structure

Canonical layout for Explora. Coding rules stay in root `AGENTS.md`. This page is the folder map.

Based on [Expo folder-structure best practices](https://expo.dev/blog/expo-app-folder-structure-best-practices).

## Tree

```text
├── assets/                  # images, activities.json (not under src/)
├── scripts/
├── docs/                    # technical wiki — start at INDEX.md
├── src/
│   ├── app/                 # Expo Router routes only (thin)
│   ├── screens/             # screen bodies (+ screen-local components)
│   ├── components/          # shared UI (incl. a11y-* wrappers, screen-frame)
│   ├── a11y/                # canonical react-native-a11y re-exports + helpers
│   ├── hooks/
│   ├── utils/
│   ├── schemas/             # Zod
│   ├── data/                # catalog loaders
│   ├── mocks/               # client-side API mocks
│   ├── types/               # re-exports when needed
│   ├── state/               # persistence stores when added
│   └── theme.ts             # StyleSheet tokens (light + dark)
├── app.config.ts
├── eas.json                 # if present
└── package.json
```

Do not add Expo Router `+api` or `server/` for this assessment. Keep mocks on the client.

## Conventions (summary)

- File names: **kebab-case**
- Thin routes → `src/screens/…`
- Screen-only UI under that screen folder. Shared UI in `components/`
- Colocate unit tests next to the file. Put Maestro under `.maestro/` at repo root.
- Platform splits: `.ios` / `.android` / `.native` / `.web` with a default file
- Components and utilities: `export function` (not `const … = () =>`)
- Destructure props in the parameter list; use `...rest` for pass-through

Full rules: `AGENTS.md` → Project structure.
