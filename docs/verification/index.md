# Verification

This area explains how we prove Explora behavior. Prefer links to scenarios, tests, and evidence. Do not paste large logs here.

| Topic                                          | Page                                                                              |
| ---------------------------------------------- | --------------------------------------------------------------------------------- |
| Scenario checklist (assessment)                | [scenarios.md](./scenarios.md)                                                    |
| Full assessment verification and delivery text | [../assessment/requirements.md](../assessment/requirements.md)                    |
| Automated tests                                | Jest plus two tagged Maestro assessment flows                                     |
| State journey automation                       | [Maestro state checks](../operations/maestro.md)                                  |
| Performance evidence                           | [Scenario 7](./scenarios.md#scenario-7-performance-with-at-least-1000-activities) |
| Before and after improvement evidence          | [Platform-native outcome feedback](./improvement-native-feedback.md)              |
| Release artifact manifest                      | [artifacts.md](./artifacts.md)                                                    |
| Release process                                | [Release note](../operations/release-note.md)                                     |

Submission packages (video, APK notes, `AI_SESSION.md`) may **point at** these pages. Do not turn this folder into the full submission dump.

## Current local checks

- On 2026-09-26, all 52 Jest suites and 196 tests passed.
- Jest exited normally without `act()` warnings or open-handle warnings.
- The Lingui check passed with 153 English source messages and no catalog difference.
- Android Maestro passed all eight flows.
- The final Android release APK passed native calendar and assessment checks without Metro.
- The final iOS Simulator release app passed launch, core, refresh, saved-detail, and native calendar checks without Metro.
