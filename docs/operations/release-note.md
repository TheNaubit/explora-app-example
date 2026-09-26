# Release note: Explora 1.0.0 assessment build

## Release status

This release supplies installable artifacts for assessment review.

It does not authorize App Store or Play Store publication.

The Android APK and iOS Simulator app run without Metro or Expo Go.

| Field                | Value                       |
| -------------------- | --------------------------- |
| App version          | `1.0.0`                     |
| iOS build number     | `1`                         |
| Android version code | `1`                         |
| Package identifier   | `com.adlerventures.explora` |
| Release date         | 2026-09-27                  |

## Release contents

- Browse, search, and filter a local catalog with more than 1,000 activities.
- Keep search and filter state after opening an activity.
- Save favorites and open their details offline.
- Add exactly one activity after a successful refresh.
- Keep the catalog unchanged after a failed refresh.
- Add an activity to the system calendar after validation and permission checks.
- Show platform-native transient feedback for calendar and refresh outcomes.
- Support light mode, dark mode, larger text, keyboard use, and screen readers.

See the [verification scenarios](../verification/scenarios.md) for observed results and limits.

## Review artifacts

These artifacts are for local assessment review.

| Platform      | Artifact                                     | Build                           | Source commit | SHA-256                                                            |
| ------------- | -------------------------------------------- | ------------------------------- | ------------- | ------------------------------------------------------------------ |
| iOS Simulator | `dist/eas-builds/build-1790457549256.tar.gz` | Release, `production-simulator` | `8d4b3d0`     | `8a348a10b7ab80e0eb142e0df181dbc5f19a11760a5f40efb876ed576415526f` |
| Android       | `dist/eas-builds/build-1790454953687.apk`    | Release, `production-apk`       | `2020ed1`     | `bcce2e2db7867bf4861c9cdce475586f11dc087ef2b3400f7c2acb740b8f978c` |

Commit `8d4b3d0` contains documentation changes after `2020ed1`. The app source is equal in both artifacts.

The complete artifact metadata is in the [release artifact manifest](../verification/artifacts.md).

## Signing

### Assessment artifacts

The iOS artifact targets the Simulator. It has an ad hoc signature and no Apple Team identifier.

The ad hoc signature does not make the app valid for an iPhone, TestFlight, or the App Store.

The Android APK has one RSA signer. Android verifies it with APK Signature Scheme v2.

The Android signing certificate has this SHA-256 fingerprint:

```text
0f2bc7ae30ab85f7828f3b3c4a59d77fb101da24c38512565ab0787d09681c7e
```

The fingerprint is public verification data. It is not a signing secret.

### Store distribution

Use the `production` EAS profile for a later store build.

- Apple distribution needs an Apple Distribution certificate and provisioning profile.
- Google Play distribution needs a signed Android App Bundle and the configured upload key.
- Keep all credentials outside Git.
- Do not put passwords, private keys, certificates, profiles, or keystores in this note.
- Verify the store account and signing identity before each store build.

Store signing and publication are outside this assessment release.

## Versioning

`app.config.ts` defines the public app version. The current value is `1.0.0`.

`eas.json` uses remote EAS build versions. The `production` profile increments store build identifiers.

The internal assessment profiles disable automatic increments. Their recorded build identifiers are both `1`.

For a later release:

1. Increase the public version for a user-visible feature release.
2. Always increase the iOS build number and Android version code.
3. Never reuse a store build identifier.
4. Record the source commit and artifact checksum.
5. Keep the artifact name unique and update the artifact manifest.

## Pre-release checks

Run these checks from a clean source tree:

```bash
npm ci
npx expo-doctor
npx oxlint --deny-warnings --format=agent
npx oxfmt --check
npx tsc --noEmit
npm run i18n:check
npm test -- --runInBand
npm run test:e2e:syntax
```

Then complete these release checks:

1. Build the Android APK with `npm run build:android:prod:device`.
2. Build the iOS archive with `npm run build:ios:prod:simulator`.
3. Record the version, build identifier, source commit, architecture, and SHA-256 value.
4. Install each artifact on its target emulator or Simulator.
5. Stop Metro and confirm that each app launches.
6. Verify browse, search, filter, detail, favorite, relaunch, and offline detail.
7. Verify refresh failure and exactly one new activity after refresh success.
8. Verify calendar invalid input, permission, cancellation, and save.
9. Run the release performance measurement with at least 1,000 activities.
10. Verify screen-reader use, keyboard use, and larger text on the main journey.
11. Confirm that the package has no development launcher or signing secret.
12. Update the artifact manifest with results and known limits.

Do not distribute the release if a required check fails.

## Current verification state

- Both artifact checksums match the artifact manifest.
- Both apps launch without Metro.
- Core, refresh, offline favorite, and native calendar checks passed on both platforms.
- Android release performance evidence is recorded.
- Android main-journey accessibility evidence is recorded.
- The iOS release VoiceOver journey remains pending.
- Physical-device haptic strength remains unverified.

The pending iOS VoiceOver check blocks a complete assessment sign-off. It does not invalidate the stored artifact.

## Response to a bad release

### Assessment review artifact

1. Stop sharing the affected artifact.
2. Record its platform, version, checksum, source commit, and failed check.
3. Keep the artifact for diagnosis until the replacement passes.
4. Fix the problem on a reviewed source commit.
5. Create a new artifact with a unique filename.
6. Repeat the complete pre-release checklist.
7. Replace the manifest entry only after verification passes.
8. Tell reviewers which artifact is obsolete.
9. Remove the obsolete local artifact after the review record is clear.

### Store release

1. Stop a staged rollout or phased release when the store permits it.
2. Keep the last approved store version available.
3. Do not reuse the failed build number or version code.
4. Submit a corrected build with higher platform build identifiers.
5. Repeat signing, package, runtime, accessibility, and performance checks.
6. Resume distribution only after the corrected build passes review.

This project has no public store release to restore. The store procedure is future guidance.

## Known limits

- The iOS artifact runs on the Simulator only.
- The Android artifact was verified on an emulator.
- Store signing and store submission were not performed.
- Physical-device haptics were not verified.
- The final iOS VoiceOver journey remains pending.

## Related documents

- [Assessment requirements](../assessment/requirements.md)
- [Release artifact manifest](../verification/artifacts.md)
- [Verification scenarios](../verification/scenarios.md)
- [Local EAS build guide](./eas-local-builds.md)
- [Native feedback improvement](../verification/improvement-native-feedback.md)
