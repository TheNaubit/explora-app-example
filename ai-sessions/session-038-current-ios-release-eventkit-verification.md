# Session 038: current iOS release EventKit verification

- Date: 2026-09-27
- Tool: OpenAI Codex desktop agent
- Model: GPT-5 family; exact deployment slug unavailable
- Record type: AI-generated summary, not a verbatim transcript

## User request

The user asked to repeat the final EventKit actions with the current iOS release archive.

## Environment

- Artifact: `dist/eas-builds/build-1790510925602.tar.gz`.
- Source commit in artifact: `16283fe`.
- Device: iPhone 18 Pro Simulator.
- OS: iOS 27.0.
- Metro: stopped and not required.

## Observed results

- Schedule cancellation returned without feedback.
- The permission prompt requested add-only calendar access.
- Permission denial produced the blocked state and **Open Settings** action.
- The app-specific Settings page showed the calendar permission state.
- Allowing access opened the system event form.
- The form contained the activity title, location, description, and one-hour duration.
- System-form cancellation returned to Activity Detail without feedback.
- Saving returned to Activity Detail with the native success message.
- The success message said that the system calendar saved the activity.

## Limits

- Device Hub completed the separate EventKit system-form actions.
- The run used a Simulator. It does not prove physical-device haptic strength.
- Invalid-input and duplicate-submit behavior remain covered by focused automated tests.

This file summarizes the work. It is not a verbatim conversation export.
