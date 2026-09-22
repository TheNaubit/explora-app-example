# Explora

Explora is a React Native (Expo) mobile app for **Android** and **iOS**.  
Users browse activities, open details, and save favorites for later — including offline.

This repository is a technical assessment build. It must run locally without external accounts, API keys, or hosted services.

---

## Goals

**Core journey:** browse → search / filter → open detail → save favorite → open again later (offline).

**Must support (summary)**

- Discovery: search by title, filter by category, keep filters after detail
- Favorites: persist across relaunch; details available offline
- Refresh: each **successful** refresh adds **one** generated activity; failures add nothing
- Clear loading, empty, error, and recovery states
- Safe behavior across background / resume / delayed results
- Accessibility for the main journey
- One native device capability (with permission, cancel, and invalid-input cases)
- Performance with **≥1,000** local activities and release-build evidence
- One documented improvement with before/after evidence

**Out of scope:** real backend, login, payments, multi-device sync, store publication.

Full requirements: [`docs/assessment/requirements.md`](./docs/assessment/requirements.md)  
Hard constraints for agents: [`AGENTS.md`](./AGENTS.md)

---

## Requirements

| Item            | Value                                        |
| --------------- | -------------------------------------------- |
| Node.js         | `>=24.14.0` (see `package.json` → `engines`) |
| Package manager | **npm** only (do not use yarn, pnpm, or bun) |
| Platforms       | iOS and Android (Expo)                       |
| Language        | TypeScript                                   |

You need an iOS Simulator and/or Android emulator (or a development build on a device) to run the app.

Native modules need a **local EAS build**. Expo Go alone is not enough. Full guide: [`docs/operations/eas-local-builds.md`](./docs/operations/eas-local-builds.md).

---

## Quick start

```bash
# 1. Install dependencies (also sets up Husky git hooks via `prepare`)
npm install

# 2. Build a development client (local EAS; first run can take a long time)
npm run build:ios:dev:simulator
# or: npm run build:android:dev:emulator

# 3. Install the artifact, then start Metro for the dev client
npm run start:dev-client
```

---

## Useful scripts

| Script                              | Purpose                                |
| ----------------------------------- | -------------------------------------- |
| `npm start`                         | Start Expo / Metro                     |
| `npm run start:dev-client`          | Metro for a development build          |
| `npm run build:ios:dev:simulator`   | Local EAS iOS Simulator (dev client)   |
| `npm run build:android:prod:device` | Local EAS release APK (assessment)     |
| `npm run lint`                      | Oxlint (deny warnings)                 |
| `npm run fix`                       | Oxlint `--fix` (deny warnings) + Oxfmt |
| `npm run format`                    | Oxfmt only                             |
| `npx tsc --noEmit`                  | TypeScript check                       |

All `build:*` scripts use **local EAS**. See [`docs/operations/eas-local-builds.md`](./docs/operations/eas-local-builds.md).

**Pre-commit:** Husky runs lint-staged (oxlint, oxfmt, and `tsc` when TypeScript files are staged).

**Agents:** after a change batch, run oxlint with `--format=agent`, then format and `tsc`. See `AGENTS.md`.

---

## Project layout (short)

```text
assets/activities.json   # Supplied catalog (12 activities) — do not drop these
src/app/                 # Expo Router routes (thin)
src/screens/             # Screen UI
src/components/          # Shared UI
src/schemas/             # Zod schemas
src/data/                # Catalog loaders
src/mocks/               # Client-side API mocks (as built)
docs/                    # Technical wiki — start at docs/INDEX.md
AGENTS.md                # Always-on rules for AI agents
AI_SESSION.md            # Index of AI sessions for the assessment
```

Details: [`docs/architecture/project-structure.md`](./docs/architecture/project-structure.md)

---

## Data and mocks

- Supplied dataset: `assets/activities.json` (12 activities, stable IDs)
- Keep those 12 intact. Generate more local activities for the ≥1,000 performance case
- Network calls are mocked (TanStack Query + local mocks). Validate payloads with Zod
- Success / fail / slow load modes: document here and in [`docs/operations/local-dev.md`](./docs/operations/local-dev.md) when the mock layer exists
- Reset local persisted data: document in ops when persistence exists

---

## Documentation map

| Audience                    | Start here                                                             |
| --------------------------- | ---------------------------------------------------------------------- |
| Humans (setup + goals)      | This README                                                            |
| AI agents (rules)           | [`AGENTS.md`](./AGENTS.md)                                             |
| Product / architecture wiki | [`docs/INDEX.md`](./docs/INDEX.md)                                     |
| Assessment requirements     | [`docs/assessment/requirements.md`](./docs/assessment/requirements.md) |
| AI session records          | [`AI_SESSION.md`](./AI_SESSION.md)                                     |

Write wiki pages and agent-facing docs in Simplified Technical English (see `AGENTS.md` and `docs/meta/simplified-technical-english.md`).

---

## Current status

Scaffold and foundations are in place (structure, Zod catalog load, wiki, lint/format hooks).  
Discovery list, favorites, refresh, native capability, and submission artifacts are **not** complete yet. See [`docs/features/index.md`](./docs/features/index.md).

---

## License / sharing

Private assessment project. Do not publish store builds from this README alone. Follow the assessment delivery rules in `docs/assessment/requirements.md` when you produce APK / iOS Simulator artifacts.
