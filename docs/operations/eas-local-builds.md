# EAS local builds

Explora builds **only with EAS CLI on this machine** (`eas build --local`). Do not use cloud EAS Build for day-to-day work unless you change this policy.

Artifacts land in `dist/eas-builds/` (gitignored via `dist/`).

## Fast native development loop

Do not use a clean EAS build for each native code edit.

1. Keep the generated, gitignored `ios/` and `android/` folders on this machine.
2. Run `npm run ios` or `npm run android` after a native code change.
3. Let Xcode DerivedData, CocoaPods, Gradle, and C++ outputs remain in place.
4. Run `npm run start:dev-client` for JavaScript-only changes.
5. Use the local EAS scripts for final artifacts and clean release verification.

React Native still builds from source on iOS. `react-native-a11y` imports private headers that the prebuilt React framework omits.

Expo supports `ccacheEnabled` for source builds. This machine does not have `ccache` installed, so the project does not enable it yet.

Local EAS builds always create a fresh artifact. `EAS_LOCAL_BUILD_SKIP_CLEANUP` keeps a build directory for inspection. It does not make EAS incremental.

## Ignore files

1. [`.gitignore`](../../.gitignore) — keep `dist/`, `ios/`, `android/`, and binary artifacts (`.apk`, `.aab`, `.ipa`, `.app`) out of git.
2. [`.easignore`](../../.easignore) — when present, EAS uses this file instead of `.gitignore` for the project archive. It mirrors `.gitignore`, then skips docs, AI sessions, tests, and skill packs that the native build does not need.

Do not commit local build outputs or signing material (`credentials.json`, keystores, provisioning profiles).

## Prerequisites

1. Install [EAS CLI](https://docs.expo.dev/eas/cli/): `npm install -g eas-cli` (or use `npx eas-cli`).
2. Log in: `eas login` (or set `EXPO_TOKEN`).
3. macOS with Xcode for iOS. Android SDK for Android.
4. CocoaPods and Fastlane for iOS local builds.
5. `expo-dev-client` is already a dependency (needed for development profiles).

Project id and identifiers live in `app.config.ts` (`extra.eas.projectId`, `ios.bundleIdentifier`, `android.package`). Profiles live in `eas.json`.

## Xcode 27 / iOS 27 (iPhone 18 Pro)

This app targets **Expo SDK 58**, which is built for iOS 27 and includes the UIKit scene lifecycle by default. Use Device Hub with **iPhone 18 Pro** on the **iOS 27** runtime.

Do not use the SDK 57 `expo-build-properties` → `ios.enableSceneSupport` opt-in. That patch is not needed on SDK 58.

Rebuild the iOS development client after an SDK upgrade.

For SDK 58 beta, keep root `.npmrc` with `legacy-peer-deps=true` so local EAS `npm ci` can resolve React Native RC peer ranges.

## Profiles (`eas.json`)

| Profile                 | Purpose                                     | iOS artifact                      | Android artifact |
| ----------------------- | ------------------------------------------- | --------------------------------- | ---------------- |
| `development`           | Dev client for **physical devices**         | `.ipa` (device)                   | debug `.apk`     |
| `development-simulator` | Dev client for **iOS Simulator**            | `.app` (simulator)                | debug `.apk`     |
| `production`            | Store release                               | store `.ipa`                      | `.aab`           |
| `production-simulator`  | Release binary for simulators / emulators   | `.app` (simulator)                | release `.apk`   |
| `production-apk`        | Installable release APK (device / sideload) | (use `production` for iOS device) | release `.apk`   |

Development profiles set `developmentClient: true`. Production profiles do not.

## npm scripts

All scripts set `EAS_LOCAL_BUILD_ARTIFACTS_DIR=dist/eas-builds` and pass `--local`.

### Development

| Script                               | Target                 | Profile                 |
| ------------------------------------ | ---------------------- | ----------------------- |
| `npm run build:ios:dev:simulator`    | iOS Simulator          | `development-simulator` |
| `npm run build:ios:dev:device`       | iPhone / iPad (signed) | `development`           |
| `npm run build:android:dev:emulator` | Android Emulator       | `development`           |
| `npm run build:android:dev:device`   | Android device         | `development`           |

Device iOS development may prompt for Apple credentials the first time. Keep that script interactive (no `--non-interactive`).

### Production / release

| Script                                | Target                          | Profile                |
| ------------------------------------- | ------------------------------- | ---------------------- |
| `npm run build:ios:prod:simulator`    | iOS Simulator release `.app`    | `production-simulator` |
| `npm run build:ios:prod:device`       | App Store / TestFlight `.ipa`   | `production`           |
| `npm run build:android:prod:emulator` | Android Emulator release `.apk` | `production-simulator` |
| `npm run build:android:prod:device`   | Sideloadable release `.apk`     | `production-apk`       |
| `npm run build:android:prod:store`    | Play Store `.aab`               | `production`           |

Assessment delivery needs an installable Android APK and an iOS Simulator `.app`. Prefer:

1. `npm run build:android:prod:device` (or `…:emulator`)
2. `npm run build:ios:prod:simulator`

## After a development build

1. Install the artifact on the simulator, emulator, or device.
2. Start Metro against the dev client:

```bash
npm run start:dev-client
```

### Install helpers (examples)

Xcode 27 uses **Device Hub** (not Simulator.app). Open it, then install on a booted iPhone:

```bash
open /Applications/Xcode.app/Contents/Applications/DeviceHub.app

# Prefer iPhone 18 Pro on iOS 27 (create once if missing)
xcrun simctl create "Explora iPhone 18 Pro" \
  com.apple.CoreSimulator.SimDeviceType.iPhone-18-Pro \
  com.apple.CoreSimulator.SimRuntime.iOS-27-0
xcrun simctl boot "Explora iPhone 18 Pro"
xcrun simctl bootstatus "Explora iPhone 18 Pro" -b

# Install and open against local Metro
xcrun simctl install "Explora iPhone 18 Pro" dist/eas-builds/Explora.app
xcrun simctl launch "Explora iPhone 18 Pro" com.adlerventures.explora
xcrun simctl openurl "Explora iPhone 18 Pro" \
  'exp+explora-agile-monkeys://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8081'

# Android Emulator / device
adb install -r path/to/app-debug.apk
```

Device Hub shows the live device window after boot. You can also drag the `.app` / `.apk` onto that window.

## Policy

1. Prefer **local** EAS builds (`--local`) for this project.
2. Do not rely on Expo Go. Native modules (a11y, MMKV, and others) need a development or release build.
3. Rebuild after native dependency changes, SDK upgrades, or `app.config` / config-plugin changes.
4. Keep `ios/` and `android/` untracked (CNG). EAS local build generates them in a temp working directory.
5. Keep `.gitignore` and `.easignore` aligned when you add new generated paths.

## Related

- [Local development](./local-dev.md)
- [Navigation](../features/navigation.md)
- Expo: [Run EAS Build locally](https://docs.expo.dev/build-reference/local-builds/)
- Expo: [eas.json](https://docs.expo.dev/eas/json/)
- Expo: [.easignore](https://docs.expo.dev/build-reference/easignore/)
- Root rules: `AGENTS.md` → Building with EAS
