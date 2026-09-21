# ADR-005: react-native-a11y for accessibility

- Status: Accepted
- Date: 2026-09-21

## Context

The assessment requires usable navigation, keyboard behavior, larger text, and screen-reader access on the main journey. React Native props cover labels and Dynamic Type. Focus order, focus lock, and hardware keyboard focus need more work on both platforms.

## Decision

Adopt `react-native-a11y@0.9.0` as the native accessibility toolkit.

- Pin the version in `package.json`.
- Import through `@/a11y` and project wrappers. Do not import the package in feature screens.
- Do not add the mutually exclusive split packages from the same author.
- Keep React Native accessibility props for labels, roles, hints, and state.
- Require a development or release build. Do not claim Expo Go support for this module.
- Keep `A11yProvider` at the root even though 0.9.0 ships it as a passthrough shim.

Independent review of the published tarball found no install-time malware signals, no runtime network code, and matching GitHub tag provenance for 0.9.0.

## Consequences

- Agents follow one API surface for screen-reader order, announcements, cards, and keyboard focus.
- Native folders must come from prebuild or `expo run:*` before device verification.
- Version bumps need a short re-check of install scripts, dependencies, and gitHead vs tag.
- Pure RN solutions remain valid for labels and font scaling. The library fills focus and keyboard gaps.
