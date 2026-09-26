# Session 030: iOS release artifact

- Date: 2026-09-26
- Tool: OpenAI Codex desktop agent
- Model: GPT-5 family; exact deployment slug unavailable
- Record type: AI-generated summary, not a verbatim transcript

## User request

The user asked for the final iOS release artifact.

The user will create the ten-minute presentation video later.

## Work completed

- Built the iOS Simulator app with the local EAS `production-simulator` profile.
- Inspected the archive, app metadata, architectures, and embedded JavaScript bundle.
- Confirmed that the archive has no development-launcher bundle.
- Installed the release app on an iPhone 18 Pro Simulator with iOS 27.0.
- Launched the app without Metro.
- Ran the two required assessment flows against the release app.
- Ran the saved-detail fallback flow against the release app.
- Verified calendar schedule cancellation, system-form cancellation, and event saving.
- Recorded the artifact metadata and checksum in the verification wiki.

## Results

- Artifact: `dist/eas-builds/build-1790457549256.tar.gz`.
- Version: `1.0.0` build `1`.
- Architectures: `arm64` and `x86_64`.
- Source commit: `8d4b3d0`.
- Core journey passed in 1 minute and 7 seconds.
- Refresh integrity passed in 1 minute and 35 seconds.
- Saved-detail fallback passed in 1 minute and 17 seconds.
- Calendar cancellation stayed silent.
- Calendar saving showed the native success toast.

## Limits

- The test used an iOS Simulator.
- EventKit did not expose its system form to Maestro's XCTest hierarchy.
- Device Hub completed the final system-form actions.
- The full iOS VoiceOver main journey remains pending.
- The user will create the final presentation video later.
