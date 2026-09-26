# Async UI states

Explora must show a clear UI for every async outcome. Users must never see a blank screen, a silent failure, or a spinner where a skeleton fits better.

## Status

| Area                                       | Status                                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Rules in `AGENTS.md`                       | Shipped                                                                                    |
| Explicit Query state rules                 | Shipped (ADR-015)                                                                          |
| Shared skeleton / empty / error components | Shipped (`ActivityCardSkeleton`, `EmptyState`, `RecoveryState`, `InlineStatusBanner`)      |
| Discovery Explore                          | Shipped (skeleton, empty, first-load error, refresh toast, next-page recovery)             |
| Detail / Favorites                         | Shipped (detail skeleton and explicit recovery states; Favorites empty and content states) |

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

## Explicit Query states

Use explicit TanStack Query state for expected data outcomes. Pair failures with `ApiError` from `@/query/errors`.

Explore and Activity Detail use the same approach. Handled failures stay out of the Expo development error overlay.

| Outcome                                   | Mechanism                                                      |
| ----------------------------------------- | -------------------------------------------------------------- |
| First load waiting                        | `isPending` with no data renders the matching skeleton         |
| Catalog or detail first load failed       | `error` with no data renders `RecoveryState` with one retry    |
| Empty list                                | A successful zero-item result renders the designed empty state |
| Detail not-found                          | A soft null result renders the designed not-found state        |
| Refetch failed while content stays usable | One transient error toast keeps current content visible        |
| Next page failed                          | One inline footer recovery keeps current content visible       |
| Refresh mutation failed                   | One transient error toast keeps content and adds nothing       |

Do not catch mutation or event-handler failures only with an Error Boundary. Those paths need explicit UI state.

Shared components live under `src/components/`. Explore and Activity Detail use them in their screen folders.

## Feedback policy

Each outcome uses one feedback surface.

| Outcome                                  | Feedback                                    |
| ---------------------------------------- | ------------------------------------------- |
| Successful action                        | No toast or inline message                  |
| Confirmed calendar save                  | One native success toast                    |
| Canceled action                          | No toast or inline message                  |
| Temporary failure with usable content    | One native error toast                      |
| Important failure with a recovery action | One inline recovery surface                 |
| First-load failure                       | One full-screen recovery surface with retry |

Do not show a toast and an inline error for the same outcome.

The inline recovery surface uses a flat danger tint and a compact hierarchy. It keeps one direct retry action near the explanation.

The shared feedback policy lives in `src/feedback/feedback-policy.ts`.

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
- Superseded decision: [`../decisions/adr-012-suspense-error-boundaries.md`](../decisions/adr-012-suspense-error-boundaries.md)
- Current decision: [`../decisions/adr-015-explicit-query-states.md`](../decisions/adr-015-explicit-query-states.md)
- Decision: [`../decisions/adr-014-feedback-surface-policy.md`](../decisions/adr-014-feedback-surface-policy.md)
