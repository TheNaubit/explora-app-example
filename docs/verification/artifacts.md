# Release artifacts

These local EAS artifacts satisfy the assessment distribution requirement.

## iOS Simulator

| Field               | Value                                                              |
| ------------------- | ------------------------------------------------------------------ |
| Artifact            | `dist/eas-builds/build-1790510925602.tar.gz`                       |
| SHA-256             | `4ba0196a5fb4f690fa36b7f9adc54c55021681ebdc52c178b37e7f70320a583e` |
| Platform            | iOS Simulator                                                      |
| Architecture        | Universal `arm64` and `x86_64`                                     |
| Build configuration | Release                                                            |
| EAS profile         | `production-simulator`                                             |
| App version         | `1.0.0`                                                            |
| Build number        | `1`                                                                |
| Minimum iOS         | `16.4`                                                             |
| Source commit       | `16283fe`                                                          |
| Verification device | iPhone 18 Pro Simulator, iOS 27.0                                  |

The archive contains `Explora.app`, its embedded JavaScript bundle, and no development-launcher bundle.

The installed release app launched without Metro on 2026-09-27.

The following release checks passed:

- The complete Maestro suite passed 9 of 9 flows in 10 minutes and 47 seconds.
- The suite covered discovery, detail, favorites, refresh, recovery, offline fallback, and lifecycle behavior.
- The Favorites empty-state action opened Explore.
- The feedback policy flow passed.

EventKit presents its form in a separate system window. The current archive did not repeat the final system-form actions.

## Android

| Field               | Value                                                              |
| ------------------- | ------------------------------------------------------------------ |
| Artifact            | `dist/eas-builds/build-1790507141918.apk`                          |
| SHA-256             | `959ab2173fba217fa5ee51eb8983a9393b9c5b534f139d9dd79d94654e048137` |
| Platform            | Android                                                            |
| Architecture        | `arm64-v8a`, `armeabi-v7a`, `x86`, and `x86_64`                    |
| Build configuration | Release                                                            |
| EAS profile         | `production-apk`                                                   |
| App version         | `1.0.0`                                                            |
| Version code        | `1`                                                                |
| Minimum SDK         | `24`                                                               |
| Source commit       | `16283fe`                                                          |
| Verification device | Android 16 emulator, API 36                                        |

The APK launched without Metro on 2026-09-27.

The complete Maestro suite passed 8 of 8 flows in 10 minutes and 59 seconds.

The separate release calendar flow passed in 35 seconds.

Five clean cold starts took 706–726 ms with 1,012 activities. The median was 711 ms.

Android verified the APK Signature Scheme v2 signature. The signer certificate SHA-256 is:

```text
0f2bc7ae30ab85f7828f3b3c4a59d77fb101da24c38512565ab0787d09681c7e
```

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
