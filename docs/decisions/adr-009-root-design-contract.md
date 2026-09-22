# ADR-009: Root design contract

- Status: Accepted
- Date: 2026-09-22

## Context

The project has design rules in `AGENTS.md`. It does not have one complete design-system contract.

Generated concept images show useful direction. They do not define tokens, platform fallbacks, or all required assessment states.

## Decision

Keep the canonical design system in root [`DESIGN.md`](../../DESIGN.md).

Store visual references under `docs/design/references/`. Treat them as inspiration, not exact implementation specifications.

Keep runtime theme tokens in `src/theme.ts`. Update `DESIGN.md` and the tokens together.

Use Liquid Glass only for functional floating chrome. Provide dark, unsupported-platform, and reduced-transparency fallbacks.

Provide a review-build control sheet for reproducible normal, slow, and failure states.

## Consequences

- Agents must read `DESIGN.md` before UI work.
- UI changes that conflict with the contract require a contract update in the same change.
- Runtime screenshots replace generated references only after verification.
- Light and dark themes share one component hierarchy.
