# Favorites + offline

## Current behavior

- Users can save and remove favorites from activity cards (`FavoriteButton`).
- Save and remove play Pulsar haptics (`hapticFavoriteSaved` / `hapticFavoriteRemoved`).
- Each save stores the full `Activity` payload in MMKV for offline detail.
- Favorites survive app relaunch.
- Refresh success or failure does not clear favorites.
- The **Saved** tab lists favorite snapshots and shows an empty state when none exist.
- Saved uses the same focused card carousel and collapsing header as Explore.
- Saved shows only its title above the list. It does not show a subtitle.
- Saved does not show search, category filters, refresh, or pagination.
- Detail push from Saved is not wired yet.

## Code map

| Concern       | Location                      |
| ------------- | ----------------------------- |
| Persist store | `src/state/favorites.ts`      |
| React helpers | `src/hooks/use-favorites.ts`  |
| Saved screen  | `src/screens/saved/`          |
| Saved route   | `src/app/saved.tsx`           |
| Unit tests    | `src/state/favorites.test.ts` |

## Related

- [Navigation](./navigation.md)
- [Data layer](./data-layer.md)
- [ADR-011](../decisions/adr-011-query-legend-local-first.md)
