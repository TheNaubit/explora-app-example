# Decisions and evidence

## Product scope

Explora supports one complete mobile journey:

1. Browse the supplied activity catalog.
2. Search by title and filter by category.
3. Open an activity without losing discovery state.
4. Save the activity as a favorite.
5. Reopen the favorite after relaunch and offline.

The normal catalog contains the 12 supplied activities.

Dev Tools provides a separate 1,012-item performance catalog.

A successful refresh adds one activity. A failed refresh adds nothing.

## Architecture

| Layer              | Responsibility                                                      | Main locations                                            |
| ------------------ | ------------------------------------------------------------------- | --------------------------------------------------------- |
| Routes             | Parse route parameters and render one screen                        | `src/app/`                                                |
| Screens            | Compose feature UI and state hooks                                  | `src/screens/`                                            |
| Shared UI          | Accessibility wrappers, cards, states, and navigation surfaces      | `src/components/`, `src/a11y/`                            |
| Remote-shaped data | Catalog list, detail, refresh, delay, and failure modes             | `src/mocks/`, `src/query/`, `src/hooks/`                  |
| Validation         | Validate fixtures, generated data, and mock responses               | `src/schemas/`, `src/utils/parse-with-schema.ts`          |
| Local-first state  | Persist favorites, complete offline snapshots, and catalog settings | Legend State and MMKV under `src/state/` and `src/mocks/` |
| Native capability  | Validate and add activities to the system calendar                  | `src/calendar/`, platform schedule pickers                |
| Native feedback    | Present transient outcomes with Swift and Kotlin                    | `modules/expo-native-toast/`, `src/native-toast/`         |

Expo Router keeps route files thin. Screen components own composition, not data transport.

TanStack Query owns catalog request state. Legend State and MMKV own local-first user state.

Zod validates all external-shaped data before it reaches state or UI.

## Main decisions and trade-offs

### Client mock API instead of a backend

The assessment requires local and reproducible success, slow, and failure states.

The app uses a client mock API with deterministic Dev Tools controls.

This choice removes external accounts and network dependencies. It does not demonstrate a production server contract.

### TanStack Query and Legend State have separate roles

TanStack Query owns list, detail, pagination, and refresh request state.

Legend State with MMKV owns favorites and complete offline activity snapshots.

This split keeps loading and recovery states explicit. It also keeps favorites independent from request-cache eviction.

The project does not use the Legend State Query plugin in this assessment.

### Explicit Query states instead of expected thrown errors

Loading, empty, not-found, error, and content are separate product states.

Expected failures render from Query status. They do not throw into a route Error Boundary.

This prevents the Expo development overlay from replacing expected recovery UI.

Unexpected programming failures can still use Error Boundaries.

### The supplied catalog and performance catalog are separate

Normal use and reset start from the 12 supplied activities.

Performance mode adds 1,000 deterministic activities for a total of 1,012.

Refresh remains independent and adds exactly one stable generated activity after success.

This separation makes each assessment requirement visible and reproducible.

### Local-first favorite snapshots

Each favorite stores its complete activity snapshot in MMKV.

A saved detail can render after relaunch, request failure, or device network loss.

This duplicates a small amount of catalog data. The duplication is intentional because offline detail is a core requirement.

### Add to Calendar as the native capability

Calendar planning fits the activity-discovery journey.

iOS uses an add-only EventKit permission and the native event form.

Android requests calendar access and writes to a selected writable calendar.

The implementation validates date, activity fields, duration, and duplicate submissions before native work.

This feature needs a development or release build. Expo Go is not sufficient.

### One feedback surface for each outcome

Routine success and cancellation stay silent.

A confirmed calendar save uses one native transient success surface.

A temporary failure with usable content uses one native error surface.

An important failure with a useful action uses one inline recovery surface.

The app never shows a toast and an inline recovery surface for the same result.

### Accessibility and localization are architectural requirements

`react-native-a11y` and project wrappers provide focus order, focus containment, and keyboard behavior.

React Native accessibility properties provide labels, roles, hints, and states.

Lingui owns user-facing copy. `expo-localization` provides device locale and RTL behavior.

The initial catalog is English only. The app has no language selector.

## Exclusions

The assessment does not include:

- A real backend.
- Login or user accounts.
- Payments or subscriptions.
- Multi-device synchronization.
- Store publication.
- Cloud services, API keys, or hosted dependencies.
- A claim that simulator haptics prove physical-device strength.

The iOS artifact targets the Simulator. The Android artifact was verified on an emulator.

## Verification summary

| Scenario             | Steps and expected result                                            | Observed result                                                              | Main evidence                                   |
| -------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------- |
| 1. Core journey      | Search, filter, open detail, return, save, relaunch, and reopen      | Passed on final iOS and Android release artifacts without Metro              | `.maestro/flows/core-journey.yaml`              |
| 2. Generated refresh | Reset to 12, refresh successfully, and reach 13                      | Passed on final iOS and Android release artifacts                            | `.maestro/flows/refresh-integrity.yaml`         |
| 3. Offline favorites | Save, relaunch, fail detail, disable networking, and reopen          | Passed on iOS; all steps passed with Android device networking disabled      | `.maestro/flows/favorite-offline-fallback.yaml` |
| 4. Failure recovery  | Fail refresh, first load, later page, and saved-detail refetch       | Failed refresh added nothing; each outcome used one correct recovery surface | Jest and `.maestro/flows/`                      |
| 5. Lifecycle         | Start a slow load, background, resume, and accept the delayed result | Passed on iOS and Android without reversed user state                        | `.maestro/flows/lifecycle-slow-load.yaml`       |
| 6. Native calendar   | Validate, request permission, cancel, inspect native data, and save  | Passed on iOS and Android release artifacts                                  | Release calendar flows and focused Jest tests   |
| 7. Performance       | Select 1,012 activities and measure five release cold starts         | Android range 750–848 ms; median 762 ms; average 776.6 ms                    | `adb am start -W` measurements                  |
| 8. Accessibility     | Use larger text, keyboard, screen reader, and offline favorite       | Android release checks passed; physical iPhone VoiceOver journey passed      | Maestro, UI inspection, and user verification   |

The final iOS release suite passed 9 of 9 flows in 10 minutes and 56 seconds.

The final Android release suite passed 8 of 8 flows in 10 minutes and 45 seconds.

All 53 Jest suites and 211 tests passed without `act()` warnings or open handles.

Lingui extracted 158 English source messages with no catalog difference.

## Native calendar verification

### Invalid input

Focused tests cover a missing date, a past time, malformed activity data, and invalid duration values.

The coordinator rejects invalid input before it requests permission.

### Permission

iOS requests add-only calendar access. The build omits the full-access permission string.

Permanent iOS denial provides an **Open Settings** recovery action.

Android requests calendar access after schedule confirmation.

### Cancellation

Schedule cancellation does not request permission.

The iOS system-form cancellation returns without feedback.

Android picker cancellation also returns silently.

### Save

The iOS system form received the activity title, location, description, start time, and calculated end time.

The Android release created the expected calendar event in a writable calendar.

Both platforms showed native success feedback after confirmed saves.

### Limits

The iOS release check used an iOS 27.0 Simulator.

The Android release check used an Android 16 emulator.

Automated tests do not replace native runtime verification.

## Performance evidence

### Environment

- Artifact: final Android release APK.
- Device: Android 16 emulator, API 36.
- Dataset: 12 supplied activities plus 1,000 deterministic generated activities.
- Total: 1,012 activities.
- Runtime: embedded release bundle without Metro.

### Reproduction

1. Install the final release APK.
2. Open Dev Tools.
3. Select **Performance (1,012)**.
4. Exercise scrolling, search, filtering, detail, and favorite actions.
5. Stop the app before each measurement.
6. Start it with Android `am start -W`.
7. Record the total start time for five runs.

### Result

The five cold starts took 848, 756, 767, 762, and 750 ms.

The range was 750–848 ms. The median was 762 ms. The average was 776.6 ms.

### Limits

The measurement used an emulator with the host GPU.

It does not predict physical-device startup time.

Concurrent Simulator load contaminated repeated frame-statistics captures. Those results are not evidence.

Cold-start time is the reported quantitative measurement. Scroll and search were exercised but were not assigned a frame-rate claim.

## Before-and-after improvement

### Problem

The baseline used persistent React Native banners for temporary outcomes.

A calendar success banner remained inside Activity Detail after the operation finished.

The banner moved activity actions and turned a temporary result into permanent content.

A temporary refresh failure also used an inline banner and retry action while the catalog remained usable.

### Before

- Baseline commit: `4ace6e5`.
- Calendar save: one persistent in-flow success row.
- Temporary refresh failure: one inline retry action.
- Native platform feedback implementations: zero.
- Maximum surfaces for one outcome: no shared limit.

Before image: [persistent iOS calendar banner](https://github.com/TheNaubit/explora-app-example/blob/main/docs/verification/evidence/native-calendar/ios-saved.jpg)

### Change

Commit `7e83188` added the local `expo-native-toast` module and one TypeScript API.

iOS presents a SwiftUI overlay with Liquid Glass on supported systems and native material fallback elsewhere.

Android presents a Material Snackbar above bottom navigation.

Each native implementation owns semantic haptics and accessibility announcements.

### After

- Calendar save: one transient native success surface.
- Temporary refresh failure: one transient native error surface.
- Persistent rows after a calendar save: zero.
- Retry actions for a temporary refresh failure: zero.
- Native platform implementations: two.
- Maximum surfaces for one outcome: one.

After images:

- [iOS calendar success](https://github.com/TheNaubit/explora-app-example/blob/main/docs/verification/evidence/native-feedback/ios-success-after.jpg)
- [iOS transient error](https://github.com/TheNaubit/explora-app-example/blob/main/docs/verification/evidence/native-feedback/ios-error-after.jpg)
- [Android success](https://github.com/TheNaubit/explora-app-example/blob/main/docs/verification/evidence/native-feedback/android-success-light.jpg)
- [Android error](https://github.com/TheNaubit/explora-app-example/blob/main/docs/verification/evidence/native-feedback/android-error-light.jpg)

### Outcome and limits

The iOS feedback flow passed in 35 seconds.

The final Android release feedback flow passed in 45.89 seconds.

The final release artifacts also passed real calendar-save feedback checks.

The evidence proves behavior and presentation. It does not prove a retention or conversion effect.

Development clients produced the deterministic iOS preview images. The final release app verified the real calendar outcome separately.

Simulator and emulator checks do not prove physical haptic strength.

## Evidence map

- [Complete verification scenarios](https://github.com/TheNaubit/explora-app-example/blob/main/docs/verification/scenarios.md)
- [Native feedback improvement](https://github.com/TheNaubit/explora-app-example/blob/main/docs/verification/improvement-native-feedback.md)
- [Artifact manifest](https://github.com/TheNaubit/explora-app-example/blob/main/docs/verification/artifacts.md)
- [Release note](https://github.com/TheNaubit/explora-app-example/blob/main/docs/operations/release-note.md)
- [Architecture overview](https://github.com/TheNaubit/explora-app-example/blob/main/docs/architecture/overview.md)
- [Architecture decisions](https://github.com/TheNaubit/explora-app-example/blob/main/docs/decisions/index.md)
