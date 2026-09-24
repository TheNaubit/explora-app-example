# Activity detail

## Current behavior

- Activity cards in Explore and Saved open `/activity/[id]`.
- Both tabs push the route in their own Expo Router stack.
- Back returns to the previous tab state.
- Search, category filters, and Explore scroll position stay in memory.
- The screen shows category, title, description, location, and duration.
- The right hero control saves or removes the activity.
- The heart is filled when the activity is saved.
- A saved activity snapshot appears immediately and remains available offline.
- A failed snapshot refetch keeps the saved copy visible.
- Loading uses a hero and content skeleton.
- An invalid activity id shows a not-found state with a back action.
- Other first-load errors use the shared Query error boundary.
- The calendar section lets the user choose a future date and start time.
- Add to Calendar calculates the end time from the activity duration.
- The system event form receives the title, location, and description.
- The calendar flow handles validation, permission, cancel, success, and native error states.

## Zoom transition

The card image uses `Link.AppleZoom`. The hero uses `Link.AppleZoomTarget`.

Expo Router uses the native zoom transition on iOS 18 and later. Other platforms use the standard stack transition.

The detail screen hides the native header. This avoids the known iOS header limitation during zoom transitions.

Android uses the same route, content, actions, and state handling. Android runtime verification is pending.

## Accessibility and i18n

- `ScreenFrame` announces the screen.
- Loading, loaded, not-found, and saved-fallback states use status announcements.
- Back, favorite, and retry actions use accessible project controls.
- Text scales with Dynamic Type and can wrap.
- All user-facing copy uses Lingui messages.
- The schedule trigger and calendar action support keyboard activation and clear focus styles.
- The iOS schedule sheet traps focus while it is open.

## Code map

| Concern            | Location                                                                      |
| ------------------ | ----------------------------------------------------------------------------- |
| Shared route       | `src/app/(explore,saved)/activity/[id].tsx`                                   |
| Screen             | `src/screens/activity-detail/`                                                |
| Detail query       | `src/hooks/use-activity.ts`                                                   |
| Card zoom source   | `src/components/activity-card/index.tsx`                                      |
| Shared tab stacks  | `src/app/(explore,saved)/_layout.tsx`                                         |
| Automated coverage | `src/screens/activity-detail/*.test.tsx`                                      |
| Calendar feature   | `src/calendar/` and `src/screens/activity-detail/add-to-calendar-section.tsx` |

## Related

- [Navigation](./navigation.md)
- [Favorites + offline](./favorites-offline.md)
- [Data layer](./data-layer.md)
- [Async UI states](./ui-states.md)
- [Accessibility](./accessibility.md)
- [Native calendar](./native-calendar.md)
