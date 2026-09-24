# Accessibility

## Assessment bar (always)

Explora must **always** support:

1. **Usable navigation** on the main journey (browse → search/filter → detail → favorites → open again offline)
2. **Keyboard behavior** (hardware keyboard focus and activation)
3. **Larger text** (Dynamic Type / system font scaling; primary content and actions stay usable)
4. **Screen-reader access** (VoiceOver / TalkBack labels, roles, order, and announcements)

Library setup alone is not enough. Every a11y rule in this project must serve this bar. Verify the main journey with evidence.

## Status

| Area                         | Status                                                                                 |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| Library + root provider      | Shipped (`react-native-a11y@0.9.0` + SDK 58 patch; provider is a 0.9 passthrough shim) |
| Screen shell + focus helpers | Shipped                                                                                |
| Discovery list / search      | Shipped (Explore list, search field, category chips)                                   |
| Detail / favorites / refresh | Partial (UI shipped; native main-journey evidence remains)                             |
| Scenario 8 evidence          | Not written                                                                            |

## Stack

- Package: [`react-native-a11y`](https://github.com/ArturKalach/react-native-a11y) (pinned). Source and docs: that GitHub repo.
- Always use this library for accessibility work in Explora. Do not add a different a11y library or a parallel focus stack.
- Every screen, every UI component, and every feature must be accessibility-compliant with this stack and with the assessment bar above. Build a11y in the same change as the UI. Do not defer it.
- Native module. Needs a development or release build. It does not run in Expo Go.
- Import only from `@/a11y` or project wrappers under `src/components/a11y-*` and `src/components/screen-frame`.
- Do not install `react-native-a11y-order`, `react-native-external-keyboard`, or other mutually exclusive split packages.

## Project entry points

| Path                               | Role                                          |
| ---------------------------------- | --------------------------------------------- |
| `src/a11y/index.ts`                | Canonical re-exports and helpers              |
| `src/a11y/activity-label.ts`       | Spoken labels for activities and favorites    |
| `src/a11y/announce-status.ts`      | Status announcements after UI state changes   |
| `src/a11y/focus-style.ts`          | Default focus ring + `mergeFocusedStyle`      |
| `src/components/screen-frame/`     | Screen title announcement + content group     |
| `src/components/a11y-pressable/`   | Primary actions                               |
| `src/components/a11y-input/`       | Search and text fields                        |
| `src/components/a11y-card/`        | List rows with inner actions                  |
| `src/components/a11y-focus-trap/`  | Modal and overlay focus lock                  |
| `src/components/a11y-focus-frame/` | Focus frame when a trap is not the right tool |
| `src/app/_layout.tsx`              | Wraps the tree with `A11yProvider`            |

## Rules for every screen, component, and feature

Map every change to the assessment bar.

### Usable navigation

1. Wrap every screen body with `ScreenFrame` and a clear `title`.
2. Prefer `A11yPressable`, `A11yInput`, and `A11yCard` over raw `Pressable` / `TextInput` / plain cards.
3. Keep minimum touch targets about 44×44 pt on iOS and 48×48 dp on Android.
4. Keep browse, search/filter, detail, favorites, and offline reopen reachable and understandable without sighted-only cues.

### Screen-reader access

5. Give every interactive control an `accessibilityLabel`. Add `accessibilityHint` when the result is not obvious.
6. Set `accessibilityRole` to match the control (`button`, `header`, `search`, `link`, and similar).
7. Use `A11y.Order` + `A11y.Index` when visual order and spoken order differ.
8. Announce loading, empty, error, and success with `announceStatus` after the UI updates.
9. `A11y.ScreenChange` announces on mount. When a kept-alive stack screen returns, announce again.
10. For activity rows, use `buildActivityAccessibilityLabel`. For favorite toggles, use `buildFavoriteToggleLabel` and `accessibilityState={{ selected }}`.

### Keyboard behavior

11. Set `focusable={false}` on non-interactive `A11y.View` / `A11y.Index` wrappers. Do not let layout wrappers steal Tab focus.
12. Wrap modals and sheets with `A11yFocusTrap` while they are open. Use `A11yFocusFrame` when a frame fits better.
13. Primary actions must work with Tab / Shift+Tab and Space or Enter on a hardware keyboard.

### Larger text

14. Keep Dynamic Type on. Do not set `allowFontScaling={false}` on journey text.
15. Layout must remain usable at large text sizes. Do not clip primary labels or actions on the main journey.

### Done criteria

16. Treat missing a11y on new or changed UI as incomplete work. Fix it before you call the feature done.
17. Main-journey verification is incomplete until navigation, keyboard, larger text, and screen-reader checks have evidence.

## Feature map (library)

| Need                         | Use                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| Screen open announcement     | `ScreenFrame` → `A11y.ScreenChange`                                                |
| Panel / sheet title          | `A11y.PaneTitle`                                                                   |
| Focus order                  | `A11y.Order` + `A11y.Index`                                                        |
| iOS semantic group           | `A11y.View` `a11yUIContainer` or `A11y.FocusGroup`                                 |
| Card + inner buttons         | `A11yCard`                                                                         |
| Keyboard press / focus ring  | `A11yPressable` / `A11yInput` (`style` callback / managed style; not `focusStyle`) |
| Modal focus lock             | `A11yFocusTrap` / `A11yFocusFrame`                                                 |
| Status message               | `announceStatus` / `announce`                                                      |
| Reader or keyboard connected | `useIsScreenReaderEnabled` / `useIsKeyboardConnected`                              |
| Wrap third-party touchable   | `withKeyboardFocus`                                                                |

## Notes

- List cards use seeded cover photos (`getActivityCoverImage`) with BlurHash placeholders because the catalog JSON has no image URLs. Clay icons stay for empty states and category cues.
- `ScreenFrame` pads the top and horizontal safe areas on Saved and on web Explore. Native Explore uses the stack header for the top inset.
- Search uses the native Stack search field and accessible category controls.
- Search submit, filter selection, and list or chip drag remove search focus.
- The header uses a soft iOS 26 scroll-edge effect. Older iOS uses a low-intensity static blur.
- The compact header title uses a white foreground and a dark shadow over scrolling content.
- Category filters keep `A11yPressable` for labels, selected state, and keyboard focus.
- Chip images are decorative. The translated chip label remains the spoken name.
- Each selected category exposes its selected state. All is selected only when no category is selected.
- Chip row horizontal scroll uses React Native `ScrollView` so the offset does not reset.
- Prefer `@expo/ui` only when a11y and i18n stay intact. Do not swap journey CTAs to `@expo/ui` Button while it lacks project a11y props.
- Do not pass `focusStyle` or `containerFocusStyle`. Use `mergeFocusedStyle` or a `style` callback with `{ focused, pressed }`.
- Native verification needs a development or release build. Expo Go alone is not enough.
- Activity Detail uses `ScreenFrame` and accessible back, favorite, retry, and save controls.
- Detail loading, loaded, not-found, and saved-fallback states use status announcements.

### Expo SDK 58 / React Native 0.88

`react-native-a11y@0.9.0` needs local patches for this SDK pair. Keep them in `patches/react-native-a11y+0.9.0.patch` and apply them with `patch-package` on install.

1. Private React headers are missing from the prebuilt RN Core module map. The patch stubs or rewrites those imports.
2. `RCA11yCardView` must set Fabric `_props` in `initWithFrame`. Without that, the first `updateProps` call aborts.
3. iOS builds set `ios.buildReactNativeFromSource: true` in `expo-build-properties` until upstream a11y supports the public module map.
4. Opt a11y out of RNRepo prebuilds in `rnrepo.config.json` because the native patch must compile from source.

Until a rebuild includes the CardView fix, `src/components/a11y-card` may compose `A11y.View` + pressable instead of the native `A11y.Card` host. Restore native `A11y.Card` after that rebuild.

## Verification

- Write scenario 8 in [verification/scenarios.md](../verification/scenarios.md).
- Cover the full main journey: browse, search or filter, detail, favorite, and offline reopen.
- Prove all four assessment conditions: usable navigation, hardware keyboard, larger text, and VoiceOver or TalkBack.
- Record device, OS, text size setting, and build type in the scenario evidence.

## Related

- Library source and docs: [ArturKalach/react-native-a11y](https://github.com/ArturKalach/react-native-a11y)
- ADR: [ADR-005 react-native-a11y](../decisions/adr-005-react-native-a11y.md)
- Assessment: [requirements.md](../assessment/requirements.md)
- Agent rules: root `AGENTS.md`
