# Discovery

## Current behavior

- Browse the paginated activity catalog on Explore.
- Explore title search uses the native `Stack.SearchBar` on iOS and Android.
- Category filters keep `A11yPressable` chips (a11y first). Chip row scroll uses RN `ScrollView` so the offset stays put.
- Explore header on iOS 26+ uses soft scroll-edge blur (not a hard cutoff).
- Filter by category chips (All plus four catalog categories).
- Combine search and filter. Filters stay in the discovery store for the session.
- Activity cards show a seeded cover photo with a BlurHash fade-in (`getActivityCoverImage`).
- Pull to refresh runs `useRefreshCatalog` (+1 activity on success).
- Refresh success and failure play Pulsar outcome haptics.
- Infinite scroll loads the next page. Soft failures use an inline banner.
- Explore and Saved use `ScreenFrame`. Explore turns off top padding on native because the stack header owns the top inset.

## Code map

| Concern               | Location                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------ |
| Route                 | `src/app/(explore)/index.tsx`                                                              |
| Explore stack         | `src/app/(explore)/_layout.tsx`                                                            |
| Screen                | `src/screens/explore/`                                                                     |
| Screen hooks          | `use-explore-list.ts`, `use-explore-refresh.ts`                                            |
| Native search         | `explore-native-search.tsx` (`Stack.SearchBar`)                                            |
| Supplied data         | `src/data/activities.ts`, `assets/activities.json`                                         |
| Seed catalog          | `src/mocks/seed-catalog.ts` (1,012 items)                                                  |
| Mock list API         | `src/mocks/api.ts` → `listActivities` (paginated)                                          |
| List query            | `src/hooks/use-activities.ts` (`useSuspenseInfiniteQuery`)                                 |
| Search / filter store | `src/state/discovery.ts`                                                                   |
| Shared kit            | `CategoryChip` (`A11yPressable`), `CategoryChipRow`, `ActivityCard` (`SearchField` on web) |
| Cover photos          | `src/data/activity-image.ts` (`getActivityCoverImage`)                                     |
| Schema                | `src/schemas/activity.ts`, `src/schemas/api.ts`                                            |

## Related

- [Features index](./index.md)
- [UI states](./ui-states.md)
- [Data layer](./data-layer.md)
- [Product overview](../product/overview.md)
