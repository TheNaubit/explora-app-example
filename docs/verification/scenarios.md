# Verification scenarios

The assessment expects **6–8** scenarios with steps, expected behavior, observed results, and evidence. Track them here as you define and run them.

| #   | Scenario                        | Covers                         | Status                                                                       |
| --- | ------------------------------- | ------------------------------ | ---------------------------------------------------------------------------- |
| 1   | Core journey                    | Browse → detail → favorite     | Not written                                                                  |
| 2   | Generated-item refresh          | Successful refresh +1          | Not written                                                                  |
| 3   | Persistence / offline favorites | Relaunch + offline detail      | Not written                                                                  |
| 4   | Failure recovery                | Failed refresh adds nothing    | Not written                                                                  |
| 5   | Lifecycle interruptions         | Background / delayed results   | Not written                                                                  |
| 6   | Native calendar                 | Permissions / cancel / invalid | Passed on iOS; Android runtime unavailable                                   |
| 7   | Performance (≥1k)               | Scroll / search + measurement  | Not written                                                                  |
| 8   | Accessibility                   | Main journey accessibility     | Outline only — see [features/accessibility.md](../features/accessibility.md) |

When you specify or run a scenario, expand it here or add `scenarios/<name>.md` and link it from this table.

## Scenario 6: Native calendar

### Environment

- Platform: Explora iPhone 18 Pro Simulator on iOS 27.0.
- App build: local development build `build-1790261620671.tar.gz`.
- Activity: local activity `ref-0005`, with a 35-minute duration.
- Runtime date: 2026-09-24.
- Android runtime: unavailable on this machine.

### Steps and expected results

| Step | Action                                                        | Expected result                                                      |
| ---- | ------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1    | Open Activity Detail.                                         | The calendar section shows no selected schedule.                     |
| 2    | Select **Add to Calendar** without a schedule.                | Explora rejects the input before a permission request.               |
| 3    | Choose a past time and submit.                                | Explora asks for a future time.                                      |
| 4    | Choose a future date and start time.                          | Explora shows the localized date and time.                           |
| 5    | Select **Add to Calendar**, then deny permission.             | Explora shows the denied or blocked state.                           |
| 6    | If blocked, open Settings and allow calendar write access.    | Explora returns to a retryable state.                                |
| 7    | Submit again and inspect the system event form.               | Title, location, description, start, and calculated end are correct. |
| 8    | Cancel the system event form.                                 | Explora confirms that no event was added.                            |
| 9    | Submit again and save the event.                              | Explora confirms success.                                            |
| 10   | Try a second submit while the first operation remains active. | The action stays disabled and only one native form opens.            |

### Observed result

Passed on the iOS 27.0 Simulator.

1. A submission without a schedule showed **Choose a date and time**.
2. The permission prompt asked to add events only.
3. Denial produced the blocked state and an **Open Settings** action.
4. The system form showed the activity title, location, and description.
5. The form showed 18:01–18:36 for a 35-minute activity.
6. Two immediate submit taps opened one system form.
7. Closing the form showed **Event not added**.
8. Saving the form showed **Added to Calendar**.

The focused Jest tests cover past dates, malformed data, invalid durations, both denial states, native errors, and duplicate protection.

### Evidence

- Automated: `src/calendar/add-to-calendar.test.ts`.
- UI validation: `src/screens/activity-detail/activity-detail.test.tsx`.
- Invalid input: [`ios-invalid-input.jpg`](./evidence/native-calendar/ios-invalid-input.jpg).
- Write-only prompt: [`ios-write-only-permission.jpg`](./evidence/native-calendar/ios-write-only-permission.jpg).
- Blocked permission: [`ios-permission-blocked.jpg`](./evidence/native-calendar/ios-permission-blocked.jpg).
- Pre-filled system form: [`ios-native-event-form.jpg`](./evidence/native-calendar/ios-native-event-form.jpg).
- Canceled state: [`ios-canceled.jpg`](./evidence/native-calendar/ios-canceled.jpg).
- Saved state: [`ios-saved.jpg`](./evidence/native-calendar/ios-saved.jpg).
- Native build: `dist/eas-builds/build-1790261620671.tar.gz`.
- Build metadata contains `NSCalendarsWriteOnlyAccessUsageDescription`.
- Build metadata does not contain `NSCalendarsFullAccessUsageDescription`.

### Limits

Android does not report whether its system form saved or canceled an event.

Android runtime behavior remains unverified because this machine has no Android runtime.
