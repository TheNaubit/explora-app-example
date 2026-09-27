# Assessment requirements

This page holds the full assessment product and delivery text. Coding rules stay in root `AGENTS.md`.

Reviewers judge product choices, technical decisions, and **proof with evidence**. They do not judge hours spent or feature count alone.

## Required capabilities

- **Discovery:** browse; search by title; filter by category; combine search and filter; keep search/filter after detail.
- **Favorites:** save and remove; show saved items; persist across close and reopen; keep details available offline.
- **Refresh and recovery:** each successful refresh adds **exactly one** random activity with a unique stable ID; keep old items and favorites; add nothing on failure; show clear loading, empty, error, and recovery; new activities support the same actions as the catalog.
- **Lifecycle:** background, resume, and late results must not erase or reverse user changes in silence.
- **Usability / accessibility:** usable navigation, keyboard behavior, larger text, and screen-reader access for the main journey.
- **Native capability:** one useful device feature (deep links, local notifications, camera, microphone, location, or similar). Show permission, cancel, and invalid-input cases. Prefer a feature you can verify without external services.
- **Data:** use the 12 supplied activities as the normal catalog. Keep their stable content and IDs.
- **Performance evidence:** demonstrate scrolling, search, and interaction with at least 1,000 generated activities. Measure a **release** build and state its limits.
- **Part 2 — one improvement:** pick one real mobile problem. Explain why it matters. Show before and after evidence. State limits.

## Out of scope

Do not add a real backend, login, payments, multi-device sync, or store publication. Do not claim a platform you did not verify with an artifact.

## Verification expectations

See also [verification/scenarios.md](../verification/scenarios.md).

- Write **6–8 scenarios** with steps, expected result, observed result, and evidence.
- Cover core journey, refresh, offline favorites, failure recovery, lifecycle, native feature, performance (≥1k), and accessibility.
- Add **≥2 automated tests:** one core behavior; one failure or recovery case. State what you do not test.
- Demo: max 10 minutes of video total, or max 15 slides/pages with a short recording.

## AI session file

Keep `AI_SESSION.md` as the index of AI use for submission.

- List sessions, tools, and models when known. Link transcript or summary files.
- Include assessment material only. Remove secrets and unrelated personal data. Mark omissions.
- If you have no verbatim export, write an **“AI-generated session summary, not a verbatim transcript”**. Do not present a summary as the original log.
- If you did not use AI, say that in a short statement.
- For non-English transcripts, add an English summary and label it as a translation or summary.

## Delivery and distribution

| Platform | Artifact                    | Notes                             |
| -------- | --------------------------- | --------------------------------- |
| Android  | APK                         | Runs without Metro or Expo Go     |
| iOS      | Simulator `.app` (archived) | Runs without a development server |

For each artifact, state OS, architecture, build config, app version, and commit. Verify launch, core journey, offline favorites, and the native feature on each platform. Note simulator limits. A JS bundle or Expo Go session alone is **not** a valid artifact.

If you cannot build one platform: say so early. Verify the platform you have. For the other, give config, exact steps, and the blocker. Label it **unverified**.

**Release note:** separate review artifacts from store distribution. Cover signing (no secrets), versioning, pre-release checks, and response to a bad release.

**Final package:** GitHub repo (not a ZIP alone); README; decisions and evidence; artifacts and release note; presentation; `AI_SESSION.md`. Write in English. Do not repeat the same explanation in many files.

## Related

- Hard constraints checklist: root `AGENTS.md`
- [Dataset](../product/dataset.md)
- [Verification index](../verification/index.md)
