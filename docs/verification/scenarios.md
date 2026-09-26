# Verification scenarios

The assessment expects **6–8** scenarios with steps, expected behavior, observed results, and evidence. Track them here as you define and run them.

| #   | Scenario                        | Covers                                     | Status                                                                     |
| --- | ------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------- |
| 1   | Core journey                    | Search/filter → detail → favorite → reopen | Maestro assessment flow passed on iOS Simulator                            |
| 2   | Generated-item refresh          | Successful refresh +1                      | Maestro count check passed on iOS Simulator                                |
| 3   | Persistence / offline favorites | Relaunch + offline detail                  | Relaunch and saved fallback passed; device-offline run remains required    |
| 4   | Failure recovery                | Failed refresh adds nothing                | Jest and Maestro state checks passed on iOS Simulator                      |
| 5   | Lifecycle interruptions         | Background / delayed results               | Maestro slow-load background and resume passed on iOS Simulator            |
| 6   | Native calendar                 | Permissions / cancel / invalid             | Passed on iOS; Android runtime unavailable                                 |
| 7   | Performance (≥1k)               | Scroll / search + measurement              | Not measured in this development run; release evidence remains required    |
| 8   | Accessibility                   | Main journey accessibility                 | Catalog state flow passed with larger text; full screen-reader run remains |

When you specify or run a scenario, expand it here or add `scenarios/<name>.md` and link it from this table.

## Scenario 1: Core journey

### Steps and expected results

| Step | Action                                           | Expected result                                         |
| ---- | ------------------------------------------------ | ------------------------------------------------------- |
| 1    | Open Explore.                                    | The catalog loads with at least 1,000 local activities. |
| 2    | Search for `Botanical Garden Walk`.              | Only the matching activity remains visible.             |
| 3    | Select the Outdoors category.                    | The matching outdoor activity remains visible.          |
| 4    | Open the activity and return to Explore.         | Search and category state stay active.                  |
| 5    | Save the activity and open Favorites.            | Favorites contains the saved activity.                  |
| 6    | Open the saved detail.                           | The detail shows the same activity.                     |
| 7    | Close and relaunch the app, then open Favorites. | The saved activity remains available.                   |

### Observed result

Passed on the iOS 27.0 Simulator on 2026-09-25.

The Maestro flow completed all seven steps. The process restart kept the favorite.

### Evidence

- Maestro: `.maestro/flows/core-journey.yaml`.
- Command: `npm run test:e2e:assessment:ios`.
- JUnit output: `artifacts/maestro/results.xml`.

## Scenario 2: Generated-item refresh

### Steps and expected results

| Step | Action                                   | Expected result                                         |
| ---- | ---------------------------------------- | ------------------------------------------------------- |
| 1    | Reset local data.                        | The catalog reports 1,012 activities.                   |
| 2    | Select successful refresh in Dev Tools.  | The next refresh uses the successful response.          |
| 3    | Pull Explore past the refresh threshold. | One request starts and the refresh indicator appears.   |
| 4    | Wait for completion.                     | The catalog reports 1,013 activities.                   |
| 5    | Inspect the activity list.               | The generated activity supports normal catalog actions. |

### Observed result

Passed on the iOS 27.0 Simulator on 2026-09-25.

The refresh added exactly one activity. Routine success produced no toast.

### Evidence

- Maestro: `.maestro/flows/refresh-integrity.yaml`.
- Jest: `src/mocks/api.test.ts`.
- Jest: `src/screens/explore/use-explore-refresh.test.ts`.

## Scenario 3: Persistence and offline favorites

### Steps and expected results

| Step | Action                                          | Expected result                                  |
| ---- | ----------------------------------------------- | ------------------------------------------------ |
| 1    | Save `Botanical Garden Walk`.                   | Favorites contains one saved activity.           |
| 2    | Stop and relaunch the app.                      | The favorite remains saved.                      |
| 3    | Select detail failure in Dev Tools.             | Detail requests fail with a local offline error. |
| 4    | Open the saved activity from Favorites.         | The persisted snapshot remains usable.           |
| 5    | Disable device networking and relaunch the app. | The saved detail still opens without a server.   |

### Observed result

Steps 1–4 passed on the iOS 27.0 Simulator on 2026-09-25.

Step 5 remains pending. The review mode simulates a request failure. It does not disable device networking.

### Evidence

- Persistence: `.maestro/flows/core-journey.yaml`.
- Saved fallback: `.maestro/flows/favorite-offline-fallback.yaml`.
- Storage tests: `src/state/favorites.test.ts`.

## Scenario 4: Failure recovery

### Steps and expected results

| Step | Action                                                    | Expected result                                                    |
| ---- | --------------------------------------------------------- | ------------------------------------------------------------------ |
| 1    | Select a refresh failure in Dev Tools.                    | The next refresh uses the selected failure.                        |
| 2    | Refresh Explore.                                          | Current activities remain visible.                                 |
| 3    | Inspect feedback.                                         | One native error toast appears. No inline duplicate appears.       |
| 4    | Inspect the catalog count.                                | The failed refresh adds no activity.                               |
| 5    | Select a later-page failure and reach the next page.      | One inline recovery surface appears with one retry action.         |
| 6    | Select an initial-load failure and clear cached requests. | The full-screen recovery surface appears without a render overlay. |
| 7    | Select a temporary saved-detail failure.                  | The saved detail stays visible with one error toast.               |

### Observed result

Automated verification passed on 2026-09-24.

- Refresh success stays silent.
- Refresh failure keeps content and shows one error toast.
- Failed and timed-out refresh requests add no activity.
- Later-page failure uses one inline retry surface.
- First-load failure uses explicit Query state and the shared recovery surface.
- Saved-detail refetch failure keeps the saved copy and uses one error toast.

The iOS Dev Tools screen also displayed the native module status and the new inline recovery design.

The complete failure journey still needs one recorded device run for final submission evidence.

Maestro passed all eight flows on the iOS 27.0 Simulator on 2026-09-25.

The complete run passed 8 of 8 flows in 12 minutes and 2 seconds.

The pagination flow shows the inline footer recovery. Switching to Normal removes the error and restores the list.

The catalog flow also passed in dark mode with extra-extra-extra-large text.

### Evidence

- Feedback policy: `src/feedback/feedback-policy.test.ts`.
- Refresh behavior: `src/screens/explore/use-explore-refresh.test.ts`.
- Explore integration: `src/screens/explore/explore.test.tsx`.
- Mock mutation integrity: `src/mocks/api.test.ts`.
- Saved-detail recovery: `src/screens/activity-detail/activity-detail.test.tsx`.
- Dev Tools previews: `src/screens/dev-tools/dev-tools.test.tsx`.
- Maestro flows: `.maestro/flows/`.

## Scenario 5: Lifecycle interruptions

### Steps and expected results

| Step | Action                                       | Expected result                                   |
| ---- | -------------------------------------------- | ------------------------------------------------- |
| 1    | Select a slow initial load in Dev Tools.     | Explore shows its matching skeleton.              |
| 2    | Start the request.                           | One request remains pending.                      |
| 3    | Send the app to the background.              | The pending result does not corrupt local state.  |
| 4    | Resume the app before the request completes. | Explore completes with catalog content.           |
| 5    | Inspect the final UI.                        | No render overlay or reversed user state appears. |

### Observed result

Passed on the iOS 27.0 Simulator on 2026-09-25.

The app resumed into the catalog after the delayed request completed.

### Evidence

- Maestro: `.maestro/flows/lifecycle-slow-load.yaml`.
- Query tests: `src/query/activity-queries.test.ts`.

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
| 1    | Open Activity Detail.                                         | One **Add to Calendar** action appears.                              |
| 2    | Select **Add to Calendar**.                                   | A schedule sheet opens.                                              |
| 3    | Inspect the schedule sheet.                                   | A fitted native date and time picker appears with header actions.    |
| 4    | Swipe down on the schedule sheet.                             | The fixed sheet stays open.                                          |
| 5    | Select **Cancel**.                                            | The sheet closes without a permission request.                       |
| 6    | Open the sheet, choose a future time, and select **Done**.    | The calendar permission or system event form opens.                  |
| 7    | Deny permission.                                              | Explora shows the denied or blocked state.                           |
| 8    | If blocked, open Settings and allow calendar write access.    | Explora returns to a retryable state.                                |
| 9    | Submit again and inspect the system event form.               | Title, location, description, start, and calculated end are correct. |
| 10   | Cancel the system event form.                                 | Explora returns to Activity Detail without a status message.         |
| 11   | Submit again and save the event.                              | Explora confirms success.                                            |
| 12   | Try a second submit while the first operation remains active. | The action stays disabled and only one native form opens.            |

### Observed result

Passed on the iOS 27.0 Simulator.

1. Activity Detail showed one **Add to Calendar** row.
2. The row opened a fitted native SwiftUI sheet.
3. The sheet showed one graphical date and time picker.
4. Native Liquid Glass **Cancel** and **Done** buttons appeared in the header.
5. The sheet showed no drag handle.
6. A 200-point downward gesture did not close or resize the sheet.
7. **Cancel** closed the sheet without a permission request.
8. The permission prompt asked to add events only.
9. Denial produced the blocked state and an **Open Settings** action.
10. The system form showed the activity title, location, and description.
11. The form showed 18:01–18:36 for a 35-minute activity.
12. Two immediate submit taps opened one system form.
13. Closing the form returned to Activity Detail without a status message.
14. Saving the form showed **Added to Calendar**.

The focused Jest tests cover past dates, malformed data, invalid durations, both denial states, native errors, and duplicate protection.

### Evidence

- Automated: `src/calendar/add-to-calendar.test.ts`.
- UI validation: `src/screens/activity-detail/activity-detail.test.tsx`.
- Compact Activity Detail action: [`ios-compact-calendar-action.jpg`](./evidence/native-calendar/ios-compact-calendar-action.jpg).
- Fitted Liquid Glass sheet: [`ios-fitted-liquid-glass-sheet.jpg`](./evidence/native-calendar/ios-fitted-liquid-glass-sheet.jpg).
- Invalid input: [`ios-invalid-input.jpg`](./evidence/native-calendar/ios-invalid-input.jpg).
- Write-only prompt: [`ios-write-only-permission.jpg`](./evidence/native-calendar/ios-write-only-permission.jpg).
- Blocked permission: [`ios-permission-blocked.jpg`](./evidence/native-calendar/ios-permission-blocked.jpg).
- Pre-filled system form: [`ios-native-event-form.jpg`](./evidence/native-calendar/ios-native-event-form.jpg).
- Saved state: [`ios-saved.jpg`](./evidence/native-calendar/ios-saved.jpg).
- Native build: `dist/eas-builds/build-1790261620671.tar.gz`.
- Build metadata contains `NSCalendarsWriteOnlyAccessUsageDescription`.
- Build metadata does not contain `NSCalendarsFullAccessUsageDescription`.

### Limits

Android does not report whether its system form saved or canceled an event.

Android runtime behavior remains unverified because this machine has no Android runtime.

## Scenario 7: Performance with at least 1,000 activities

### Steps and expected results

| Step | Action                                           | Expected result                                                  |
| ---- | ------------------------------------------------ | ---------------------------------------------------------------- |
| 1    | Install an iOS release Simulator build.          | The app starts without Metro.                                    |
| 2    | Reset to the seeded 1,012-activity catalog.      | Explore reports the expected dataset size.                       |
| 3    | Record a fixed scroll and search interaction.    | The recording contains the complete interaction.                 |
| 4    | Measure the selected release performance metric. | The report states the device, build, dataset, steps, and result. |
| 5    | Compare the result with the documented limit.    | The evidence explains the result and its limits.                 |

### Observed result

Pending. Development Maestro runs do not prove release performance.

### Evidence

- Dataset tests: `src/mocks/seed-catalog.test.ts`.
- Build instructions: `docs/operations/eas-local-builds.md`.
- Release measurement: not recorded yet.

## Scenario 8: Accessibility

### Steps and expected results

| Step | Action                                              | Expected result                                      |
| ---- | --------------------------------------------------- | ---------------------------------------------------- |
| 1    | Set extra-extra-extra-large text and dark mode.     | Primary content and actions remain usable.           |
| 2    | Complete the main journey with a hardware keyboard. | Focus order and activation remain usable.            |
| 3    | Complete the main journey with VoiceOver.           | Labels, roles, state, order, and announcements work. |
| 4    | Open a saved favorite after an offline failure.     | The fallback remains understandable without sight.   |

### Observed result

Step 1 passed for the catalog state flow on the iOS 27.0 Simulator.

Steps 2–4 remain pending as one recorded native accessibility run.

### Evidence

- Large-text catalog run: `.maestro/flows/catalog-states.yaml`.
- Component accessibility tests: `src/a11y/` and changed component tests.
- Full native evidence: not recorded yet.
