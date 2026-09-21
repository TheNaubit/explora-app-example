# ADR-008: Mandatory Emil design skills and Expo skills

- Status: Accepted
- Date: 2026-09-21

## Context

`AGENTS.md` only said to use Emil and Expo skills “when useful”. Accessibility and i18n already use hard skill mandates. Soft wording lets agents skip polish, microinteractions, and Expo-correct patterns.

## Decision

Make design craft and Expo development **mandatory** for UI and Expo work:

- Load Emil skills (`emil-design-eng`, motion skills, `apple-design` when iOS-facing) before building or polishing UI.
- Load the matching Expo skill for the task, plus versioned Expo docs for this app’s SDK major.
- Use `react-native-best-practices` when it applies.

## Consequences

- UI work without these skills is incomplete process.
- Skills guide judgment. They do not replace reading current Expo docs.
- Detail lives in `AGENTS.md` under **Design craft and Expo skills**.
