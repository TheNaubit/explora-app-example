# Release artifacts

These local EAS artifacts satisfy the assessment distribution requirement.

## iOS Simulator

| Field               | Value                                                              |
| ------------------- | ------------------------------------------------------------------ |
| Artifact            | `dist/eas-builds/build-1790457549256.tar.gz`                       |
| SHA-256             | `8a348a10b7ab80e0eb142e0df181dbc5f19a11760a5f40efb876ed576415526f` |
| Platform            | iOS Simulator                                                      |
| Architecture        | Universal `arm64` and `x86_64`                                     |
| Build configuration | Release                                                            |
| EAS profile         | `production-simulator`                                             |
| App version         | `1.0.0`                                                            |
| Build number        | `1`                                                                |
| Minimum iOS         | `16.4`                                                             |
| Source commit       | `8d4b3d0`                                                          |
| Verification device | iPhone 18 Pro Simulator, iOS 27.0                                  |

The archive contains `Explora.app`, its embedded JavaScript bundle, and no development-launcher bundle.

The installed release app launched without Metro on 2026-09-26.

The following release checks passed:

- Core discovery, detail, favorite, and relaunch flow: 1 minute and 7 seconds.
- Refresh failure and exact one-item success flow: 1 minute and 35 seconds.
- Saved-detail fallback during a forced detail failure: 1 minute and 17 seconds.
- Calendar schedule cancellation returned without feedback.
- The system calendar form contained the title, location, notes, start time, and one-hour duration.
- Saving the event returned to Activity Detail and showed the native success toast.

EventKit presents its form in a separate system window. Maestro did not expose that window to its XCTest hierarchy.

The calendar form finish used Device Hub. The other listed checks used Maestro.

## Android

| Field               | Value                                                              |
| ------------------- | ------------------------------------------------------------------ |
| Artifact            | `dist/eas-builds/build-1790454953687.apk`                          |
| SHA-256             | `bcce2e2db7867bf4861c9cdce475586f11dc087ef2b3400f7c2acb740b8f978c` |
| Platform            | Android                                                            |
| Architecture        | `arm64-v8a`, `armeabi-v7a`, `x86`, and `x86_64`                    |
| Build configuration | Release                                                            |
| EAS profile         | `production-apk`                                                   |
| App version         | `1.0.0`                                                            |
| Version code        | `1`                                                                |
| Minimum SDK         | `24`                                                               |
| Source commit       | `2020ed1`                                                          |
| Verification device | Android 16 emulator, API 36                                        |

The APK launched without Metro. It passed the two required assessment flows and the native calendar flow.

## Limits

- Both runtime checks used simulators or emulators.
- Physical-device haptics remain unverified.
- The full iOS VoiceOver main journey remains pending.
- Store signing and publication are outside this assessment artifact scope.

## Related

- [Release note](../operations/release-note.md)
- [Verification scenarios](./scenarios.md)
- [Local EAS build guide](../operations/eas-local-builds.md)
- [Assessment requirements](../assessment/requirements.md)
