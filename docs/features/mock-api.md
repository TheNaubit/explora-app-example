# Mock API

## Current behavior

The app uses a client-side mock API. There is no real backend.

| Operation    | Function         | Success payload         | Notes                            |
| ------------ | ---------------- | ----------------------- | -------------------------------- |
| List catalog | `listActivities` | `{ activities, total }` | Seeds to 1,012 items             |
| Get by id    | `getActivity`    | `{ activity }`          | Missing id → `errors.notFound`   |
| Refresh      | `refreshCatalog` | `{ activity }`          | Success appends exactly one item |

Review modes control initial load (`normal` / `slow` / `fail`) and refresh (`success` / `slow` / `fail`).

## Code map

| Concern              | Location                                            |
| -------------------- | --------------------------------------------------- |
| Named mock constants | `src/mocks/constants.ts`                            |
| Unit tests           | `src/mocks/*.test.ts`                               |
| Zod activity schema  | `src/schemas/activity.ts`                           |
| Zod API payloads     | `src/schemas/api.ts`                                |
| Mock result envelope | `src/schemas/mock-result.ts`, `src/mocks/result.ts` |
| Review mode schema   | `src/schemas/review-mode.ts`                        |
| Seed catalog (1,012) | `src/mocks/seed-catalog.ts`                         |
| Catalog store        | `src/mocks/catalog-store.ts`                        |
| Public mock API      | `src/mocks/api.ts`                                  |
| Review mode store    | `src/mocks/review-mode.ts`                          |

## Related

- [Dataset](../product/dataset.md)
- [Local ops](../operations/local-dev.md)
- [ADR-010](../decisions/adr-010-client-mock-api.md)
