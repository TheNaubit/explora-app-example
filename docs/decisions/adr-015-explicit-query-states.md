# ADR-015: Explicit Query states for expected data outcomes

- Status: Accepted
- Date: 2026-09-25
- Supersedes: [ADR-012](./adr-012-suspense-error-boundaries.md)

## Context

Explore and Activity Detail must handle expected mock API failures inside the app.

A thrown first-load Query error can open the Expo development error overlay before the recovery UI becomes usable.

The assessment also needs deterministic loading, empty, not-found, error, and content states.

## Decision

1. Use `useInfiniteQuery` for the catalog and `useQuery` for Activity Detail.
2. Render skeletons from `isPending` when no data exists.
3. Render the full recovery state from `error` when no usable data exists.
4. Render empty and not-found as separate product states.
5. Keep stale or saved content visible after a refetch failure.
6. Use one toast for a temporary failure when usable content remains.
7. Use one inline footer recovery for a later-page failure.
8. Keep route Error Boundaries for unexpected programming failures only.

## Consequences

- Expected validation, offline, and timeout failures do not throw during render.
- Expo development builds do not open the render error overlay for these outcomes.
- Explore and Activity Detail own the same explicit state matrix.
- The shared `RecoveryState` controls the first-load error design.
- Dev Tools mode changes use a Query key revision so kept-alive tabs reload.
