# Native toast feedback

## Purpose

Explora uses native transient feedback for completed actions and recoverable failures.

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
- The snackbar supports one optional action.
- The module uses system haptic feedback constants.
- The Android system controls haptic availability and user settings.
- The snackbar provides the native accessibility surface.

## Current use

- Explore refresh success and failure.
- Activity detail refetch failure when saved content remains visible.
- Calendar save success.
- Calendar form completion information on Android.
- Calendar validation and native errors.
- Duplicate calendar submission warning.

Successful calendar results use only the native toast. They do not add persistent banners.

Actionable permission and native failures keep their inline recovery action. The toast provides immediate feedback and does not replace that action.

Development builds show a test panel on Activity Detail. The panel triggers success, warning, error, and information feedback.

The panel also shows if the installed app contains the native module. Release builds do not show the panel.

## Code map

| Concern               | Location                                                    |
| --------------------- | ----------------------------------------------------------- |
| Universal API         | `src/native-toast/index.ts`                                 |
| Module TypeScript     | `modules/expo-native-toast/src/`                            |
| Swift implementation  | `modules/expo-native-toast/ios/ExpoNativeToastModule.swift` |
| Kotlin implementation | `modules/expo-native-toast/android/src/main/java/`          |

## Verification status

- TypeScript and all 154 JavaScript tests pass in the main project.
- The iOS module compiles for the iOS 27 Simulator.
- The complete iOS development app builds and reports that the native module is ready.
- Repeated builds reuse DerivedData when the build command and settings stay unchanged.
- Android compilation is pending because this machine has no Android SDK.
- Physical-device haptic feel remains a device-only check.
