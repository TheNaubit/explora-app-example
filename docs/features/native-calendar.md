# Native calendar

## Purpose

Activity Detail lets the user plan an activity in the system calendar.

The feature stays local. Explora does not send calendar data to a backend.

## Current behavior

1. Open an activity.
2. Select **Date and start time**.
3. Choose a future date and start time.
4. Select **Add to Calendar**.
5. Review the pre-filled event in the system calendar form.
6. Save or cancel the event.

Explora pre-fills the activity title, location, and description.

Explora calculates the end time from `durationMinutes`.

The operation rejects these inputs before it requests permission:

- No selected date.
- A start time that is not in the future.
- A missing or malformed activity field.
- A non-positive, non-integer, or invalid duration.

The coordinator accepts one active operation. A second submission returns a duplicate result.

## Platform behavior

### iOS

- Explora requests write-only calendar access.
- The config plugin omits full calendar access.
- Explora uses the default write-only EventKit calendar proxy.
- The system event form reports saved and canceled results.
- Permanent denial shows an **Open Settings** action.

### Android

- Explora opens the system calendar event form.
- Explora does not request calendar read or write permission.
- The form stays active in the same task, so duplicate protection remains active.
- Android returns `done` for saved and canceled forms.
- Explora states this platform limit after the form closes.

## UI states

| State                  | Result                                                      |
| ---------------------- | ----------------------------------------------------------- |
| No schedule            | Show a clear validation message.                            |
| Past schedule          | Ask for a future time.                                      |
| Permission denied      | Explain the denial and offer a retry.                       |
| Permission blocked     | Explain the system setting and offer **Open Settings**.     |
| Native form active     | Disable the main action and show **Opening Calendar…**.     |
| Saved on iOS           | Confirm that the system calendar saved the event.           |
| Canceled on iOS        | Confirm that no event was added.                            |
| Form closed on Android | State that Android does not report the final form decision. |
| Native error           | Keep the schedule and offer a retry.                        |

## Accessibility and localization

- Project pressable controls provide labels, roles, hints, focus rings, and keyboard activation.
- The iOS schedule sheet uses `A11yFocusTrap` while it is open.
- Date and time controls use native `@expo/ui` pickers.
- Text supports Dynamic Type and wraps at larger sizes.
- Status changes use alert semantics and spoken announcements.
- All user-facing copy uses Lingui.
- The iOS permission text lives in `src/locales/native/en.json`.

## Code map

| Concern              | Location                                                     |
| -------------------- | ------------------------------------------------------------ |
| Validation and lock  | `src/calendar/add-to-calendar.ts`                            |
| Expo Calendar bridge | `src/calendar/native-calendar.ts`                            |
| Activity Detail UI   | `src/screens/activity-detail/add-to-calendar-section.tsx`    |
| Native schedule UI   | `src/screens/activity-detail/calendar-schedule-picker.*.tsx` |
| Behavior tests       | `src/calendar/add-to-calendar.test.ts`                       |
| Native config        | `app.config.ts`                                              |

## Verification status

- Automated behavior verification: passed on 2026-09-24.
- Local iOS development build: passed on 2026-09-24.
- iOS 27.0 Simulator runtime verification: passed on 2026-09-24.
- Android native runtime verification: not run because this machine has no Android runtime.

The iOS runtime check covered invalid input, write-only permission, blocked permission, native form cancellation, save success, and duplicate protection.

The native event form showed the title, location, description, start time, and calculated end time.

See [scenario 6](../verification/scenarios.md#scenario-6-native-calendar) for the observed values and screenshots.

Do not treat unit tests as native runtime evidence.

## Related

- [Activity detail](./activity-detail.md)
- [Accessibility](./accessibility.md)
- [Internationalization](./internationalization.md)
- [Scenario 6](../verification/scenarios.md#scenario-6-native-calendar)
