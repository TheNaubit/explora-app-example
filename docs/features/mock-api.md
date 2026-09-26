# Mock API

## Current behavior

The app uses a client-side mock API. There is no real backend.

| Operation         | Function         | Success payload                     | Notes                            |
| ----------------- | ---------------- | ----------------------------------- | -------------------------------- |
| List catalog page | `listActivities` | `{ activities, total, nextCursor }` | Cursor pages; default limit 20   |
| Get by id         | `getActivity`    | `{ activity }`                      | Missing id → `errors.notFound`   |
| Refresh           | `refreshCatalog` | `{ activity }`                      | Success appends exactly one item |

List requests accept `cursor`, optional `limit`, `search` (title substring), and `category`. Filter first, then page.

Review modes:

| Field         | Applies to                           | Values                                                            |
| ------------- | ------------------------------------ | ----------------------------------------------------------------- |
| `initialLoad` | First list page                      | `normal` / `slow` / `empty` / `fail` / `timeout` / `invalid-data` |
| `detailLoad`  | Activity lookup                      | List values plus `not-found`                                      |
| `pageLoad`    | Later list pages (`cursor !== null`) | `normal` / `slow` / `fail` / `timeout` / `invalid-data`           |
| `refresh`     | Refresh mutation                     | `success` / `slow` / `fail` / `timeout`                           |

`fail` returns an offline error. `timeout` returns a timeout error.

`invalid-data` returns a validation error. Failed refresh requests add no activity.

`empty` returns a valid first page with zero activities. Slow modes wait 10 seconds.

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
- [Data layer](./data-layer.md)
- [ADR-010](../decisions/adr-010-client-mock-api.md)
- [ADR-011](../decisions/adr-011-query-legend-local-first.md)
