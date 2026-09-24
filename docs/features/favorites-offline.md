# Favorites + offline

## Current behavior

- Users can save and remove favorites from activity cards (`FavoriteButton`).
- Save and remove play Pulsar haptics (`hapticFavoriteSaved` / `hapticFavoriteRemoved`).
- Each save stores the full `Activity` payload in MMKV for offline detail.
- Favorites survive app relaunch.
- Refresh success or failure does not clear favorites.
- The **Saved** tab lists favorite snapshots and shows an empty state when none exist.
- The Saved empty state uses a centered composition and a transparent clay illustration.
- Removing a card from Saved dissolves its captured surface through a batched Skia particle atlas.
- The dust remains visible for approximately 1.1 seconds and uses a dense iOS particle grid.
- The list reflows for 800 milliseconds and scrolls smoothly to the selected replacement card.
- Reduced Motion and web remove the card immediately without spatial particle motion.
- The favorite changes only after the effect completes. A snapshot failure uses immediate removal.
- Saved uses the same focused card carousel and collapsing header as Explore.
- Saved shows only its title above the list. It does not show a subtitle.
- Saved does not show search, category filters, refresh, or pagination.
- Cards in Explore and Saved open the shared Activity Detail route.
- Activity Detail reads the saved snapshot before it refetches current data.
- A failed refetch keeps the saved snapshot visible with a retry action.

## Code map

| Concern       | Location                            |
| ------------- | ----------------------------------- |
| Persist store | `src/state/favorites.ts`            |
| React helpers | `src/hooks/use-favorites.ts`        |
| Saved screen  | `src/screens/saved/`                |
| Saved route   | `src/app/(explore,saved)/index.tsx` |
| Detail screen | `src/screens/activity-detail/`      |
| Unit tests    | `src/state/favorites.test.ts`       |

## Related

- [Navigation](./navigation.md)
- [Data layer](./data-layer.md)
- [Activity detail](./activity-detail.md)
- [ADR-011](../decisions/adr-011-query-legend-local-first.md)
