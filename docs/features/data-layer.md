# Data layer (Query + Legend)

## Current behavior

The client data layer has two owners:

| Concern                       | Owner                                     | Entry                              |
| ----------------------------- | ----------------------------------------- | ---------------------------------- |
| Paginated catalog list        | TanStack Query `useSuspenseInfiniteQuery` | `src/hooks/use-activities.ts`      |
| Activity detail               | TanStack Query `useSuspenseQuery`         | `src/hooks/use-activity.ts`        |
| Refresh (+1 on success)       | TanStack Query `useMutation`              | `src/hooks/use-refresh-catalog.ts` |
| Favorites + offline snapshots | Legend State + MMKV                       | `src/state/favorites.ts`           |
| Search / category filters     | Legend State arrays (memory)              | `src/state/discovery.ts`           |

Mock handlers remain the only network layer. Review modes control first-page, next-page, and refresh latency or failure.

Query errors use `ApiError` with `errorKey`. UI resolves keys with `resolveErrorMessage`.

## Suspense and Error Boundaries

Explore ships the Suspense path:

1. `useSuspenseInfiniteQuery` for the catalog list.
2. `QueryErrorBoundary` + `ExploreSkeleton` for first load.
3. Empty, refresh failure, and next-page failure stay as designed inline UI (see [ui-states](./ui-states.md) and [ADR-012](../decisions/adr-012-suspense-error-boundaries.md)).

Activity Detail uses `useSuspenseQuery` for the first load.

The query converts a missing activity into a soft not-found result. Other first-load errors go to the shared boundary.

## Offline detail contract

1. Prefer `useActivity(id)` from the mock catalog.
2. When a favorite snapshot exists, Query seeds it as `initialData` with an old timestamp.
3. Queries use `networkMode: "always"` because the mock API runs on-device.
4. A failed refetch keeps the snapshot visible and shows a retry banner.

## Code map

| Concern                          | Location                                     |
| -------------------------------- | -------------------------------------------- |
| QueryClient + provider           | `src/query/client.ts`, `src/app/_layout.tsx` |
| Online manager                   | `src/query/online-manager.ts`                |
| Query keys                       | `src/query/keys.ts`                          |
| ApiError unwrap                  | `src/query/errors.ts`                        |
| Favorites persist name / MMKV id | `src/state/constants.ts`                     |

## Related

- [Favorites + offline](./favorites-offline.md)
- [Mock API](./mock-api.md)
- [Discovery](./discovery.md)
- [Activity detail](./activity-detail.md)
- [ADR-011](../decisions/adr-011-query-legend-local-first.md)
