# Explora — agent guide

This project is an Expo / React Native app (TypeScript). Prefer mobile-first design, good performance, and support for iOS and Android.

**Product:** Explora helps users find activities and save favorites for later, also offline.

**Do not change third-party skill packs** in `.agents/skills/`, `.claude/skills/`, or similar folders. Read those skills. Do not edit them. Put project rules only in root files such as `AGENTS.md` / `CLAUDE.md`.

**Project wiki:** Open [`docs/INDEX.md`](./docs/INDEX.md) for product behavior, architecture, features, decisions, and verification. This file is the always-on **rulebook**. Link to the wiki. Do not copy long reference text here.

---

## Simplified Technical English (ASD-STE100)

Write all **user-facing agent replies**, **`docs/`** pages, and **JSDoc** with [ASD-STE100](https://asd-ste100.org/about_STE.html) Simplified Technical English principles.

Goal: low cognitive load and clear meaning. This project does **not** require the full official dictionary word-for-word. Follow the rules below. You may use project technical nouns (Expo, Zod, MMKV, and similar).

### Writing rules (mandatory)

1. **Short sentences.** Procedure text: max about **20** words per sentence. Descriptive text: max about **25** words per sentence. Split long sentences.
2. **One idea per sentence.** One instruction or one fact only.
3. **Active voice.** Prefer “Validate the payload with Zod.” Avoid “The payload should be validated.”
4. **Imperative for instructions.** Tell the agent or reader what to do: “Open `docs/INDEX.md`.”
5. **Consistent terms.** Use the same word for the same thing (activity, favorite, refresh, catalog). Do not mix synonyms for the same concept.
6. **No contractions.** Write “do not”, not “don’t”.
7. **No idioms, slang, or metaphors.** Do not write “ship it”, “gut the file”, or “under the hood” in docs or JSDoc.
8. **Simple connectors.** Prefer “and”, “but”, “if”, “then”, “because”. Avoid heavy noun stacks.
9. **Present tense** for current system behavior. Mark planned work as “Target” or “Not implemented”.
10. **Lists for steps.** Use numbered or bulleted lists for procedures.

Full checklist: [`docs/meta/simplified-technical-english.md`](./docs/meta/simplified-technical-english.md).

---

## Documentation wiki (rules)

- `AGENTS.md` holds rules and hard constraints.
- `docs/` holds the technical wiki. It is not a journal.
- `AI_SESSION.md` holds AI usage for submission.

1. Open [`docs/INDEX.md`](./docs/INDEX.md) before you invent product or architecture answers.
2. Update wiki pages in the **same change** as the code. Add and link a page if none exists.
3. Write present-tense system docs. Do not put chat logs in `docs/`.
4. Keep one topic per page. Update the indexes. Use ADRs for important trade-offs.
5. Mark planned work and shipped work clearly.

Maintenance guide: [`docs/meta/wiki-maintenance.md`](./docs/meta/wiki-maintenance.md).

---

## Assessment — hard constraints

Do not forget these rules. Full text: [`docs/assessment/requirements.md`](./docs/assessment/requirements.md). Dataset: [`docs/product/dataset.md`](./docs/product/dataset.md). Scenarios: [`docs/verification/scenarios.md`](./docs/verification/scenarios.md).

**Core journey:** browse → search/filter → detail → favorites → open again offline.

**Data**

- Keep all **12** supplied activities in `assets/activities.json` with original IDs and content.
- Discovery must support **≥1,000** local activities (12 + generated).
- Refresh is different: add **one** activity only after a successful refresh.
- Mock the network locally. Validate payloads with **Zod**. Support success, fail, and slow loads that you can reproduce.

**Capabilities (must ship)**

- Discovery (keep search/filter after detail)
- Favorites and offline detail
- Refresh (+1 on success; add nothing on failure)
- Safe async across app lifecycle
- Accessibility for the main journey
- **One** native capability (permission, cancel, and invalid input)
- Performance evidence from a **release** build
- **One** improvement with before/after evidence

**Out of scope:** real backend, login, payments, multi-device sync, store publish, claim for an unverified platform.

**Verification / delivery**

- 6–8 scenarios and ≥2 automated tests (one core, one failure/recovery)
- Installable **Android APK** and **iOS Simulator `.app`** (not Metro or Expo Go alone)
- Keep `AI_SESSION.md` honest. Do not invent transcripts.

**Working principles**

1. Prefer correct, clear work over extra features.
2. Prove offline, refresh failure, lifecycle, performance, native, and improvement claims.
3. Do not lose user state in silence (search/filter, favorites, in-flight work).
4. Keep review steps local and reproducible.
5. Plan real release artifacts early.
6. Record AI usage honestly.
7. Ask early if you cannot build or verify a platform or capability.
8. Keep `docs/` current when behavior or decisions change.

---

## Expo has changed — do not trust your training data

Expo changes APIs in each SDK release. Names move or disappear. Before you use an Expo, EAS, or React Native API:

1. Read the major `expo` version in `package.json`.
2. Open the matching docs: `https://docs.expo.dev/versions/v<major>.0.0/`.
3. For other topics, open https://docs.expo.dev/llms.txt and follow the links. Do not answer from memory alone.

## Commands

Use **npm** only (no yarn, pnpm, or bun). Prefer `npx` for tools.

If another workspace has a `bun.lock`, use `bunx` there. Do not use bun in this app.

```bash
npx expo install <package>  # ALWAYS — resolves SDK-compatible versions
npx expo start
npx expo lint
npx tsc --noEmit
npx expo-doctor
npx expo install --fix
```

Also use `npm run lint` / `npm run fix` when you need a full-tree check. Pre-commit runs lint-staged (oxlint, oxfmt, and `tsc --noEmit` when TypeScript files are staged).

## Navigation and routing

- Use **Expo Router** for all navigation. Routes live in `src/app/`. Each file is a route. `_layout.tsx` files define navigators.
- Keep routes thin. Put params and navigation options in the route. Render a screen from `src/screens/`. Keep other code out of `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Project structure

Follow Expo folder-structure best practices ([blog](https://expo.dev/blog/expo-app-folder-structure-best-practices)). Load skill `expo-project-structure` when you scaffold. Tree: [`docs/architecture/project-structure.md`](./docs/architecture/project-structure.md).

**Musts**

- Put app code under `src/`. Put routes only in `src/app/` (thin). Put UI in `src/screens/` and `src/components/`.
- Use **kebab-case** file names. Export one primary name per component file. Use a folder with `index.tsx` when you split a component.
- Add folders as needed: `schemas/`, `mocks/`, `data/`, `state/`, `types/`. Do not make them routes.
- Do not add Expo Router `+api` or `server/` for this assessment. Keep mocks on the client.
- Colocate unit tests (`*.test.ts`). Put Maestro flows in `.maestro/` at the repo root.
- For platform splits, use `.ios` / `.android` / `.native` / `.web` plus a default file. Import without the suffix.

### Styling

- Support **light and dark** mode (system appearance; `userInterfaceStyle: "automatic"`). Put both palettes in `src/theme.ts` (or equal). Do not ship one-mode UI.
- Use React Native **`StyleSheet` only** (inline styles only when values are dynamic). Put `StyleSheet.create` at the **bottom of the same file**. Do not use `*.styles.ts`. Do not use Uniwind, NativeWind, Unistyles, or Tamagui.

## Building with EAS

You may use EAS for cloud build, sign, submit, and OTA (`npx eas-cli@latest …`). This assessment needs a local release APK and an iOS Simulator `.app`. EAS is optional if it helps. Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` are missing, Continuous Native Generation creates them. Do not edit them by hand. Use `app.config` and config plugins.
- Native modules need a development build (`npx expo run:ios|android` or `eas build --profile development`). Do not rely on Expo Go alone.
- Prefer Expo modules. Check project skills before you add dependencies.

## Linting and formatting

- **Commit gate:** Husky runs `lint-staged` on pre-commit. Staged JS/TS files get `oxlint --fix --deny-warnings` and `oxfmt`. When any `.ts` / `.tsx` file is staged, run `npx tsc --noEmit` once. Staged JSON/Markdown get `oxfmt`. A commit fails if lint warnings, lint errors, or TypeScript errors remain.
- **While coding:** You do not need to run a full-tree `npm run fix` after every edit. Rely on the commit hook for staged files.
- **Before you say a task is done (no commit yet):** Run `npm exec lint-staged` with your files staged, or run `npm run lint` and `npx tsc --noEmit`.
- **Manual full tree:** `npm run fix` or `npm run lint` when you need a whole-project lint check. Use `npx tsc --noEmit` for types outside a commit.
- Config: `oxlint.config.mjs`, `lint-staged.config.mjs`, `.husky/pre-commit`. Skip type-aware Sonar rules until Oxlint supports them.
- Ignore vendored skills with `.eslintignore`. Do not edit `.agents/` or `.claude/` to silence lint.

## Best practices (stack)

- **State / offline:** Legend State v3 + `react-native-mmkv`
- **Lists:** Legend List · **Keyboard:** `react-native-keyboard-controller` ≥ `1.21.7`
- **Haptics:** `react-native-pulsar` only (skill: `pulsar-haptics`). Do not use `expo-haptics`.
- **Animation:** Reanimated v4 · **Lottie:** `lottie-react-native` (prefer dotLottie)
- **Icons:** `expo-symbols` · **Native UI:** `expo-ui` universal + drop-ins
- **Fetching:** TanStack Query + mocks · **Online:** `expo-network` · optional Legend State React Query plugin
- **Validation:** Zod in `src/schemas/` + `parseWithSchema` / `safeParseWithSchema`
- **JSDoc:** selective. Document intent on shared exports only. Do not repeat TypeScript types. Do not enable a strict JSDoc lint plugin. Write JSDoc in Simplified Technical English.
- **Glass / blur / images:** `expo-glass-effect`, `expo-blur`, `expo-image`, `expo-asset`
- **Fake data:** installed Faker library
- **Package manager:** npm only
- **Tests:** TDD with Jest; E2E with Maestro
- **Design motion:** project Emil skills + `apple-design` (HIG) for iOS-facing work; Expo skills + `react-native-best-practices` when useful

Upstream docs: [Legend State](https://legendapp.com/open-source/state/v3/intro/introduction/), [MMKV persist](https://legendapp.com/open-source/state/v3/sync/persist-sync/#mmkv-rn), [Legend List](https://legendapp.com/open-source/list/v3/react-native/getting-started/), [TanStack Query RN](https://tanstack.com/query/latest/docs/framework/react/react-native), [Zod](https://zod.dev/), [Expo Symbols](https://docs.expo.dev/versions/latest/sdk/symbols/), [Expo UI](https://docs.expo.dev/versions/latest/sdk/ui/universal/).
