# ADR-012: Suspense and Error Boundaries for Query UI

- Status: Accepted
- Date: 2026-09-22

## Context

Catalog failures throw `ApiError` with a stable `errorKey`. Screens need a clear split between first-load waiting, first-load failure, empty results, not-found, and non-blocking refetch or mutation errors. TanStack Query supports Suspense hooks. React Error Boundaries catch render-time throws, including Suspense rejections.

## Decision

1. Prefer **Suspense** for first catalog load and detail load (`useSuspenseQuery` / `useSuspenseInfiniteQuery` when screens ship).
2. Wrap those Suspense trees in a shared **Error Boundary** that reads `ApiError.errorKey` and shows the designed error UI with Lingui + retry.
3. Keep **empty** and **not-found** as designed screen states when the query succeeds with zero items, or when the product treats missing entities as a soft outcome. Throw `ApiError` (`errors.notFound`) only when the detail path should fail into the boundary.
4. Keep **refetch** and **mutation** failures (refresh, next-page) as **inline / non-blocking** UI. Do not replace existing content with a full-screen boundary.
5. Suspense fallbacks must be **skeletons**, not full-screen spinners (ADR-007).

## Consequences

- `ApiError` stays the thrown type for Query `queryFn` failures.
- Shared `QueryErrorBoundary` (name may vary) and skeleton fallbacks land with the first data screens.
- Expo Router route `ErrorBoundary` may wrap a screen; prefer one shared boundary component for Query errors.
- Agents follow this split in `AGENTS.md` and [`../features/ui-states.md`](../features/ui-states.md).
