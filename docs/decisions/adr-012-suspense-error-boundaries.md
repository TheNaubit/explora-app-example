# ADR-012: Suspense and Error Boundaries for Query UI

- Status: Superseded by [ADR-015](./adr-015-explicit-query-states.md)
- Date: 2026-09-22

## Context

Catalog failures throw `ApiError` with a stable `errorKey`. Screens need a clear split between first-load waiting, first-load failure, empty results, not-found, and non-blocking refetch or mutation errors. TanStack Query supports Suspense hooks. React Error Boundaries catch render-time throws, including Suspense rejections.

## Decision

1. Prefer **Suspense** for the first catalog load (`useSuspenseInfiniteQuery` when the screen ships).
2. Wrap those Suspense trees in a shared **Error Boundary** that reads `ApiError.errorKey` and shows the designed error UI with Lingui + retry.
3. Keep Activity Detail on explicit `useQuery` states. A handled detail failure must not open the Expo development error overlay.
4. Keep **empty** and **not-found** as designed screen states when the query succeeds with zero items, or when the product treats missing entities as a soft outcome. Throw `ApiError` (`errors.notFound`) only when the detail path should fail into the boundary.
5. Keep **refetch** and **mutation** failures (refresh, next-page) as **inline / non-blocking** UI. Do not replace existing content with a full-screen boundary.
6. Suspense fallbacks must be **skeletons**, not full-screen spinners (ADR-007).

## Consequences

- `ApiError` stays the thrown type for Query `queryFn` failures.
- Shared `QueryErrorBoundary` (name may vary) and skeleton fallbacks land with the first catalog screen.
- Activity Detail owns loading, failure, not-found, saved-fallback, and content states without a render throw.
- Expo Router route `ErrorBoundary` may wrap a screen; prefer one shared boundary component for Query errors.
- Agents follow this split in `AGENTS.md` and [`../features/ui-states.md`](../features/ui-states.md).

## Supersession

Runtime checks showed that handled Query failures can still open the Expo development error overlay when they throw during render.

ADR-015 replaces this decision for expected data outcomes. Route boundaries remain available for unexpected programming failures.
