# Session 036: release refresh after interaction changes

- Date: 2026-09-27
- Tool: OpenAI Codex desktop agent
- Model: GPT-5 family; exact deployment slug unavailable
- Record type: AI-generated summary, not a verbatim transcript

## User request

The user asked to rebuild and verify both release artifacts after the latest interaction changes.

The user also asked to update release evidence, clean build artifacts, journal the work, and commit everything.

## Work completed

- Ran the full release gate before each build.
- Built a local Android release APK from source commit `16283fe`.
- Built a local iOS Simulator release archive from the same source commit.
- Installed and launched both artifacts without Metro.
- Inspected package metadata, architectures, signatures, permissions, and embedded bundles.
- Confirmed that neither artifact exposed a development launcher.
- Ran the complete Android Maestro suite against the release APK.
- Ran the Android release calendar flow separately.
- Ran the complete iOS Maestro suite against the release app.
- Added the new Favorites empty-state navigation flow to the iOS release evidence.
- Repeated the Android cold-start measurement with 1,012 activities.
- Updated the release note, artifact manifest, verification scenarios, and Maestro guide.
- Removed both superseded release artifacts.
- Removed temporary Maestro runs, extracted app data, native build folders, and build logs.
- Deleted the project-specific Simulator after release verification.
- Kept the current artifacts and compact JUnit reports.

## Release artifacts

- Android APK: `dist/eas-builds/build-1790507141918.apk`.
- Android SHA-256: `959ab2173fba217fa5ee51eb8983a9393b9c5b534f139d9dd79d94654e048137`.
- iOS archive: `dist/eas-builds/build-1790510925602.tar.gz`.
- iOS SHA-256: `4ba0196a5fb4f690fa36b7f9adc54c55021681ebdc52c178b37e7f70320a583e`.

## Verification

- Expo Doctor passed 20 of 20 checks.
- Oxlint passed with warnings denied.
- Oxfmt check passed.
- TypeScript passed.
- Lingui found 153 messages and no catalog difference.
- Jest passed 53 suites and 203 tests.
- Maestro syntax passed 12 flows.
- Android release Maestro passed 8 of 8 flows in 10 minutes and 59 seconds.
- Android release calendar Maestro passed in 35 seconds.
- iOS release Maestro passed 9 of 9 flows in 10 minutes and 47 seconds.
- Five Android cold starts took 706–726 ms.
- The median cold start was 711 ms. The average was 713.8 ms.

## Measurement limits

Concurrent Simulator load contaminated repeated Android frame-statistics runs.

The evidence excludes those results. It uses the controlled cold-start metric instead.

The current iOS archive did not repeat the final EventKit system-form actions.

The final physical iPhone VoiceOver journey remains pending user verification.

Physical-device haptic strength remains unverified.

This file summarizes the work. It is not a verbatim conversation export.
