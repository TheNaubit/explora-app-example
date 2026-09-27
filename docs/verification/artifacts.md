# Release artifacts

These local EAS artifacts satisfy the assessment distribution requirement.

## iOS Simulator

| Field               | Value                                                              |
| ------------------- | ------------------------------------------------------------------ |
| Artifact            | `dist/eas-builds/build-1790521772499.tar.gz`                       |
| SHA-256             | `c1ee720d8ee789914ff69174b9d63b58faba1db6917d1993a911ce0236e18a63` |
| Platform            | iOS Simulator                                                      |
| Architecture        | Universal `arm64` and `x86_64`                                     |
| Build configuration | Release                                                            |
| EAS profile         | `production-simulator`                                             |
| App version         | `1.0.0`                                                            |
| Build number        | `1`                                                                |
| Minimum iOS         | `16.4`                                                             |
| Source commit       | `1311cbc`                                                          |
| Verification device | iPhone 18 Pro Simulator, iOS 27.0                                  |

The archive contains `Explora.app`, its embedded JavaScript bundle, and no development-launcher bundle.

The installed release app launched without Metro on 2026-09-27.

The following release checks passed:

- The complete Maestro suite passed 9 of 9 flows in 10 minutes and 56 seconds.
- The suite covered discovery, detail, favorites, refresh, recovery, offline fallback, and lifecycle behavior.
- The Favorites empty-state action opened Explore.
- The feedback policy flow passed.
- The EventKit permission prompt requested add-only access.
- System-form cancellation returned without feedback.
- System-form save returned with the native success message.

The release-only iOS calendar flow also passed.

It checked schedule cancellation, the prefilled EventKit form, form cancellation, saving, and native success feedback.

## Android

| Field               | Value                                                              |
| ------------------- | ------------------------------------------------------------------ |
| Artifact            | `dist/eas-builds/build-1790524156875.apk`                          |
| SHA-256             | `caaeecdd1761361f23e771b7f2285bbb613a8e6c899148643c0f43e07562c2d9` |
| Platform            | Android                                                            |
| Architecture        | `arm64-v8a`, `armeabi-v7a`, `x86`, and `x86_64`                    |
| Build configuration | Release                                                            |
| EAS profile         | `production-apk`                                                   |
| App version         | `1.0.0`                                                            |
| Version code        | `1`                                                                |
| Minimum SDK         | `24`                                                               |
| Source commit       | `1311cbc`                                                          |
| Verification device | Android 16 emulator, API 36                                        |

The APK launched without Metro on 2026-09-27.

The complete Maestro suite passed 8 of 8 flows in 10 minutes and 45 seconds.

The separate release calendar flow passed in 36 seconds.

Five clean cold starts took 750–848 ms with 1,012 activities. The median was 762 ms.

The average cold start was 776.6 ms.

The APK passed the core journey in dark mode with 2.0 font scale and networking disabled.

Android verified the APK Signature Scheme v2 signature. The signer certificate SHA-256 is:

```text
0f2bc7ae30ab85f7828f3b3c4a59d77fb101da24c38512565ab0787d09681c7e
```

## Limits

- Both runtime checks used simulators or emulators.
- Physical-device haptics remain unverified.
- The user completed the VoiceOver main journey on a physical iPhone development build.
- VoiceOver was not repeated on the iOS Simulator release artifact.
- Store signing and publication are outside this assessment artifact scope.

## Related

- [Release note](../operations/release-note.md)
- [Verification scenarios](./scenarios.md)
- [Local EAS build guide](../operations/eas-local-builds.md)
- [Assessment requirements](../assessment/requirements.md)
