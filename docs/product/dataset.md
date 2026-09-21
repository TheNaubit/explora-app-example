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
- Generate more items in the same shape with unique stable IDs.
- A default list of about 1,012 items is acceptable.
- Document size, generation, and reset in the README and in [operations](../operations/local-dev.md).

Refresh is different. A successful refresh adds **one** activity only.

## Mocked network

- Use production-shaped API calls (TanStack Query). Mock responses on the device.
- Validate every mock, fixture, and generated payload with **Zod** before app state or UI use it.
- Do not require external accounts, API keys, or hosted services.
- Support success, fail, and slow loads that a reviewer can reproduce. Document the steps in ops or the README.

## Related

- Hard constraints: root `AGENTS.md` → Assessment
- [Product overview](./overview.md)
- [Architecture](../architecture/overview.md)
