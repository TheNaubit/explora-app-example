# Local development and review ops

Practical notes for local run and review. Keep this page aligned with the root README when that file exists for submission.

## Stack commands

See `AGENTS.md` (npm and Expo commands). Prefer `npm run lint` and `npm run fix` for full-tree checks.

### Git hooks

- `prepare` runs Husky after `npm install`.
- Pre-commit runs `lint-staged` (`lint-staged.config.mjs`).
- Staged JS/TS: `oxlint --fix --deny-warnings`, then `oxfmt`.
- Staged `.ts` / `.tsx`: also run `npx tsc --noEmit` once for the project.
- Staged JSON/Markdown: `oxfmt`.
- The commit stops if lint warnings, lint errors, or TypeScript errors remain.
- Commit-msg runs Commitlint with `@commitlint/config-conventional`.
- Messages must follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) (`commitlint.config.mjs`, ADR-013).

### Agent checks (during development)

Agents must not wait for the commit hook alone. After a change batch, run:

1. `npx oxlint --fix --deny-warnings --format=agent`
2. `npx oxfmt` (or `npm run fix`)
3. `npx tsc --noEmit`

`--format=agent` gives structured output so the agent can fix issues without a human.

## Lingui / Metro

- After you change `babel.config.js`, `metro.config.js`, or Lingui packages, clear the Metro cache: `npx expo start -c`.
- Catalog extract: `npm run lingui:extract`.

## Data

- Supplied catalog: `assets/activities.json` (validated on load)
- Seeded discovery catalog: 1,012 activities via `src/mocks/seed-catalog.ts`
- Reset in-memory catalog: `import { resetCatalog } from "@/mocks/catalog-store"`
- Reset review modes: `import { resetReviewModeState } from "@/mocks/review-mode"`
- Clear favorites: `import { clearFavorites } from "@/state/favorites"`
- Reset discovery filters: `import { resetDiscoveryFilters } from "@/state/discovery"`

### Review modes (mock API)

Until `ReviewControlsSheet` exists, set modes from the module API:

```ts
import {
  setInitialLoadMode,
  setPageLoadMode,
  setRefreshMode,
  resetReviewModeState,
} from "@/mocks/review-mode";
import { resetCatalog } from "@/mocks/catalog-store";

setInitialLoadMode("slow"); // normal | slow | fail (first list page + get)
setPageLoadMode("fail"); // normal | slow | fail (later list pages)
setRefreshMode("fail"); // success | slow | fail
resetCatalog();
resetReviewModeState();
```

| Mode             | Initial load (first page / get) | Page load (later pages)   | Refresh                              |
| ---------------- | ------------------------------- | ------------------------- | ------------------------------------ |
| Normal / success | Short delay, returns data       | Short delay, returns page | Short delay, appends one activity    |
| Slow             | ~2.5s delay, then success       | ~2.5s delay, then success | ~2.5s delay, then success (+1)       |
| Fail             | `errors.networkOffline`         | `errors.networkOffline`   | `errors.refreshFailed`; adds nothing |

## Related

- [EAS local builds](./eas-local-builds.md) — profiles and `npm run build:*` scripts
- [Architecture overview](../architecture/overview.md)
- [Mock API](../features/mock-api.md)
- Assessment reproducibility rules: root `AGENTS.md`
