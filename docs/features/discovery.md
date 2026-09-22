# Discovery

## Current behavior

- Browse the paginated activity catalog on Explore.
- Search by title (debounced).
- Filter by category chips (All plus four catalog categories).
- Combine search and filter. Filters stay in the discovery store for the session.
- Pull to refresh runs `useRefreshCatalog` (+1 activity on success).
- Infinite scroll loads the next page. Soft failures use an inline banner.

## Code map

| Concern               | Location                                                         |
| --------------------- | ---------------------------------------------------------------- |
| Route                 | `src/app/index.tsx`                                              |
| Screen                | `src/screens/explore/`                                           |
| Screen hooks          | `use-explore-list.ts`, `use-explore-refresh.ts`                  |
| Supplied data         | `src/data/activities.ts`, `assets/activities.json`               |
| Seed catalog          | `src/mocks/seed-catalog.ts` (1,012 items)                        |
| Mock list API         | `src/mocks/api.ts` → `listActivities` (paginated)                |
| List query            | `src/hooks/use-activities.ts` (`useSuspenseInfiniteQuery`)       |
| Search / filter store | `src/state/discovery.ts`                                         |
| Shared kit            | `SearchField`, `CategoryChip`, `CategoryChipRow`, `ActivityCard` |
| Schema                | `src/schemas/activity.ts`, `src/schemas/api.ts`                  |

## Related

- [Features index](./index.md)
- [UI states](./ui-states.md)
- [Data layer](./data-layer.md)
- [Product overview](../product/overview.md)
