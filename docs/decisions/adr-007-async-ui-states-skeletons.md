# ADR-007: Async UI states and skeletons over spinners

- Status: Accepted
- Date: 2026-09-21

## Context

Assessment scenarios need clear loading, empty, error, and recovery. A blank screen or a centered spinner hides layout, causes empty-state flashes, and feels slow. Expo data-fetching guidance already separates loading, empty, error, and content.

## Decision

Require a designed UI for **loading**, **empty**, **not-found**, **error**, and **content** on every data screen.

Prefer **skeletons that match the success layout** for first load when the shape is known. Do not use full-screen spinners as the default. Keep stale content on refetch. Show non-blocking errors and retry.

## Consequences

- Agents must ship state UI in the same change as each data screen.
- Shared skeleton / empty / error components should appear when the first data screen lands.
- Button-level or unknown-layout waits may still use a small spinner.
- Rules live in `AGENTS.md` and [`../features/ui-states.md`](../features/ui-states.md).
