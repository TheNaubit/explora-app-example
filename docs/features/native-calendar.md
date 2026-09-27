# Native calendar

## Purpose

Activity Detail lets the user plan an activity in the system calendar.

The feature stays local. Explora does not send calendar data to a backend.

## Current behavior

1. Open an activity.
2. Select **Add to Calendar**.
3. Choose a future date and start time.
4. Select **Done** in the sheet header.
5. On iOS, review the event in the system calendar form.
6. On Android, allow calendar access when the system asks.
7. Save or cancel the iOS event form.

Explora adds the activity title, location, and description.

Explora calculates the end time from `durationMinutes`.

The operation rejects these inputs before it requests permission:

- No selected date.
- A start time that is not in the future.
- A missing or malformed activity field.
- A non-positive, non-integer, or invalid duration.

The coordinator accepts one active operation. A second submission returns a duplicate result.

## Platform behavior

### iOS

- Activity Detail shows one full-width calendar action.
- The action uses a leading calendar icon and has no disclosure chevron.
- The action opens a fitted native SwiftUI sheet.
- The sheet has no drag handle and does not allow swipe dismissal.
- The header uses native Liquid Glass buttons on iOS 26 and later.
- Earlier iOS versions use native bordered button styles.
- One native SwiftUI picker selects both the date and time.
- Explora requests write-only calendar access.
- The config plugin omits full calendar access.
- Explora uses the default write-only EventKit calendar proxy.
- The system event form reports saved and canceled results.
- Permanent denial shows an **Open Settings** action.

### Android

- Android opens native date and time dialogs in sequence.
- Expo UI has no combined Android date and time picker.
- Explora requests calendar access after the user selects **Done**.
- Explora selects a writable event calendar.
- Explora adds the event directly with Expo Calendar.
- Explora waits for the date-time dialog to release focus before it shows save feedback.
- A successful write shows one native success toast and matching haptic.
- Permission denial and native errors show one inline recovery surface.
- Local picker cancellation stays silent.

## UI states

| State               | Result                                                    |
| ------------------- | --------------------------------------------------------- |
| Schedule sheet open | Show one fitted native picker and header actions on iOS.  |
| Schedule canceled   | Close the controls and do not request permission.         |
| Past schedule       | Ask for a future time.                                    |
| Permission denied   | Explain the denial and offer a retry.                     |
| Permission blocked  | Explain the system setting and offer **Open Settings**.   |
| Native work active  | Disable the main action and show **Adding to Calendar…**. |
| Saved               | Show one native success toast and matching haptic.        |
| Canceled on iOS     | Return to Activity Detail without a status message.       |
| Native error        | Keep the schedule and offer a retry.                      |

## Accessibility and localization

- Project pressable controls provide labels, roles, hints, focus rings, and keyboard activation.
- The native iOS sheet contains focus until **Cancel** or **Done** closes it.
- Date and time controls use native `@expo/ui` pickers.
- Text supports Dynamic Type and wraps at larger sizes.
- A confirmed save uses one native success toast and a matching semantic haptic.
- Local cancellation and iOS form cancellation stay silent.
- Permission, validation, and native errors use one inline recovery surface.
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

- Automated behavior verification: passed on 2026-09-26.
- Local iOS development build: passed on 2026-09-24.
- iOS 27.0 Simulator runtime verification: passed on 2026-09-24.
- Current iOS release archive EventKit verification: passed on 2026-09-27.
- Android 16 emulator runtime verification: passed on 2026-09-26.

The iOS runtime check covered invalid input, write-only permission, blocked permission, native form cancellation, save success, and duplicate protection.

The current release check repeated permission denial, add-only permission, system-form cancellation, and save success.

The native event form showed the title, location, description, start time, and calculated end time.

The Android development and release checks covered cancellation, permission, direct event creation, and visible success feedback.

The Android native feedback module reported **Ready** after the module bridge fix.

The current Android release flow passed without Metro on `build-1790507141918.apk`.

See [scenario 6](../verification/scenarios.md#scenario-6-native-calendar) for the observed values and screenshots.

Do not treat unit tests as native runtime evidence.

## Related

- [Activity detail](./activity-detail.md)
- [Accessibility](./accessibility.md)
- [Internationalization](./internationalization.md)
- [Scenario 6](../verification/scenarios.md#scenario-6-native-calendar)
