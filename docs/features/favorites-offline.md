# Favorites + offline

## Current behavior

- Users can save and remove favorites from activity cards (`FavoriteButton`).
- Save and remove play Pulsar haptics (`hapticFavoriteSaved` / `hapticFavoriteRemoved`).
- Each save stores the full `Activity` payload in MMKV for offline detail.
- Favorites survive app relaunch.
- Refresh success or failure does not clear favorites.
- The **Favorites** tab lists favorite snapshots and shows an empty state when none exist.
- When favorites exist, one line below the title states the count and "Available offline".
- The Favorites empty state uses a centered composition and a transparent clay illustration.
- The empty-state action switches to the Explore tab.
- Removing a card from Favorites dissolves its captured surface through one Skia GPU shader.
- The shader evaluates dense particle blocks on the GPU and moves the dust toward the top-right.
- The dust remains visible for approximately 1.1 seconds.
- The effect does not run per-particle worklet callbacks.
- The list reflows for 800 milliseconds and scrolls smoothly to the selected replacement card.
- Reduced Motion and web remove the card immediately without spatial particle motion.
- The favorite changes only after the effect completes. A snapshot failure uses immediate removal.
- Favorites uses the same focused card carousel and collapsing header as Explore.
- Favorites shows only its title above the list. It does not show a subtitle.
- Favorites does not show search, category filters, refresh, or pagination.
- Cards in Explore and Favorites open the shared Activity Detail route.
- Activity Detail reads the saved snapshot before it refetches current data.
- A failed refetch keeps the saved snapshot visible with a retry action.

## Code map

| Concern          | Location                                |
| ---------------- | --------------------------------------- |
| Persist store    | `src/state/favorites.ts`                |
| React helpers    | `src/hooks/use-favorites.ts`            |
| Favorites screen | `src/screens/favorites/`                |
| Favorites route  | `src/app/(explore,favorites)/index.tsx` |
| Detail screen    | `src/screens/activity-detail/`          |
| Unit tests       | `src/state/favorites.test.ts`           |

## Verification

- Persistence and saved-detail fallback pass in Jest and Maestro.
- The Android 16 emulator reopened a saved detail with Wi-Fi and mobile data disabled.
- The complete Android core journey also passed after an app process restart.

## Related

- [Navigation](./navigation.md)
- [Data layer](./data-layer.md)
- [Activity detail](./activity-detail.md)
- [ADR-011](../decisions/adr-011-query-legend-local-first.md)
