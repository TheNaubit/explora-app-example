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
# 1. Install the locked dependencies and set up Husky hooks
npm ci

# 2. Build a development client (local EAS; first run can take a long time)
npm run build:ios:dev:simulator
# or: npm run build:android:dev:emulator

# 3. Install the artifact, then start Metro for the dev client
npm run start:dev-client
```

Install the generated iOS `.app` with `xcrun simctl install`.

Install the generated Android `.apk` with `adb install -r`.

See [`docs/operations/eas-local-builds.md`](./docs/operations/eas-local-builds.md) for complete installation commands.

---

## Useful scripts

| Script                                | Purpose                                  |
| ------------------------------------- | ---------------------------------------- |
| `npm start`                           | Start Expo / Metro                       |
| `npm run start:dev-client`            | Metro for a development build            |
| `npm run build:ios:dev:simulator`     | Local EAS iOS Simulator (dev client)     |
| `npm run build:ios:prod:simulator`    | Local EAS iOS Simulator release app      |
| `npm run build:android:prod:device`   | Local EAS release APK (assessment)       |
| `npm run lint`                        | Oxlint (deny warnings)                   |
| `npm run fix`                         | Oxlint `--fix` (deny warnings) + Oxfmt   |
| `npm run format`                      | Oxfmt only                               |
| `npm test -- --runInBand`             | Complete Jest suite                      |
| `npm run i18n:check`                  | Lingui catalog verification              |
| `npm run test:e2e:syntax`             | Validate all Maestro flow files          |
| `npm run test:e2e:assessment:ios`     | Required iOS core and recovery flows     |
| `npm run test:e2e:assessment:android` | Required Android core and recovery flows |
| `npx tsc --noEmit`                    | TypeScript check                         |

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
- The normal catalog uses those 12 activities only
- Dev Tools can add 1,000 deterministic local activities for the performance case
- Network calls are mocked (TanStack Query + local mocks). Validate payloads with Zod
- Use the **Dev Tools** tab for success, slow, and failure request modes.
- Use **Reset local data** in Dev Tools to restore the local assessment baseline.

## Reproduce review states

Open the **Dev Tools** tab in an installed development or release build.

### Successful loading

1. Set **First catalog load** to **Normal**.
2. Select **Clear request cache**.
3. Open **Explore**.
4. Confirm that the 12 supplied activities load.

### Slow loading

1. Set **First catalog load** to **Slow**.
2. Open **Explore**.
3. Confirm that the catalog skeleton remains visible during the 10-second delay.
4. Confirm that the catalog then loads.

Use the same **Slow** mode for activity detail, later-page loading, and refresh checks.

### Failed loading and recovery

1. Set **First catalog load** to **Offline**, **Timeout**, or **Invalid data**.
2. Open **Explore**.
3. Confirm that the full recovery state appears.
4. Set the mode to **Normal**.
5. Use the recovery action.
6. Confirm that the catalog loads without an Expo render overlay.

### Failed and successful refresh

1. Select **Reset local data** and confirm the action.
2. Confirm that the catalog count is 12.
3. Set **Refresh** to **Offline** or **Timeout**.
4. Pull Explore past the refresh threshold.
5. Confirm that the count stays at 12.
6. Set **Refresh** to **Success**.
7. Pull Explore again.
8. Confirm that the count becomes 13.

### Performance catalog

1. Select **Performance (1,012)** in Dev Tools.
2. Open Explore.
3. Exercise scrolling, search, filtering, detail, and favorite actions.
4. Select **Supplied (12)** to return to the normal catalog.

### Reset local data

Select **Reset local data** in Dev Tools and confirm the action.

The reset clears generated refresh activities, favorites, discovery filters, and the request cache.

It also restores the 12 supplied activities.

Select **Reset request modes** separately to restore normal loads and successful refresh.

## Run verification

Run the complete local checks:

```bash
npx expo-doctor
npx oxlint --deny-warnings --format=agent
npx oxfmt --check
npx tsc --noEmit
npm run i18n:check
npm test -- --runInBand
npm run test:e2e:syntax
```

Run the required automated mobile scenarios:

```bash
npm run test:e2e:assessment:ios
npm run test:e2e:assessment:android
```

Run all platform flows only when you have enough time. Each complete release suite takes about eleven minutes.

```bash
npm run test:e2e:ios
npm run test:e2e:android
```

Maestro reports go to `artifacts/maestro/`.

## Verified platforms

| Platform        | Verified target                     | Artifact result                                       |
| --------------- | ----------------------------------- | ----------------------------------------------------- |
| iOS             | iPhone 18 Pro Simulator, iOS 27.0   | Release app passed 9 of 9 Maestro flows without Metro |
| Android         | Android 16 emulator, API 36         | Release APK passed 8 of 8 Maestro flows without Metro |
| Physical iPhone | iPhone 14 Pro Max development build | Main VoiceOver journey passed                         |

The Android release also passed the core journey with dark mode, a 2.0 font scale, and networking disabled.

Simulator and emulator results do not prove physical-device haptic strength.

---

## Documentation map

| Audience                    | Start here                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| Humans (setup + goals)      | This README                                                                                |
| AI agents (rules)           | [`AGENTS.md`](./AGENTS.md)                                                                 |
| Product / architecture wiki | [`docs/INDEX.md`](./docs/INDEX.md)                                                         |
| Assessment requirements     | [`docs/assessment/requirements.md`](./docs/assessment/requirements.md)                     |
| Decisions and evidence      | [`docs/assessment/decisions-and-evidence.md`](./docs/assessment/decisions-and-evidence.md) |
| AI session records          | [`AI_SESSION.md`](./AI_SESSION.md)                                                         |

Write wiki pages and agent-facing docs in Simplified Technical English (see `AGENTS.md` and `docs/meta/simplified-technical-english.md`).

---

## Current status

The core journey, refresh, favorites, native calendar, and Dev Tools are implemented.

The Android APK and iOS Simulator release app are built and verified. See [`docs/verification/artifacts.md`](./docs/verification/artifacts.md).

The before and after improvement evidence is complete. See [`docs/verification/improvement-native-feedback.md`](./docs/verification/improvement-native-feedback.md).

The technical release note is complete. See [`docs/operations/release-note.md`](./docs/operations/release-note.md).

The final presentation was recorded for the assessment submission.

The user completed the VoiceOver main journey on a physical iPhone development build.

The current iOS release archive passed the complete EventKit permission, cancellation, and save flow.

---

## License / sharing

Assessment project shared for technical review.

Do not publish store builds from this README alone.

Follow `docs/assessment/requirements.md` when you produce Android or iOS review artifacts.
