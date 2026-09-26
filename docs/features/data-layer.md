# Data layer (Query + Legend)

## Current behavior

The client data layer has two owners:

| Concern                       | Owner                             | Entry                              |
| ----------------------------- | --------------------------------- | ---------------------------------- |
| Paginated catalog list        | TanStack Query `useInfiniteQuery` | `src/hooks/use-activities.ts`      |
| Activity detail               | TanStack Query `useQuery`         | `src/hooks/use-activity.ts`        |
| Refresh (+1 on success)       | TanStack Query `useMutation`      | `src/hooks/use-refresh-catalog.ts` |
| Refresh catalog delta         | MMKV                              | `src/mocks/catalog-store.ts`       |
| Favorites + offline snapshots | Legend State + MMKV               | `src/state/favorites.ts`           |
| Search / category filters     | Legend State arrays (memory)      | `src/state/discovery.ts`           |

Mock handlers remain the only network layer. Review modes control first-page, next-page, and refresh latency or failure.

MMKV stores only refresh-added activities and the refresh sequence. The app generates the fixed seed catalog at launch.

Query errors use `ApiError` with `errorKey`. UI resolves keys with `resolveErrorMessage`.

## Explicit Query state

Explore and Activity Detail use explicit state:

1. `useInfiniteQuery` returns catalog loading, error, and data states.
2. `useQuery` returns detail loading, error, not-found, saved fallback, and data states.
3. First-load failures render `RecoveryState` without a render throw.
4. Empty, refresh failure, and next-page failure stay in designed UI states.
5. Review-mode revisions create new Query keys for kept-alive tabs.

## Offline detail contract

1. Prefer `useActivity(id)` from the mock catalog.
2. When a favorite snapshot exists, Query seeds it as `initialData` with an old timestamp.
3. Queries use `networkMode: "always"` because the mock API runs on-device.
4. A failed refetch keeps the snapshot visible and shows a retry banner.

## Code map

| Concern                    | Location                                     |
| -------------------------- | -------------------------------------------- |
| QueryClient + provider     | `src/query/client.ts`, `src/app/_layout.tsx` |
| Online manager             | `src/query/online-manager.ts`                |
| Query keys                 | `src/query/keys.ts`                          |
| ApiError unwrap            | `src/query/errors.ts`                        |
| Persistence keys / MMKV id | `src/state/constants.ts`                     |

## Related

- [Favorites + offline](./favorites-offline.md)
- [Mock API](./mock-api.md)
- [Discovery](./discovery.md)
- [Activity detail](./activity-detail.md)
- [ADR-011](../decisions/adr-011-query-legend-local-first.md)
