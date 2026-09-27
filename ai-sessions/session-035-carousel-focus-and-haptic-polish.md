# Session 035: carousel focus and haptic polish

- Date: 2026-09-27
- Tool: OpenAI Codex desktop agent
- Model: GPT-5 family; exact deployment slug unavailable
- Record type: AI-generated summary, not a verbatim transcript

## User request

The user asked for an app-wide microinteraction and haptic review.

The user reported that the card-settle haptic felt late.

The user also reported incorrect focused-card restoration after tab changes and favorite removal.

## Work completed

- Moved the card detent from momentum completion to snap commitment.
- Used the iOS target offset when it is available.
- Used scroll direction as the Android fallback.
- Kept one detent for each changed card.
- Added one selection haptic to the Favorites empty-state action.
- Added one selection haptic when an empty search clears active filters.
- Kept retries, ordinary card navigation, and pagination silent.
- Confirmed that the native calendar success toast already owns its semantic haptic.
- Stored the focused favorite by activity ID and fallback index for the app session.
- Restored the same activity when an earlier favorite was removed.
- Selected the nearest remaining activity when the focused favorite was removed.
- Synchronized the list offset and visual focus without a second native scroll animation.
- Restored the correct Explore position when a kept-alive tab changes filters.
- Reused the installed development build and existing Metro server.
- Did not create a new native build or large build artifacts.

## Test-driven evidence

The first focused test run failed for the intended missing behavior.

- The snap-commit test received zero haptic calls.
- The Favorites navigation test received zero selection haptic calls.
- The focus reconciliation test still received `animated: true`.
- The Favorites session-position module did not exist.
- The kept-alive Explore filter test received the old offset.

The final focused run passed 7 suites and 32 tests.

The session-position module reached 100 percent statement, branch, function, and line coverage.

The tests cover these guarantees:

- A card snap plays its detent before momentum completion.
- The Android direction fallback commits the correct adjacent card.
- Momentum completion does not duplicate the detent.
- Favorites keeps the same focused activity after an earlier removal.
- Favorites uses the nearest remaining position after focused-card removal.
- The Browse activities action gives selection feedback and opens Explore.
- Explore restores the scroll position for the active filter state.
- Clearing active empty-result filters gives selection feedback.

## Verification

- All 53 Jest suites passed.
- All 203 Jest tests passed.
- Jest exited without warnings or open handles.
- Oxlint passed with warnings denied.
- Oxfmt completed.
- TypeScript passed with no errors.
- The Lingui check passed with 153 source messages and no catalog difference.
- Maestro syntax passed for all flows.
- The iOS Simulator Favorites empty-action flow passed.
- The physical iPhone development app launched and loaded the updated bundle.

## Limits

- Automated tests verify haptic timing calls, but they cannot measure physical haptic feel.
- The user must confirm the revised detent timing on the physical iPhone.
- Android runtime verification for this interaction remains pending.
- This file summarizes the work. It is not a verbatim conversation export.
