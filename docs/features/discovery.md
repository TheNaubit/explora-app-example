# Discovery

## Target behavior

- Browse the activity catalog.
- Search by title.
- Filter by category.
- Combine search and filter.
- Keep search and filter after return from detail.

## Current implementation

- The Home screen shows that the supplied catalog loads (`src/screens/home`, `src/data/activities.ts`).
- Full list, search, and filter UI: not implemented.

## Code map

| Concern       | Location                                           |
| ------------- | -------------------------------------------------- |
| Route         | `src/app/index.tsx`                                |
| Screen        | `src/screens/home/`                                |
| Supplied data | `src/data/activities.ts`, `assets/activities.json` |
| Schema        | `src/schemas/activity.ts`                          |

## Related

- [Features index](./index.md)
- [Product overview](../product/overview.md)
