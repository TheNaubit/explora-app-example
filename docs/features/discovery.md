# Discovery

## Current behavior

- Browse the complete paginated catalog on Explore.
- Search and category filters stay on Explore.
- iOS and web use the shared `SearchField` in the Explore header.
- Android uses a stacked `Stack.SearchBar` in the Explore Stack header.
- Category filters keep `A11yPressable` chips (a11y first). Chip row scroll uses RN `ScrollView` so the offset stays put.
- Soft edge fades show when more chips exist beyond a horizontal edge. Each fade disappears at its scroll limit.
- Each chip includes a decorative claymorphic image generated from the canonical illustration reference.
- The selected chip keeps its glass texture and adds a light translucent accent tint.
- Select multiple category chips. A result can match any selected category.
- All clears the category selection and becomes the only selected chip.
- Combine search and filter. Filters stay in the discovery store for the session.
- Activity cards show a seeded cover photo with a BlurHash fade-in (`getActivityCoverImage`).
- Card text sits inside the lower cover region.
- One continuous alpha mask changes that region from the sharp cover to a blurred copy.
- A dark translucent scrim keeps text readable and preserves the image color.
- The card has no pale band or hard image-to-body seam.
- Category stays as plain metadata. Category pills remain in the header filter row.
- Native Explore uses a focused vertical card carousel through `AnimatedLegendList`.
- Reanimated derives card scale, opacity, and image focus from the list scroll offset.
- Unfocused card images use a light static blur layer. The layer fades out as each card reaches focus.
- Fast interval snapping keeps one card focused and leaves adjacent cards visible.
- A soft Pulsar detent plays once when a new card settles.
- Reduced motion, web, and large text use the standard vertical list.
- Pull distance grows one stroke around a complete gray app-mark track.
- Pull progress increases the mark opacity and scale. Partial pulls stay translucent and smaller.
- The stroke blends from the primary text color to the accent color.
- A completed pull shows the full hollow outline without a state jump.
- Pulsar real-time feedback gains tension with the pull. It reverses when the pull distance decreases.
- Reaching the complete pull threshold starts refresh immediately.
- The gesture commits once. Later scroll and native release callbacks cannot start another request.
- Incomplete pulls reset when the drag ends. Rebound scroll events cannot reopen the pull state.
- Completed pulls reset after refresh ends.
- The custom mark shows a loading sweep while the refresh request is pending.
- A successful refresh adds one activity at the start of the catalog.
- Refresh-added activities keep their order and stable IDs after a cold app launch.
- Refresh success and failure play Pulsar outcome haptics.
- Infinite scroll loads the next page. Soft failures use an inline banner.
- Native Explore uses its platform header and content insets. Web and Saved use `ScreenFrame`.

## Code map

| Concern               | Location                                                                           |
| --------------------- | ---------------------------------------------------------------------------------- |
| Route                 | `src/app/(explore,saved)/index.tsx`                                                |
| Explore stack         | `src/app/(explore,saved)/_layout.tsx`                                              |
| Screen                | `src/screens/explore/`                                                             |
| Screen hooks          | `use-explore-list.ts`, `use-explore-refresh.ts`                                    |
| Header search         | `explore-custom-header.tsx`, `explore-native-search.tsx`                           |
| Focused card motion   | `explore-activity-card.tsx`, `explore-list.tsx`                                    |
| Pull to refresh       | `src/components/pull-to-refresh/`, `use-explore-refresh.ts`                        |
| Supplied data         | `src/data/activities.ts`, `assets/activities.json`                                 |
| Seed catalog          | `src/mocks/seed-catalog.ts` (1,012 items)                                          |
| Refresh persistence   | `src/mocks/catalog-store.ts`, MMKV                                                 |
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
- [Threads pull-to-refresh reference](../design/references/threads-pull-to-refresh-analysis/animation-spec.md)
