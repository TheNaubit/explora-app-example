# Dev Tools

## Current behavior

The **Dev Tools** tab provides reproducible assessment states.

- First catalog load supports Normal, Slow, Empty, Offline, Timeout, and Invalid data.
- Activity detail supports the same modes and Not found.
- Later page load supports Normal, Slow, Offline, Timeout, and Invalid data.
- Refresh supports Success, Slow, Offline, and Timeout.
- A mode change clears the request cache automatically.
- A mode change also changes the Query key revision. Kept-alive tabs reload the selected state.
- **Clear request cache** remains available for repeated checks.
- **Reset request modes** restores normal loads and successful refresh.
- Local data rows show the catalog and favorite counts.
- **Reset local data** clears generated activities, favorites, filters, and request cache.
- Local data reset requires destructive confirmation.
- A slow request supports background, resume, and late-result checks.
- Request modes do not simulate the device offline state.
- Feedback previews cover a transient error, an actionable error, and calendar success.
- The native feedback row reports if the installed app contains the toast module.
- The native large title collapses into the navigation bar without covering settings rows.
- A slow mode waits 10 seconds. This keeps loading UI visible during manual and Maestro checks.

The screen uses grouped settings sections. All controls use project accessibility wrappers and Lingui messages.

## Code map

| Concern           | Location                                               |
| ----------------- | ------------------------------------------------------ |
| Route             | `src/app/(dev-tools)/`                                 |
| Screen            | `src/screens/dev-tools/index.tsx`                      |
| Feedback previews | `src/screens/dev-tools/dev-tools-feedback-section.tsx` |
| Mode state        | `src/mocks/review-mode.ts`                             |
| Reset actions     | `src/screens/dev-tools/dev-tools-actions.ts`           |
| Messages          | `src/screens/dev-tools/messages.ts`                    |
| Focused tests     | `src/screens/dev-tools/*.test.ts*`                     |

## Related

- [Mock API](./mock-api.md)
- [Local development](../operations/local-dev.md)
- [Verification scenarios](../verification/scenarios.md)
