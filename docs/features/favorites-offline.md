# Favorites + offline

## Current behavior

- Users can save and remove favorites in the data layer (`addFavorite` / `removeFavorite`).
- Each save stores the full `Activity` payload in MMKV for offline detail.
- Favorites survive app relaunch.
- Refresh success or failure does not clear favorites.
- Saved list and detail screens are not wired yet.

## Code map

| Concern       | Location                      |
| ------------- | ----------------------------- |
| Persist store | `src/state/favorites.ts`      |
| React helpers | `src/hooks/use-favorites.ts`  |
| Unit tests    | `src/state/favorites.test.ts` |

## Related

- [Data layer](./data-layer.md)
- [ADR-011](../decisions/adr-011-query-legend-local-first.md)
