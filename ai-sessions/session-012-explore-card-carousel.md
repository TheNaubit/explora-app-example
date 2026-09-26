# AI-generated session summary: Explore card carousel

This file is a summary. It is not a verbatim transcript.

## Date

2026-09-23

## User request

Rebuild the Explore cards from the Perplexity vertical list reference.

Use Reanimated, Legend List, and custom Pulsar haptics. Reduce the large gaps around the cards.

## Work completed

- Downloaded the public reference recording from the linked article.
- Inspected the recording frame by frame.
- Measured the focused and adjacent card geometry.
- Added scroll-linked scale and opacity through Reanimated.
- Kept Legend List as the catalog list.
- Added interval snapping and fast native deceleration.
- Added one soft Pulsar detent for each new settled card.
- Reduced the header gap and the gap between card slots.
- Added a standard-list fallback for reduced motion and large text.
- Made the iOS header reserve respond to Dynamic Type.
- Preserved the existing accessibility labels and favorite controls.

## Skills and sources used

- `reverse-engineer-ui-animation`
- `find-animation-opportunities`
- `animate-expo`
- `emil-design-eng`
- `apple-design`
- `expo-ui`
- `react-native-best-practices`
- `pulsar-haptics`
- `build-ios-apps:ios-debugger-agent`
- The public Animate React Native reference recording
- Pulsar React Native SDK documentation

## Verification

- Oxlint passed with warnings denied.
- Oxfmt completed.
- TypeScript passed with no errors.
- All 33 Jest suites passed.
- All 98 Jest tests passed.
- iOS Simulator expanded-header layout
- iOS Simulator collapsed-header layout
- iOS Simulator card snapping
- iOS Simulator adjacent-card visibility
- iOS Simulator dark mode and accessibility-large text

The iOS Simulator cannot verify physical haptic quality. A physical device check remains necessary.

Jest reports an existing open-handle warning after all tests pass.

Expo Doctor passed 19 of 20 checks. It reports 12 existing Expo patch-version mismatches.

## Follow-up: focused image blur

The user asked for unfocused card images to stay slightly blurred during vertical scrolling.
The blur must clear as each card reaches the focus point.

- Added one static full-cover blur layer to carousel cards.
- Derived its opacity from the existing Reanimated scroll offset.
- Kept the focused card image sharp.
- Crossfaded layer opacity instead of animating blur radius each frame.
- Kept the standard list for reduced motion, web, and large text.
- Updated the design contract and discovery documentation.
- Added focused coverage for the optional blur layer.

Oxlint passed with warnings denied.
The focused Activity Card suite passed all four tests.
The current full TypeScript and Explore checks contain unrelated category-filter errors from concurrent worktree changes.
Device motion review remains necessary.

## Follow-up: shared Saved presentation

The user asked Saved to match Explore without search or category filters.

- Extracted the focused activity carousel as a shared component.
- Extracted the collapsing iOS header as a shared component.
- Used both components on Explore and Saved.
- Kept the Saved empty state.
- Removed the Saved subtitle after user review.
- Derived Saved header travel from the compact title height.
- Kept later saved cards below the compact title after snapping.
- Kept search, category filters, refresh, and pagination out of Saved.
- Added Saved screen assertions for carousel snapping and excluded discovery controls.

All 34 Jest suites passed. All 106 tests passed.
Oxlint, Oxfmt, TypeScript, and the diff check passed.
The iOS 27 Simulator showed the Saved header and saved card correctly.

## Follow-up: Explore tab scroll position

The user reported that a Favorites tab round trip changed the Explore scroll position.

- Added a session scroll position for each search and category state.
- Saved the live UI-thread position when Explore loses focus.
- Kept drag-end and momentum-end checkpoints.
- Reset all stored positions with the existing local-data reset action.
- Added store, list, and tab-focus regression tests.

The focused regression suite passed all 19 tests.
All 47 Jest suites passed. All 175 tests passed.
Oxlint, Oxfmt, TypeScript, and the diff check passed.
The iOS Simulator kept the filtered Explore card after a Favorites round trip.
Android runtime verification remains pending.
