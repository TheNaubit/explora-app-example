# Discovery

## Current behavior

- Browse the paginated activity catalog on Explore.
- iOS uses one custom header for the title, search field, and category filters.
- Reanimated moves the complete iOS header panel from the normalized list scroll offset.
- The chip row stays inside the same header surface during the collapse.
- iOS 26 uses a soft native scroll-edge effect. Older iOS uses a low-intensity static blur.
- Android keeps the native `Stack.SearchBar`. Its category filters stay in the list header.
- The custom search field keeps one centered text line. Submit, filter selection, or scroll drag removes its focus.
- Category filters keep `A11yPressable` chips (a11y first). Chip row scroll uses RN `ScrollView` so the offset stays put.
- Soft edge fades show when more chips exist beyond a horizontal edge. Each fade disappears at its scroll limit.
- Each chip includes a decorative claymorphic image generated from the canonical illustration reference.
- The selected chip keeps its glass texture and adds a light translucent accent tint.
- Filter by category chips (All plus four catalog categories).
- Combine search and filter. Filters stay in the discovery store for the session.
- Activity cards show a seeded cover photo with a BlurHash fade-in (`getActivityCoverImage`).
- Native Explore uses a focused vertical card carousel through `AnimatedLegendList`.
- Reanimated derives card scale and opacity from the list scroll offset.
- Fast interval snapping keeps one card focused and leaves adjacent cards visible.
- A soft Pulsar detent plays once when a new card settles.
- Reduced motion, web, and large text use the standard vertical list.
- Pull to refresh runs `useRefreshCatalog` (+1 activity on success).
- Refresh success and failure play Pulsar outcome haptics.
- Infinite scroll loads the next page. Soft failures use an inline banner.
- Explore and Saved use `ScreenFrame`. Explore turns off top padding on native because the stack header owns the top inset.

## Code map

| Concern               | Location                                                                           |
| --------------------- | ---------------------------------------------------------------------------------- |
| Route                 | `src/app/(explore)/index.tsx`                                                      |
| Explore stack         | `src/app/(explore)/_layout.tsx`                                                    |
| Screen                | `src/screens/explore/`                                                             |
| Screen hooks          | `use-explore-list.ts`, `use-explore-refresh.ts`                                    |
| Native search         | `explore-native-search.tsx` (`Stack.SearchBar`)                                    |
| Custom iOS header     | `explore-custom-header.tsx` (`@bsky.app/expo-scroll-edge-effect`)                  |
| Focused card motion   | `explore-activity-card.tsx`, `explore-list.tsx`                                    |
| Supplied data         | `src/data/activities.ts`, `assets/activities.json`                                 |
| Seed catalog          | `src/mocks/seed-catalog.ts` (1,012 items)                                          |
| Mock list API         | `src/mocks/api.ts` → `listActivities` (paginated)                                  |
| List query            | `src/hooks/use-activities.ts` (`useSuspenseInfiniteQuery`)                         |
| Search / filter store | `src/state/discovery.ts`                                                           |
| Shared kit            | `CategoryChip` (`A11yPressable`), `CategoryChipRow`, `ActivityCard`, `SearchField` |
| Cover photos          | `src/data/activity-image.ts` (`getActivityCoverImage`)                             |
| Schema                | `src/schemas/activity.ts`, `src/schemas/api.ts`                                    |

## Related

- [Features index](./index.md)
- [UI states](./ui-states.md)
- [Data layer](./data-layer.md)
- [Product overview](../product/overview.md)
