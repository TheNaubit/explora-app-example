# ADR-011: TanStack Query for catalog, Legend State for local-first

- Status: Accepted
- Date: 2026-09-22

## Context

The app needs a mocked network catalog (list, get, refresh) and local-first favorites that work offline. Legend State ships a TanStack Query plugin (`syncedQuery`). Screens also need clear loading and error status for async UI.

## Decision

1. Use **TanStack Query** for catalog data: `useSuspenseInfiniteQuery` for the paginated list, `useSuspenseQuery` for detail, and `useMutation` for refresh.
2. Use **Legend State + MMKV** for favorites ids, offline activity snapshots, and in-memory discovery search/filter.
3. Do **not** use `syncedQuery` in this iteration. Keep Query status fields for UI. Pass discovery filters into the list query key as plain values.
4. Simulate pagination in the mock API (cursor pages, first-page vs next-page review modes).

## Consequences

- Screens resolve failures with `ApiError.errorKey` and Lingui.
- Refresh invalidates list queries and does not clear favorites.
- Detail screens can fall back to `getOfflineSnapshot(id)` when Query fails offline.
- Screen UI uses Suspense + Error Boundaries for first load (ADR-012).
- Activity Detail seeds a saved snapshot as old `initialData` and keeps it during a failed refetch.
- Revisit `syncedQuery` later if query keys must track Legend observables directly.
