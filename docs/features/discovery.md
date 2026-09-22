# Discovery

## Target behavior

- Browse the activity catalog.
- Search by title.
- Filter by category.
- Combine search and filter.
- Keep search and filter after return from detail.

## Current implementation

- The Home screen shows that the supplied catalog loads (`src/screens/home`, `src/data/activities.ts`).
- Paginated mock list and Query hooks are ready (`useActivities`, discovery store).
- Full list, search, and filter UI: not implemented.

## Code map

| Concern               | Location                                           |
| --------------------- | -------------------------------------------------- |
| Route                 | `src/app/index.tsx`                                |
| Screen                | `src/screens/home/`                                |
| Supplied data         | `src/data/activities.ts`, `assets/activities.json` |
| Seed catalog          | `src/mocks/seed-catalog.ts` (1,012 items)          |
| Mock list API         | `src/mocks/api.ts` → `listActivities` (paginated)  |
| List query            | `src/hooks/use-activities.ts`                      |
| Search / filter store | `src/state/discovery.ts`                           |
| Schema                | `src/schemas/activity.ts`, `src/schemas/api.ts`    |

## Related

- [Features index](./index.md)
- [Product overview](../product/overview.md)
