# Explora — agent guide

This is an Expo/React Native mobile application (TypeScript). Prioritize mobile-first patterns, performance, and cross-platform compatibility.

**Product:** Explora — discover activities and save favorites to revisit later, including offline. Agents must treat the assessment contract below as binding. Do not invent backends, logins, payments, multi-device sync, or store publication unless explicitly asked.

**Do not modify third-party skill packs** under `.agents/skills/`, `.claude/skills/`, or similar vendored skill directories. Read and follow those skills; never edit, reformat, or “improve” them. Project-specific agent instructions belong only in root files such as `AGENTS.md` / `CLAUDE.md`.

---

## Assessment contract

Reviewers assess product judgment, technical decisions, and **verification with evidence** — not hours spent or feature count.

### Product goal

**Core journey:** browse the catalog → search / filter → open details → save for later → reopen later, including offline.

### Dataset and data rules

**Supplied catalog (required source of truth):** use the supplied `activities.json` (`schemaVersion: 1`). It contains **12** fictional activities with stable fields:

| Field             | Notes                                             |
| ----------------- | ------------------------------------------------- |
| `id`              | Stable string IDs (`act-001` … `act-012`)         |
| `title`           | Searchable                                        |
| `description`     | Detail copy                                       |
| `category`        | Filterable: Outdoors, Culture, Workshops, Leisure |
| `location`        | Display only unless a native feature needs it     |
| `durationMinutes` | Number                                            |

**Never replace or drop these 12.** They must remain in the catalog with their original IDs and content.

**Performance scale (≥1,000 activities):** discovery must demonstrate scrolling, search, and interaction with at least 1,000 **locally generated** activities. Keep the original 12 as the base; generate additional items in the same shape with unique stable IDs. Defaulting discovery to ~1,012 items (12 + generated) is acceptable. Document dataset size, generation method, and how to reset local data in the README. This is **not** the same as refresh (refresh adds one activity per successful run).

**Mocked network (no real backend):** build as if production — perform “network requests” but mock API responses locally. No external accounts, API keys, or hosted services. Make **successful**, **failed**, and **slow** loading reproducible for review and document how in the README.

### Required capabilities

- **Discovery:** browse; search by title; filter by category; combine search + filter; return from detail without losing search/filter.
- **Favorites:** save/remove; view saved items; persist across close/reopen; saved details remain available offline.
- **Refresh and recovery:** each successful refresh adds **exactly one** randomly generated activity with a unique stable ID; previous items and favorites stay intact; failed refreshes add nothing; clear loading / empty / error / recovery; new activities support the same actions as the catalog.
- **Lifecycle:** background, resume, and delayed results must not silently lose or reverse user changes.
- **Usability / a11y:** usable navigation, keyboard behavior, larger text, screen-reader access for the main journey.
- **Native capability:** implement one useful device integration (deep links, local notifications, camera, microphone, location, etc.). Demonstrate permission, cancellation, and invalid-input cases. Prefer something verifiable without external services.
- **Performance evidence:** one measurement or profiling capture from a **release** build (device/emulator, build, dataset, reproduction steps). Explain result and limitations — “feels fast” is insufficient.
- **Part 2 — one improvement:** choose one concrete mobile problem, explain why it matters, improve it, show reproducible before → after evidence. May address a core requirement; extra features are not required. State limitations.

### Out of scope

Real backend/hosted APIs; login; payments; multi-device sync; App Store / Play Store publication; claiming platform support without a runnable artifact and verification.

### Verification

**Scenarios (6–8)** with steps, expected behavior, observed results, and evidence. Together cover: core journey, generated-item refresh, persistence/offline favorites, failure recovery, lifecycle interruptions, native capability, performance (≥1k), accessibility. Related checks may share a scenario.

**Automated tests (minimum two):** one core behavior; one failure or recovery case. Explain what they verify and what remains untested.

**Demo:** video up to 10 minutes total, or deck/document up to 15 slides/pages with a short app recording. Cover core journey, native capability, failure recovery, improvement, and key decisions.

**AI session file (required):** maintain `AI_SESSION.md` as the index of AI usage for this assessment.

- List sessions/tools/models when known; link transcript or summary files.
- Submit only assessment-related material; redact secrets and unrelated personal info; mark omissions. Do not submit an entire account archive.
- If a verbatim export is unavailable, produce an **“AI-generated session summary, not a verbatim transcript”** using the assessment’s session-summary prompt; review for accuracy; never present a summary as the original log.
- If AI was not used, `AI_SESSION.md` must state that briefly.
- Non-English transcripts need an English summary labeled as translation/summary.
- Agents should assume Explora-related conversations may need to be reflected in `AI_SESSION.md` before submission.

### Delivery and distribution

| Platform | Artifact                    | Notes                             |
| -------- | --------------------------- | --------------------------------- |
| Android  | APK                         | Runs without Metro / Expo Go      |
| iOS      | Simulator `.app` (archived) | Runs without a development server |

Document for each: target OS/architecture, build configuration, app version, commit. Install and test artifacts; record results separately for Android and iOS (launch, core journey, offline favorites, native capability). Note simulator limitations. A JavaScript bundle alone or an Expo Go session is **not** a valid app artifact.

If one platform cannot be built: say so early; deliver and verify the available platform; for the other provide configuration, exact reproduction steps, and the blocker; label it **unverified**. Do not claim support from source alone.

**Release note (short):** distinguish review artifacts from store/device distribution; cover signing approach (no secrets), versioning, pre-release checks, and response to a faulty release.

**Final package:** GitHub repo (source, dataset, tests, dependencies, submitted commit — ZIP alone is insufficient); README (setup, run, test, verified platforms, success/fail/slow load reproduction, reset local data); decisions and evidence; build artifacts + release note; async presentation; `AI_SESSION.md` (+ linked files). Write submission materials in English. Avoid duplicating the same explanation across many files.

### Agent working principles for this assessment

1. Correctness and clarity over scope creep — extras only if they strengthen the story.
2. Evidence first — offline, refresh failure, lifecycle, perf, native, and improvement claims need reproducible paths and observed results.
3. Preserve user state — search/filter, favorites, and in-flight actions survive navigation, backgrounding, and late responses.
4. Local-only reproducibility — no accounts or cloud services required for review scenarios.
5. Ship real artifacts — plan for release APK and iOS Simulator `.app`, not only Metro.
6. Record AI usage honestly — never invent transcript content.
7. Ask early if a platform or capability cannot be built/verified in the available environment.

---

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

This project uses **npm** only (no yarn, pnpm, or bun) so the demo is easy to share and run. Prefer `npx` for tooling.

If a different workspace ever has a `bun.lock`, use `bunx` instead of `npx` there — not in this assessment app.

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there becomes a route; `_layout.tsx` files define navigators.
- Keep routes thin: handle route-only concerns there (params, navigation options) and render a screen from `src/screens/`. Keep non-route code (components, hooks, utils, screens, state, mocks) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Project structure

Follow Expo’s folder-structure best practices ([expo.dev/blog/expo-app-folder-structure-best-practices](https://expo.dev/blog/expo-app-folder-structure-best-practices)). Also load the project skill `expo-project-structure` when scaffolding or reorganizing.

### Layout

Use `/src` so application code is separate from root config (`app.json`, `eas.json`, `package.json`, etc.). Target structure:

```bash
├── assets/
├── scripts/
├── src/
│   ├── app/                 # Expo Router routes only (thin)
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── …
│   ├── screens/             # Screen UI composed here; routes re-export these
│   │   ├── home/
│   │   │   ├── components/  # home-only UI pieces
│   │   │   └── index.tsx
│   │   └── …
│   ├── components/          # Reusable UI across screens
│   │   ├── button.tsx
│   │   └── table/
│   │       ├── cell.tsx
│   │       └── index.tsx
│   ├── hooks/
│   ├── utils/
│   ├── constants.ts         # or constants/
│   └── theme.ts             # shared colors/spacing/typography tokens for StyleSheet
├── app.json
├── eas.json
└── package.json
```

Additional folders as needed (still under `src/`, never as routes): e.g. `state/`, `api/` or `mocks/` for TanStack Query + mocked responses, `types/`, `features/`. Do **not** invent Expo Router `+api` / `server/` code for this assessment — there is no real backend; keep mocks on the client.

### Conventions

- **Filenames:** prefer **kebab-case** (Expo’s current default recommendation, e.g. `activity-card.tsx`). Stay consistent.
- **Components:** one primary named export per file. For multi-file components, use a folder with `index.tsx` as the public entry so the import path stays stable.
- **Screens vs components:** screen-specific UI that is not reused elsewhere lives under `src/screens/<name>/`, not in `src/components/`. Shared primitives go in `src/components/`.
- **Routes:** `src/app/*.tsx` should mostly import and render a screen, e.g. `return <Home />` from `@/screens/home` (or the project’s path alias).
- **Hooks / utils:** reusable hooks in `src/hooks/`, small standalone helpers in `src/utils/`.
- **Platform-specific code:** small differences via `Platform.select` / `Platform.OS`. Larger splits use platform extensions (`.ios.tsx`, `.android.tsx`, `.native.tsx`, `.web.tsx`) with identical props; always keep a default (non-suffixed) file. Import without the platform suffix.
- **Unit tests:** colocate next to the file under test (`format-date.ts` + `format-date.test.ts`). Prefer that over a separate `__tests__/` tree unless a tool requires otherwise.
- **E2E (Maestro):** keep Maestro flows outside `src/app/` (e.g. `.maestro/` at the repo root).

### Styling

- **Light and dark mode are mandatory.** Every screen and shared component must look correct in both appearances. Follow the system color scheme by default (`userInterfaceStyle: "automatic"`). Provide light and dark tokens in `src/theme.ts` (or equivalent) and select colors from the active scheme — do not hard-code a single-mode palette in UI. Verify both modes when building or changing UI.
- Use React Native **`StyleSheet` only** (plus normal inline styles when truly dynamic).
- Keep `StyleSheet.create({ … })` at the **bottom of the same component file** — do not split into `*.styles.ts` files.
- Shared design tokens (colors, spacing, type scale) may live in `src/theme.ts` (or similar) and be referenced from StyleSheets.
- **Do not** add or use Uniwind, NativeWind, Unistyles, Tamagui, or other third-party styling systems.

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `npx eas-cli@latest <command>` in this npm project (or `bunx eas-cli <command>` only in Bun projects); substitute that for bare `eas` in docs examples.

For this assessment, local release artifacts (Android APK and iOS Simulator `.app`) that run without a development server are required; EAS is optional when it helps produce or document those artifacts.

Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Linting and formatting

- After making code changes, run `npx oxlint --fix`, then run `npx oxfmt`.
- Before finishing, run `npx oxlint --deny-warnings --format=agent` (or `npm run lint` / `npm run fix`).
- Config lives in `oxlint.config.mjs`. It loads **eslint-plugin-sonarjs** as an Oxlint JS plugin (Sonar-style rules). Recommended SonarJS rules are enabled except **type-aware** ones, which Oxlint’s JS plugin API does not support yet. Do not reintroduce a separate ESLint Sonar setup unless type-aware rules become necessary and supported.
- Third-party skill trees (`.agents/`, `.claude/`) are ignored via `.eslintignore` — never “fix” those files to silence lint.

## Best practices

- Styling: React Native `StyleSheet` only (colocated at the bottom of the component file). No Uniwind, NativeWind, Unistyles, or similar. See **Project structure → Styling** above.
- Always support **light and dark mode** (system appearance). Theme tokens must include both palettes; UI must not be light-only or dark-only.
- For local state and offline usage (local-first), we use Legend State v3 with `react-native-mmkv`. Docs: https://legendapp.com/open-source/state/v3/intro/introduction/ and https://legendapp.com/open-source/state/v3/sync/persist-sync/#mmkv-rn
- For lists, we use Legend List. Docs: https://legendapp.com/open-source/list/v3/react-native/getting-started/ and https://legendapp.com/open-source/list/v3/react-native/keyboard-and-animated/
- For handling the keyboard, we use `react-native-keyboard-controller`. We must always use at least version `1.21.7` since Legend List’s `KeyboardAwareLegendList` requires at least that version.
- For haptics, we use `react-native-pulsar` since it allows us to customize haptic patterns a lot. Never use other libs like `expo-haptics`. You also have the skill `pulsar-haptics` to help with this.
- For animations we use `react-native-reanimated` v4.
- When we want custom animated graphics, we use Lottie with `lottie-react-native`. We always try to use dotLottie files but can rely on other formats if not available.
- For icons in the app, we always use native ones via `expo-symbols`, which exposes SF Symbols on iOS and Material Symbols on Android: https://docs.expo.dev/versions/latest/sdk/symbols/
- When we need native UI toolkits, we use `expo-ui` (https://docs.expo.dev/versions/latest/sdk/ui/universal/) with the universal components so they work on both iOS and Android. It also has many drop-in replacements (https://docs.expo.dev/versions/latest/sdk/ui/drop-in-replacements/) so we don't need third-party libs for many things like bottom sheets, masked views, etc.
- While this app’s requirements are to build a demo without real APIs or servers, we want to build it as if it were a production app: perform “network requests” but mock the API response. Use https://tanstack.com/query/latest/docs/framework/react/react-native for those requests. For online status, use `expo-network`. Legend State also has a React Query plugin that can be useful: https://legendapp.com/open-source/state/v3/sync/tanstack-query/
- We also have `expo-glass-effect` for glass effect on iOS 26+ (important to make the app feel native).
- For blur, we have `expo-blur`.
- For images and assets, we use `expo-image` and `expo-asset`.
- Since this is a demo app we will share, we use Node with `npm`. No `yarn`, no `pnpm`, and not `bun` — easier to share and run for others.
- Always use project-scoped Emil skills (`animate`, `animate-expo`, `animation-vocabulary`, `apple-design`, `emil-design-eng`, `find-animation-opportunities`, `improve-animations`, `mobile-native`, `review-animations`, `write-swift`) when designing the app and creating animations and microinteractions. Especially when building the iOS-facing experience, use `apple-design` so we follow HIG guidelines. On every platform, those skills remain useful for high-quality premium interfaces.
- We must follow a TDD-oriented way of coding: use Jest for unit testing and Maestro (https://docs.maestro.dev/) for E2E tests.
- You have many official Expo skills in the project scope — load them to develop Expo apps the intended way. Also use `react-native-best-practices` when relevant.
- When we need fake data (for example in mocked API responses or locally generated catalog items), use the installed Faker library.
