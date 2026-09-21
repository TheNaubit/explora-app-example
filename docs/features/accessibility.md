# Accessibility

Explora must stay usable with VoiceOver, TalkBack, Dynamic Type, and a hardware keyboard on the main journey.

## Status

| Area                         | Status                                                                  |
| ---------------------------- | ----------------------------------------------------------------------- |
| Library + root provider      | Shipped (`react-native-a11y@0.9.0`; provider is a 0.9 passthrough shim) |
| Screen shell + focus helpers | Shipped                                                                 |
| Discovery list / search      | Not implemented (use rules below when built)                            |
| Detail / favorites / refresh | Not implemented (use rules below when built)                            |
| Scenario 8 evidence          | Not written                                                             |

## Stack

- Package: `react-native-a11y` (pinned). Native module. Needs a development or release build. It does not run in Expo Go.
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

## Rules for new UI

1. Wrap every screen body with `ScreenFrame` and a clear `title`.
2. Give every interactive control an `accessibilityLabel`. Add `accessibilityHint` when the result is not obvious.
3. Set `accessibilityRole` to match the control (`button`, `header`, `search`, `link`, and similar).
4. Prefer `A11yPressable`, `A11yInput`, and `A11yCard` over raw `Pressable` / `TextInput` / plain cards.
5. Use `A11y.Order` + `A11y.Index` when visual order and spoken order differ.
6. Set `focusable={false}` on non-interactive `A11y.View` / `A11y.Index` wrappers. Do not let layout wrappers steal Tab focus.
7. Wrap modals and sheets with `A11yFocusTrap` while they are open. Use `A11yFocusFrame` when a frame fits better.
8. Announce loading, empty, error, and success with `announceStatus` after the UI updates.
9. Keep Dynamic Type on. Do not set `allowFontScaling={false}` on journey text.
10. Keep minimum touch targets about 44×44 pt on iOS and 48×48 dp on Android.
11. For activity rows, use `buildActivityAccessibilityLabel`. For favorite toggles, use `buildFavoriteToggleLabel` and `accessibilityState={{ selected }}`.
12. `A11y.ScreenChange` announces on mount. When a kept-alive stack screen returns, announce again.

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

- `A11yProvider` in 0.9.0 is a passthrough for older apps. Keep it at the root for a stable mount point.
- Interactive wrappers (`A11yPressable`, `A11yInput`, `A11yCard`, traps) ship for future screens. Home has no controls yet.
- Do not pass `focusStyle` or `containerFocusStyle`. Use `mergeFocusedStyle` or a `style` callback with `{ focused, pressed }`.
- Native verification needs `npx expo prebuild` or `npx expo run:ios|android`. Expo Go alone is not enough.

## Verification

- Write scenario 8 in [verification/scenarios.md](../verification/scenarios.md).
- Cover browse, search or filter, detail, favorite, and offline reopen with VoiceOver or TalkBack.
- Check Tab / Shift+Tab and Space or Enter on a hardware keyboard for primary actions.
- Record device, OS, and build type in the scenario evidence.

## Related

- ADR: [ADR-005 react-native-a11y](../decisions/adr-005-react-native-a11y.md)
- Assessment: [requirements.md](../assessment/requirements.md)
- Agent rules: root `AGENTS.md`
