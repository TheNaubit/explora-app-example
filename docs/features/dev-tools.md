# Dev Tools

## Current behavior

The **Dev Tools** tab provides reproducible assessment states.

- Initial load supports Normal, Slow, and Fail.
- Later page load supports Normal, Slow, and Fail.
- Refresh supports Success, Slow, and Fail.
- **Clear request cache** applies a selected mode to the next matching request.
- **Reset request modes** restores normal loads and successful refresh.
- Local data rows show the catalog and favorite counts.
- **Reset local data** clears generated activities, favorites, filters, and request cache.
- Local data reset requires destructive confirmation.
- A slow request supports background, resume, and late-result checks.
- Request modes do not simulate the device offline state.

The screen uses grouped settings sections. All controls use project accessibility wrappers and Lingui messages.

## Code map

| Concern       | Location                                     |
| ------------- | -------------------------------------------- |
| Route         | `src/app/(dev-tools)/`                       |
| Screen        | `src/screens/dev-tools/index.tsx`            |
| Mode state    | `src/mocks/review-mode.ts`                   |
| Reset actions | `src/screens/dev-tools/dev-tools-actions.ts` |
| Messages      | `src/screens/dev-tools/messages.ts`          |
| Focused tests | `src/screens/dev-tools/*.test.ts*`           |

## Related

- [Mock API](./mock-api.md)
- [Local development](../operations/local-dev.md)
- [Verification scenarios](../verification/scenarios.md)
