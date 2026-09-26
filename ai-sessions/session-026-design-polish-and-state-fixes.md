# Session 026: Design polish and state fixes

- Date: 2026-09-26
- Tool: Claude Code CLI agent
- Model: Claude Opus 5.5 (`claude-opus-5-5`)
- Record type: AI-generated summary, not a verbatim transcript

## User requests

1. Improve the design of the three screens and all their states. Use the Emil skills, the Appllama MCP and skills, and the Xcode MCP.
2. Keep all assessment requirements intact while the design changes.
3. Debug the card appear animation on Favorites.
4. Check the actionable errors. The Explore "could not load more" state looked poor.
5. Fix the next-page footer, because it was cut at the bottom.
6. Update this journal and commit all changes.

## Research

- Loaded `emil-design-eng`, `appllama-app-design-skill`, and `superpowers:systematic-debugging`.
- Studied Airbnb experience detail and discovery screens, and AllTrails saved and trail detail screens, through the Appllama MCP.
- Adopted the Airbnb pattern of icon-led fact rows for Activity Detail.
- Captured every screen before the change in the iOS Simulator, in light and dark mode.

## Changes

### Activity Detail

- The hero is square and capped at 440 points.
- A pull-down stretches the hero. The top edge stays on the screen top and the bottom edge stays still.
- A parallax effect was tried and removed, because it made a visible seam at the blended hero edge.
- Location and duration show as grouped fact rows with a symbol tile, a value, and a label.
- A solid compact bar with the activity title fades in after the hero scrolls away. The screen reader skips it.
- Add to Calendar has a supporting line. A chevron was tried and removed, because the wiki records a decision against it.
- The skeleton matches the new layout.

### Favorites

- One line below the title states the favorite count and "Available offline". It uses a Lingui plural and a separate spoken label.
- The expanded display title is capped at 1.5 times its base size. Before this change, "Favorites" broke in the middle of the word at accessibility text sizes. The cap also applies to Explore.

### States

- The recovery state symbol names the cause: no connection, timeout, invalid data, or a neutral alert.
- Empty, recovery, and banner states enter with a short fade and rise. Reduced motion shows them at once.
- The Explore next-page failure is a quiet compact footer below the last card. It has a neutral cause symbol, a title, a tonal "Try again" pill, and the cause text.
- Every retry action reads "Try again".

## Debugging

### Favorites card appear

- Recorded the tab switch and inspected it frame by frame.
- Root cause: the removal reflow `LinearTransition` was always active. It also animated the first placement of the cards.
- A first fix toggled the transition prop. Legend List then remounted its containers, and the removal reflow jumped instead of sliding. That fix was rejected.
- Final fix: one stable custom layout worklet that reads a shared "armed" flag. The flag is on only between the start of a favorite removal and the end of the reflow.
- A baseline recording confirmed that the original code slides during a removal. The final fix keeps that slide.

### Next-page footer

- The first redesign fitted a centered block, which did not fit below the last card.
- A full snap slot for the footer was tried and removed. The footer then peeked cut off below the last card.
- Root cause of the large gap: cards move up with the collapsing header, but the list footer did not.
- Final fix: the footer moves with the same scroll-linked translation, and the layout is compact enough to fit above the tab bar.

## Review

- A code-reviewer subagent reviewed the first batch. It found no critical or high issues.
- Fixed the medium findings:
  - Import order in the detail skeleton.
  - Favorites header height at large text.
  - The state entrance hid content from VoiceOver during the fade.
- Fixed the suggestions: a spoken summary without "·", named constants, a clearer refresh symbol, and a tested pure hero stretch helper.

## Validation

- Verified each change in the iOS Simulator (iPhone 18 Pro, iOS 27) in light mode, dark mode, and at accessibility text sizes.
- Used simulator video, `ffmpeg` frame sheets, Maestro flows, and native log capture for evidence.
- `npx oxlint --deny-warnings`, `npx oxfmt`, and `npx tsc --noEmit` passed.
- All 49 Jest suites and 187 tests passed.
- Tried and not adopted: parallax, a calendar chevron, a toggled layout transition, a centered footer, and a full-slot footer.

## Not verified in this session

- Android behavior.
- Release-build performance for the new motion.
- The calendar permission banner on screen after its style change.
- One removal skipped the particle dissolve because the view snapshot failed. It did not recur, and this session did not change that code path.
