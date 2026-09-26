# ADR-014: One feedback surface for each outcome

- Status: Accepted
- Date: 2026-09-24

## Context

Explora used toast messages, inline errors, and silent outcomes without one rule.

Some failures produced both a toast and an inline error. Routine success messages also interrupted the user.

## Decision

Use one feedback surface for each outcome.

- Keep routine success silent.
- Show one native success toast only for a confirmed calendar save.
- Keep cancellation and no-change outcomes silent.
- Show one native error toast for a temporary failure when content stays usable.
- Show one inline recovery surface for an important failure with a useful action.
- Show first-load failures in the shared inline Query error surface.

Implement the rule in `src/feedback/feedback-policy.ts`.

## Consequences

- A single outcome cannot show both a toast and an inline error.
- Existing content stays visible during temporary failures.
- Inline recovery uses a clear heading, short explanation, and one primary action.
- Dev Tools previews the permitted feedback surfaces.
- Automated tests protect the mapping and the main consumers.
