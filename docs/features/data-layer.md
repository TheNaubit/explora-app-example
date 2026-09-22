# Data layer (Query + Legend)

## Current behavior

The client data layer has two owners:

| Concern                       | Owner                             | Entry                              |
| ----------------------------- | --------------------------------- | ---------------------------------- |
| Paginated catalog list        | TanStack Query `useInfiniteQuery` | `src/hooks/use-activities.ts`      |
| Activity detail               | TanStack Query `useQuery`         | `src/hooks/use-activity.ts`        |
| Refresh (+1 on success)       | TanStack Query `useMutation`      | `src/hooks/use-refresh-catalog.ts` |
| Favorites + offline snapshots | Legend State + MMKV               | `src/state/favorites.ts`           |
| Search / category filters     | Legend State (memory)             | `src/state/discovery.ts`           |

Mock handlers remain the only network layer. Review modes control first-page, next-page, and refresh latency or failure.

Query errors use `ApiError` with `errorKey`. UI resolves keys with `resolveErrorMessage`.

## Suspense and Error Boundaries (target for screens)

When Explore / Detail / Saved screens ship:

1. Prefer `useSuspenseQuery` / `useSuspenseInfiniteQuery` for first load.
2. Wrap with Suspense (skeleton fallback) and a shared Error Boundary for thrown `ApiError`.
3. Keep empty, soft not-found, refetch, next-page, and refresh failures as designed inline UI (see [ui-states](./ui-states.md) and [ADR-012](../decisions/adr-012-suspense-error-boundaries.md)).

Current hooks still use `useQuery` / `useInfiniteQuery` / `useMutation`. Migrate list and detail hooks to Suspense forms in the same change as the first data screens.

## Offline detail contract

1. Prefer `useActivity(id)` from the mock catalog.
2. When a favorite snapshot exists, Query seeds it as `placeholderData` so detail stays visible offline.
3. Queries use `networkMode: "always"` because the mock API runs on-device.
4. Screen UI for that path is not implemented yet.

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
- [ADR-011](../decisions/adr-011-query-legend-local-first.md)
