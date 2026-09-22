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
│   │   ├── _layout.tsx              # providers + NativeTabs
│   │   ├── index.tsx                # Explore tab
│   │   └── saved.tsx                # Saved tab
│   ├── screens/             # screen bodies + screen-local UI/hooks
│   │   ├── explore/
│   │   ├── saved/
│   │   └── tabs/messages.ts         # shared tab labels
│   ├── components/          # shared UI (incl. app-tabs)
│   ├── a11y/                # canonical react-native-a11y re-exports + helpers
│   ├── i18n/                # Lingui activate, format, error keys, bootstrap
│   ├── locales/             # message catalogs (.po) + native metadata JSON
│   ├── hooks/               # reusable hooks (shared across screens)
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

## Layer duties

| Layer            | Lives in                       | Does                                      | Does not                                               |
| ---------------- | ------------------------------ | ----------------------------------------- | ------------------------------------------------------ |
| Route            | `src/app/`                     | Read params, set options, render a screen | Feature UI, fetching, state                            |
| Screen           | `src/screens/<name>/index.tsx` | Compose header, list, boundaries, hooks   | Large inline subcomponents or dense logic              |
| Screen-local UI  | `src/screens/<name>/*.tsx`     | One UI piece for that screen              | Shared reuse across screens                            |
| Shared component | `src/components/<name>/`       | One reusable control or widget            | Screen orchestration or data hooks owned by one screen |
| Shared hook      | `src/hooks/`                   | Reusable query or domain hooks            | JSX                                                    |
| Screen hook      | `src/screens/<name>/use-*.ts`  | Screen-only state and effects             | Shared across unrelated screens                        |
| Helper           | colocated `.ts` or `utils/`    | Pure transforms                           | React hooks or UI                                      |

## Conventions (summary)

- File names: **kebab-case**
- Thin routes → `src/screens/…`
- Screen-only UI under that screen folder. Shared UI in `components/`
- Screen Lingui descriptors live in colocated `messages.ts` (see i18n rules in `AGENTS.md`)
- Export one primary component or hook per file
- Colocate unit tests next to the file. Put Maestro under `.maestro/` at repo root.
- Platform splits: `.ios` / `.android` / `.native` / `.web` with a default file
- Components and utilities: `export function` (not `const … = () =>`)
- Destructure props in the parameter list; use `...rest` for pass-through

Full rules: `AGENTS.md` → Project structure → Composition.
