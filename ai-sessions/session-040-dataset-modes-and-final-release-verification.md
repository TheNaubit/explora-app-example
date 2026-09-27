# AI-generated session summary, not a verbatim transcript

- Date: 2026-09-27
- Tool: OpenAI Codex desktop agent
- Model: GPT-5 family; exact deployment slug unavailable
- Record type: AI-generated summary, not a verbatim transcript

## User requests and constraints

- The user questioned whether the assessment expected 12 normal activities and a separate 1,000-item performance case.
- The user asked to migrate to that interpretation and repeat all verification.
- The user asked to keep the presentation plan out of the repository.
- The user asked to use the fish shell.
- The user asked to avoid unnecessary build artifacts on the laptop.
- The user requested status summaries while the release builds ran.

## User decisions

- The normal catalog contains the 12 supplied activities.
- Performance mode adds 1,000 deterministic activities for a total of 1,012.
- A successful refresh adds one activity. A failed refresh adds nothing.
- The presentation plan does not belong in the submitted repository.

## Work completed

- Separated the supplied and performance catalog modes.
- Persisted the selected catalog mode.
- Kept generated refresh activities across catalog mode changes.
- Reset local data to the 12 supplied activities.
- Updated Dev Tools with accessible catalog mode controls.
- Updated Maestro flows for the 12-to-13 refresh behavior and the 1,012-item performance case.
- Found and fixed an iOS pull-to-refresh retry bug after a failed refresh.
- Added a test for a second native refresh request after the first request ends.
- Added a reproducible iOS release calendar flow.
- Added platform filtering to the release-only Maestro runners.
- Normalized the Dev Tools bootstrap across Android and iOS.
- Removed the presentation plan and its wiki links.

## Release artifacts

- iOS archive: `dist/eas-builds/build-1790521772499.tar.gz`.
- iOS SHA-256: `c1ee720d8ee789914ff69174b9d63b58faba1db6917d1993a911ce0236e18a63`.
- Android APK: `dist/eas-builds/build-1790524156875.apk`.
- Android SHA-256: `caaeecdd1761361f23e771b7f2285bbb613a8e6c899148643c0f43e07562c2d9`.
- Artifact source commit: `1311cbc`.

## Checks and observed results

- iOS release Maestro passed 9 of 9 flows in 10 minutes and 56 seconds.
- The iOS release calendar flow passed cancellation, form inspection, save, and success feedback.
- Android release Maestro passed 8 of 8 flows in 10 minutes and 45 seconds.
- The Android release calendar flow passed in 36 seconds.
- The final Android APK passed the core journey in dark mode with 2.0 font scale and networking disabled.
- Performance mode reported 1,012 activities.
- Five Android cold starts took 848, 756, 767, 762, and 750 ms.
- The cold-start range was 750–848 ms. The median was 762 ms. The average was 776.6 ms.
- The Android APK passed APK Signature Scheme v2 verification.
- The APK contains `arm64-v8a`, `armeabi-v7a`, `x86`, and `x86_64` native libraries.
- The iOS archive contains `arm64` and `x86_64` slices.

## Failures found during verification

- The first iOS release suite found three Dev Tools navigation failures.
- A focused refresh run then found that success could not follow a failed native pull.
- Resetting the pull commitment after refresh completion fixed the retry problem.
- The first Android suite started while the emulator was unstable. Two flows failed when the device went offline.
- One Android flow also exposed a platform-specific Dev Tools scroll position.
- A shared catalog-mode anchor fixed the scroll position.
- All three affected Android flows passed in isolation before the full 8-of-8 rerun.

## Missing context and limits

- This file summarizes the available session context. It is not the original conversation export.
- Earlier conversation details can be missing because the working session was compacted.
- Runtime checks used an iOS Simulator and an Android emulator.
- The user completed the VoiceOver journey earlier on a physical iPhone development build.
- Physical-device haptic strength remains unverified.
- The user still must rehearse and record the final presentation.
