# Session 024: State matrix and Maestro verification

- Date: 2026-09-25
- Tool: OpenAI Codex desktop agent
- Model: GPT-5 family; exact deployment slug unavailable
- Record type: AI-generated summary, not a verbatim transcript

## User request

The user requested a full assessment-state iteration.

The user also requested Maestro setup and automated state checks through Dev Tools.

## Work completed

- Replaced thrown first-load Query failures with explicit catalog and detail states.
- Added one shared first-load recovery component.
- Added a valid empty-catalog review mode.
- Added review revisions to Query keys for kept-alive native tabs.
- Moved later-page recovery to the list footer where the failure occurs.
- Exposed one accessible Activity Detail loading progress element.
- Increased the slow review mode to 10 seconds for reproducible checks.
- Added Maestro installation scripts, syntax checks, a Simulator runner, and eight flows.
- Added one tagged core journey and one tagged failure or recovery test for the assessment minimum.
- Expanded all eight assessment scenarios with steps, expected behavior, observed results, and evidence.
- Updated the state, data, Dev Tools, decision, and verification documentation.

## Runtime findings

- Clearing app storage opens the Expo development-client launcher.
- The Maestro bootstrap resets local data through Dev Tools instead.
- iOS minimizes the native tab bar after long settings scrolls.
- The flows return to the top before cross-tab navigation.
- The Expo development gear overlaps the Activity Detail favorite button.
- The favorite flow uses the unobstructed Explore card control.
- The reset bootstrap accepts a partly visible reset row and waits for the native dialog animation.
- Pagination expands the minimized native tab bar before it changes tabs.

## Verification

- Focused Jest suites passed during implementation.
- Maestro syntax checks passed for all flows and the reset subflow.
- All eight Maestro flows have passing runs on the iOS 27.0 Simulator.
- The tagged core and recovery pair passed together through `npm run test:e2e:assessment:ios`.
- The final complete suite passed 8 of 8 flows in 12 minutes and 2 seconds.
- The catalog state flow also passed in dark mode with extra-extra-extra-large text.
- Maximum accessibility text kept Dev Tools scrollable, but the generic flow timeout was too short for that taller page.
- Android runtime verification was not available in this session.
- Release performance evidence remains separate from these development-client checks.
