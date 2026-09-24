# Dataset and data rules

## Supplied catalog

Source of truth: `assets/activities.json` (`schemaVersion: 1`).

The file has **12** fictional activities. Fields:

| Field             | Notes                                             |
| ----------------- | ------------------------------------------------- |
| `id`              | Stable string IDs (`act-001` … `act-012`)         |
| `title`           | Searchable                                        |
| `description`     | Detail text                                       |
| `category`        | Filterable: Outdoors, Culture, Workshops, Leisure |
| `location`        | Display only, unless a native feature needs it    |
| `durationMinutes` | Number                                            |

**Do not replace or remove these 12.** Keep original IDs and content.

Load and validate with Zod in `src/data/activities.ts` and `src/schemas/activity.ts`.

## Performance scale (≥1,000 activities)

Discovery must support scroll, search, and interaction with at least **1,000** local activities.

- Keep the original 12 as the base.
- `seedCatalog` in `src/mocks/seed-catalog.ts` fills to **1,012** items (`SEEDED_CATALOG_SIZE` in `src/mocks/constants.ts`).
- Generated ids use `gen-0001` … (`GENERATED_ACTIVITY_ID_PREFIX`) with a fixed Faker base seed (`CATALOG_FAKER_BASE_SEED`).
- Reset with `resetCatalog()` from `src/mocks/catalog-store.ts`.

Refresh is different. A successful refresh adds **one** activity at the start of the catalog.

Refresh ids use `ref-0001`, … through `REFRESH_ACTIVITY_ID_PREFIX` and `REFRESH_FAKER_BASE_SEED`.

MMKV stores the refresh-added activities and their sequence. A cold launch restores them before the seeded catalog.

## Mocked network

- Client mocks live in `src/mocks/api.ts` (`listActivities`, `getActivity`, `refreshCatalog`).
- `listActivities` returns cursor pages (default `LIST_PAGE_SIZE` = 20) with optional search and category.
- Validate every mock, fixture, and generated payload with **Zod** before app state or UI use it.
- Do not require external accounts, API keys, or hosted services.
- Review modes: see [operations](../operations/local-dev.md) and [mock API](../features/mock-api.md).

## Related

- Hard constraints: root `AGENTS.md` → Assessment
- [Product overview](./overview.md)
- [Architecture](../architecture/overview.md)
- [Mock API feature](../features/mock-api.md)
