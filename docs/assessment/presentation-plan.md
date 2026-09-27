# Ten-minute presentation rehearsal plan

## Goal

Present one clear product story and support each claim with visible evidence.

Target a total time of 9 minutes and 15 seconds. Keep 45 seconds for slow transitions or a repeated action.

## Recommended format

Use a live product demo with three prepared surfaces:

1. An iOS Simulator with the release app.
2. An Android emulator with the release APK.
3. A terminal in the repository.

Keep both mobile apps open. Show only one large mobile window at a time. Three small windows make the interface difficult to read.

Do not rebuild during the presentation. Do not start Metro. Both release apps must run from their embedded bundles.

Do not run a complete Maestro suite during the recording. Each platform suite takes about eleven minutes.

Show the saved JUnit results during the presentation. Run one short test command as live proof.

## Story

Use this sequence:

1. State the product problem and assessment scope.
2. Demonstrate the complete user journey.
3. Demonstrate resilience and offline behavior.
4. Demonstrate the native calendar capability.
5. Explain the native feedback improvement.
6. Show release, performance, accessibility, and test evidence.
7. State the known limits.

## Timed run

| Time      | Surface  | Action                                                                  | Main point to say                                                                                      |
| --------- | -------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 0:00–0:35 | Title    | Show the app name and one sentence about the product.                   | “Explora helps users find activities and keep favorites available offline.”                            |
| 0:35–0:55 | Terminal | Show that Metro is stopped. Show the two release artifact names.        | “These are self-contained release artifacts. Neither app uses Expo Go or Metro.”                       |
| 0:55–2:25 | iOS      | Search, select a category, open a detail, return, and save a favorite.  | “Search and filter work together. Their state remains after detail navigation.”                        |
| 2:25–3:15 | Android  | Open the prepared favorite while device networking is disabled.         | “The favorite stores a complete snapshot. The detail remains available after relaunch and offline.”    |
| 3:15–4:15 | iOS      | Use Dev Tools for a failed refresh, then a successful refresh.          | “Failure keeps 1,012 items. Success adds exactly one item. Routine success stays silent.”              |
| 4:15–5:35 | iOS      | Open the calendar sheet. Cancel once. Then open the system event form.  | “Permission starts after confirmation. Cancellation is silent. The native form owns the final save.”   |
| 5:35–6:35 | Evidence | Show the before image, then show current native feedback on each app.   | “The old banner changed layout. The new iOS toast and Android Snackbar are transient native surfaces.” |
| 6:35–7:25 | Evidence | Show performance and accessibility results.                             | “Five Android release cold starts had a 711 millisecond median with 1,012 activities.”                 |
| 7:25–8:30 | Terminal | Run focused Jest tests. Show the saved iOS and Android Maestro reports. | “Automated coverage includes the core journey and failure recovery. Full release suites passed.”       |
| 8:30–9:00 | Evidence | Show the artifact manifest and release note.                            | “The repository records checksums, build settings, signing limits, and the response to a bad release.” |
| 9:00–9:15 | Closing  | Return to the product.                                                  | “The result is a local-first mobile app with reproducible failures and verified release artifacts.”    |

## Presenter notes

### Opening

Keep the introduction short. Do not list every library.

Suggested words:

> Explora is a local-first activity discovery app. I focused on one complete journey, reliable recovery, offline favorites, and native mobile behavior.

### Core journey

Show one activity only. Use `Botanical Garden Walk` because the automated flow uses the same activity.

Call out these results while you interact:

- The catalog starts with 1,012 activities.
- Search and category filters work together.
- Detail navigation does not clear discovery state.
- Favorites remain after a process restart.
- A saved detail remains available offline.

### Refresh and recovery

Use Dev Tools to make the result deterministic.

Show the failed refresh first. State that it adds no item and keeps useful content.

Then show the successful refresh. State that the count changes from 1,012 to 1,013.

Do not explain pagination unless a reviewer asks. The presentation should stay on the required journey.

### Native calendar

Show the iOS flow because the system form is easy to recognize.

Demonstrate schedule cancellation and system-form cancellation if time permits. Both cancellations must remain silent.

Do not reset permission during the recording. Use the saved permission screenshots to explain denial and recovery.

Show the invalid-input screenshot or its focused test. Do not corrupt live app data to reproduce it.

### Improvement

Frame the improvement as a mobile architecture change.

The baseline placed temporary outcomes inside React Native layouts. The result persisted and moved screen content.

The current implementation uses native Swift and Kotlin surfaces. It also owns haptics and accessibility announcements on each platform.

Do not claim that the change improves retention or conversion. The evidence only proves behavior and presentation.

### Accessibility

State the result precisely:

- The user completed the main VoiceOver journey on a physical iPhone development build.
- Android release checks covered dark mode, 2.0 font scale, and device-offline behavior.
- VoiceOver was not repeated on the iOS release Simulator app.
- Physical Android haptic strength remains unverified.

## Terminal preparation

Use `fish` for all terminal commands.

Open the repository before recording. Increase the terminal font size.

Prepare these commands in terminal history:

```fish
git status --short
if lsof -nP -iTCP:8081 -sTCP:LISTEN
    echo "Metro is running"
else
    echo "Metro is stopped"
end
ls -lh dist/eas-builds
npm run test:e2e:syntax
npm test -- --runInBand src/mocks/api.test.ts src/calendar/add-to-calendar.test.ts
rg '<testsuite' artifacts/maestro/results.xml artifacts/maestro/android-results.xml
shasum -a 256 dist/eas-builds/build-1790507141918.apk dist/eas-builds/build-1790510925602.tar.gz
```

Run the focused Jest command during the presentation. Run the other commands before recording and keep their output visible.

If the focused Jest command becomes slow, stop it. Show the recorded result in `docs/verification/index.md` instead.

## Optional live Maestro version

Use this version only after one successful timed rehearsal.

Run one flow on one device. Do not run both assessment suites during the video.

Set the device identifier before recording:

```fish
set -gx MAESTRO_DEVICE_ID <ios-simulator-udid>
```

Run the refresh integrity flow:

```fish
maestro --device $MAESTRO_DEVICE_ID test .maestro/flows/refresh-integrity.yaml
```

Start it at 7:15. Do not touch the iOS Simulator while Maestro controls it.

If the flow does not finish by 8:45, stop it and show the saved JUnit result.

The safer primary recording uses focused Jest tests and saved Maestro reports.

## Recording setup

Complete this checklist before each take:

1. Close unrelated simulators, emulators, IDE windows, and build processes.
2. Boot one iOS Simulator and one Android emulator.
3. Install the recorded release artifacts before the take.
4. Stop Metro and all local build commands.
5. Reset both apps to the required demo state.
6. Save `Botanical Garden Walk` on Android for the offline segment.
7. Disable Android device networking after the favorite is ready.
8. Keep iOS calendar permission in the state needed for the live form.
9. Open all evidence pages and screenshots before recording.
10. Hide notifications and unrelated personal information.
11. Record at a size that keeps app text readable.
12. Start a separate timer for nine minutes and fifteen seconds.

## Backup plan

If one live action fails, do not debug it during the presentation.

Use the matching evidence page and continue:

- Core behavior: [verification scenarios](../verification/scenarios.md).
- Native calendar: [Scenario 6](../verification/scenarios.md#scenario-6-native-calendar).
- Performance: [Scenario 7](../verification/scenarios.md#scenario-7-performance-with-at-least-1000-activities).
- Improvement: [native feedback evidence](../verification/improvement-native-feedback.md).
- Release artifacts: [artifact manifest](../verification/artifacts.md).
- Release process: [release note](../operations/release-note.md).

## Practice plan

Use three rehearsals:

1. Complete an untimed rehearsal. Confirm every click and window transition.
2. Complete a timed rehearsal. Remove any section that pushes the total beyond 9 minutes and 15 seconds.
3. Complete a recovery rehearsal. Intentionally skip one live action and use its evidence page.

Speak while screens load. Stay silent while the reviewer reads a result.

Finish the final recording below ten minutes. Do not depend on editing to meet the limit.
