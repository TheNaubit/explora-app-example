# Async UI states

Explora must show a clear UI for every async outcome. Users must never see a blank screen, a silent failure, or a spinner where a skeleton fits better.

## Status

| Area                                       | Status                                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Rules in `AGENTS.md`                       | Shipped                                                                                    |
| Suspense + Error Boundary rules            | Shipped (ADR-012)                                                                          |
| Shared skeleton / empty / error components | Shipped (`ActivityCardSkeleton`, `EmptyState`, `QueryErrorBoundary`, `InlineStatusBanner`) |
| Discovery Explore                          | Shipped (skeleton, empty, first-load error, refresh / next-page banner)                    |
| Detail / Saved                             | Shipped (detail skeleton and recovery states; Saved empty and content states)              |

## Required states

Every screen that loads, lists, or looks up data must design these states:

| State     | Meaning                                          | UI expectation                                     |
| --------- | ------------------------------------------------ | -------------------------------------------------- |
| Loading   | First fetch in progress; success layout is known | Skeleton that matches the success shape            |
| Empty     | Resolved with zero items (list or search)        | Copy + next action (create, clear filters)         |
| Not-found | Lookup failed because the entity is missing      | Copy + next action (go back, open discovery)       |
| Error     | Load or action failed                            | Copy + retry; keep stale data on refetch when safe |
| Content   | Success                                          | The real screen                                    |

Loading is not empty. Do not show an empty list while the first fetch still runs.

Explore uses one shared carousel geometry helper for loaded cards and card skeletons.

## Suspense and Error Boundaries (Query)

Use React Suspense and an Error Boundary for **first-load** catalog and detail queries. Pair them with `ApiError` from `@/query/errors`.

| Outcome                                       | Mechanism                                                                                                               |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| First load waiting                            | `<Suspense fallback={skeleton}>` around `useSuspenseQuery` / `useSuspenseInfiniteQuery`                                 |
| First load failed                             | Error Boundary catches thrown `ApiError`; resolve `errorKey` with Lingui; show retry                                    |
| Empty list                                    | Query succeeded with zero items → designed empty UI (not a boundary)                                                    |
| Detail not-found                              | Prefer designed not-found UI, or throw `ApiError` (`errors.notFound`) into the boundary when that path should fail hard |
| Refetch / next page / refresh mutation failed | Inline non-blocking error; keep current content (ADR-007)                                                               |

Do not catch mutation or event-handler failures only with an Error Boundary. Those paths need explicit UI state.

Shared components live under `src/components/`. Explore and Activity Detail use them in their screen folders.

## Skeleton preference

1. Prefer a skeleton that mirrors the success layout (rows, hero, text blocks, actions).
2. Do not use a centered full-screen spinner as the default first-load UI.
3. Allow a small spinner only when the layout is unknown, the wait is very short, or a single control is busy.
4. On refetch, keep showing current content. Add non-blocking refresh feedback (for example pull-to-refresh), not a full-screen spinner.

Explore uses the app mark as its pull and refresh indicator. Reaching the complete threshold starts one refresh immediately.
Incomplete pulls reset when the drag ends. The completed state resets after the refresh ends.

## Accessibility and i18n

1. Announce loading, empty, not-found, error, and success with `announceStatus` after the UI updates.
2. Localize all state copy with Lingui. Resolve mock failures with `errorKey` + `resolveErrorMessage`.
3. Give retry and recovery controls labels, roles, and adequate touch targets.

## Skills

When you build or change a data screen, load:

- `expo-data-fetching` (four-state model, refetch behavior)
- `expo-design-system` (Spinner Blink and related review prompts)
- Emil / Expo design skills from `AGENTS.md` **Design craft and Expo skills**

## Related

- Assessment refresh and recovery: [`../assessment/requirements.md`](../assessment/requirements.md)
- Accessibility announcements: [`accessibility.md`](./accessibility.md)
- Data layer: [`data-layer.md`](./data-layer.md)
- Decision: [`../decisions/adr-007-async-ui-states-skeletons.md`](../decisions/adr-007-async-ui-states-skeletons.md)
- Decision: [`../decisions/adr-012-suspense-error-boundaries.md`](../decisions/adr-012-suspense-error-boundaries.md)
