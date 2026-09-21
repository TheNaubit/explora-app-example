# ADR-001: Technical wiki in `docs/`

- Status: Accepted
- Date: 2026-09-21

## Context

Agents and humans need a shared place for product behavior, architecture, and trade-offs. Chat history and `AGENTS.md` alone are hard to navigate. Journal notes go stale.

## Decision

Keep a fragmented technical wiki under `docs/`. Use `docs/INDEX.md` as the navigation hub. Describe the system as it is. Mark target behavior when work is not shipped. Update pages as part of development.

## Consequences

- Navigation improves through the index and area indexes.
- `AGENTS.md` stays the rulebook. `docs/` stays the product and engineering wiki.
- Agents must update docs when behavior or architecture changes.
