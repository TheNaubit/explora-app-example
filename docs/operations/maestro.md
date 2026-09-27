# Maestro state checks

Maestro drives the assessment states through the in-app Dev Tools tab.

## Prerequisites

1. Install Java 17 or later.
2. Install Maestro with Homebrew.
3. Build and install the Explora development client.
4. Start Metro with `npm run start:dev-client`.
5. Boot the `Explora iPhone 18 Pro` Simulator or the configured Android emulator.

```bash
brew tap mobile-dev-inc/tap
brew install mobile-dev-inc/tap/maestro
```

See the [Maestro installation guide](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli).

## Commands

Check all flow files without running the app:

```bash
npm run test:e2e:syntax
```

Run all iOS flows:

```bash
npm run test:e2e:ios
```

Run the two automated tests required by the assessment:

```bash
npm run test:e2e:assessment:ios
```

Run all Android flows:

```bash
npm run test:e2e:android
```

Run the two Android assessment flows:

```bash
npm run test:e2e:assessment:android
```

This command runs one core behavior flow and one failure or recovery flow.

Run the Android release-only native calendar flow:

```bash
npm run test:e2e:release:android
```

This flow checks cancellation, the permission prompt, event creation, and the success Snackbar.

Set `MAESTRO_DEVICE_ID` when more than one suitable Simulator is booted.

The runner prefers a booted Simulator named `Explora iPhone 18 Pro`.

Reports go to `artifacts/maestro/`. Git ignores this runtime output.

## Flow coverage

| Flow                      | State coverage                                        |
| ------------------------- | ----------------------------------------------------- |
| Core journey              | Search, filter, detail, favorite, reopen, persistence |
| Catalog states            | Loading, empty, invalid data, error, recovery         |
| Detail states             | Loading, invalid data, not-found, no render overlay   |
| Refresh integrity         | Failure adds zero, success adds one                   |
| Pagination recovery       | Later-page timeout, inline retry, normal recovery     |
| Lifecycle slow load       | Background and resume during a pending request        |
| Favorite offline fallback | Saved snapshot remains usable after detail failure    |
| Feedback policy           | Inline recovery, error toast, calendar success toast  |

The `assessment-required` tag selects these two meaningful automated tests:

1. `core-journey.yaml` covers the main product journey.
2. `refresh-integrity.yaml` covers failure integrity and recovery.

The complete iOS suite passed 8 of 8 flows on 2026-09-25. The run took 12 minutes and 2 seconds.

The iOS suite used a Simulator development build. It did not use a production-release build.

The current iOS release app passed 9 of 9 flows without Metro on 2026-09-27.

The run took 10 minutes and 47 seconds. It includes the Favorites empty-state navigation check.

The EventKit form runs in a separate system window. Device Hub completed the current release cancel and save actions.

The current Android release app passed 8 of 8 flows on 2026-09-27.

The run took 10 minutes and 59 seconds.

The Android core flow also passed with dark mode, 2.0 font scale, and device networking disabled.

The current Android release APK passed the native calendar flow separately in 35 seconds.

The bootstrap resets local data to the 12 supplied activities and resets request modes through Dev Tools.

The pagination flow selects Performance (1,012) before it requests later pages.

The bootstrap accepts a partly visible reset row. It waits for the native confirmation animation before it continues.

It does not clear application storage. Clearing storage opens the Expo development-server launcher.

## Development-client limits

The Expo development gear can overlap the Activity Detail favorite button.

The favorite flow uses the Explore card favorite button. This avoids the development-only overlay.

Use a release build for final performance evidence. Maestro development runs do not prove release performance.
