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

### Agent checks (during development)

Agents must not wait for the commit hook alone. After a change batch, run:

1. `npx oxlint --fix --deny-warnings --format=agent`
2. `npx oxfmt` (or `npm run fix`)
3. `npx tsc --noEmit`

`--format=agent` gives structured output so the agent can fix issues without a human.

## Data

- Supplied catalog: `assets/activities.json` (validated on load)
- Reset of local persisted data: _(document when persistence exists)_
- Success, fail, and slow mock loading: _(document when the mock API layer exists)_

## Related

- [Architecture overview](../architecture/overview.md)
- Assessment reproducibility rules: root `AGENTS.md`
