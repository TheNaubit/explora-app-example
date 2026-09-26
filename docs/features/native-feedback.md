# Native toast feedback

## Purpose

Explora uses native transient feedback for temporary failures and confirmed calendar saves.

The local `expo-native-toast` module owns the visual surface, semantic haptic, timing, and accessibility announcement.

## Universal API

Call `showNativeToast` with these fields:

- `type`: `success`, `warning`, `error`, or `info`.
- `title`: Required translated title.
- `message`: Optional translated detail.
- `duration`: Optional duration in milliseconds.
- `id`: Optional identifier for an Android action event.
- `actionLabel`: Optional Android action label.

Android action labels do nothing on iOS. This keeps one JavaScript API without imitating Android controls on iOS.

## Platform behavior

### iOS

- The module adds a transparent SwiftUI overlay to the active app window.
- iOS 26 and later use native Liquid Glass.
- Earlier versions use native regular material.
- The neutral capsule grows to fit the title instead of using a fixed width.
- The colored semantic icon appears first. The capsule then expands to show the title.
- The message stays available to the accessibility announcement but does not increase the visual size.
- Success, warning, and error use `UINotificationFeedbackGenerator`.
- Info uses a soft `UIImpactFeedbackGenerator` cue.
- The module posts a native accessibility announcement.

### Android

- The module uses a Material native `Snackbar`.
- The snackbar keeps one neutral surface for all outcomes.
- A leading Material symbol identifies success, warning, error, or information.
- The symbol uses a semantic green, amber, red, or blue tint.
- The title uses bold text. The optional message uses regular text on the next line.
- Text and symbols communicate the outcome without color alone.
- The semantic symbol colors keep clear contrast in light and dark app themes.
- The snackbar supports one optional action.
- The module uses system haptic feedback constants.
- The Android system controls haptic availability and user settings.
- The snackbar provides the native accessibility surface.
- The module queues feedback while the app window lacks focus.
- Pending feedback appears after a native dialog returns focus to the app window.

## Current use

- Explore refresh failure when current activities remain usable.
- Activity detail refetch failure when a saved copy remains usable.
- Confirmed calendar save success.

Other successful actions stay silent. Canceled actions also stay silent.

Actionable failures use one inline recovery surface. They do not also show a toast.

Dev Tools previews transient error feedback and confirmed calendar success.

Dev Tools also reports if the installed app contains the native module.

## Code map

| Concern               | Location                                                    |
| --------------------- | ----------------------------------------------------------- |
| Feedback policy       | `src/feedback/feedback-policy.ts`                           |
| Universal API         | `src/native-toast/index.ts`                                 |
| Module TypeScript     | `modules/expo-native-toast/src/`                            |
| Swift implementation  | `modules/expo-native-toast/ios/ExpoNativeToastModule.swift` |
| Kotlin implementation | `modules/expo-native-toast/android/src/main/java/`          |

## Verification status

- TypeScript and the current JavaScript test suite pass in the main project.
- The iOS module compiles for the iOS 27 Simulator.
- The complete iOS development app builds and reports that the native module is ready.
- Repeated builds reuse DerivedData when the build command and settings stay unchanged.
- The Android development app builds and installs on an Android 16 emulator.
- The Android local EAS release APK builds and starts without Metro.
- The emulator shows the semantic success snackbar in light and dark themes.
- The emulator shows the semantic error snackbar in the light theme.
- The calendar flow shows the semantic success snackbar after a confirmed save.
- The calendar cancellation, permission, save, and feedback flow passes against the final release APK.
- Physical-device haptic feel remains a device-only check.

## Evidence

- [Before and after improvement record](../verification/improvement-native-feedback.md)
- [iOS success after the native change](../verification/evidence/native-feedback/ios-success-after.jpg)
- [iOS transient error after the native change](../verification/evidence/native-feedback/ios-error-after.jpg)
- [Android success in light mode](../verification/evidence/native-feedback/android-success-light.jpg)
- [Android error in light mode](../verification/evidence/native-feedback/android-error-light.jpg)
- [Android success in dark mode](../verification/evidence/native-feedback/android-success-dark.jpg)
- [Android calendar save](../verification/evidence/native-calendar/android-saved-toast.jpg)
