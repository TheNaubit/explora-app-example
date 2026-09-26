# Verification

This area explains how we prove Explora behavior. Prefer links to scenarios, tests, and evidence. Do not paste large logs here.

| Topic                                          | Page                                                           |
| ---------------------------------------------- | -------------------------------------------------------------- |
| Scenario checklist (assessment)                | [scenarios.md](./scenarios.md)                                 |
| Full assessment verification and delivery text | [../assessment/requirements.md](../assessment/requirements.md) |
| Automated tests                                | Jest plus two tagged Maestro assessment flows                  |
| State journey automation                       | [Maestro state checks](../operations/maestro.md)               |
| Performance evidence                           | _(add when measured)_                                          |

Submission packages (video, APK notes, `AI_SESSION.md`) may **point at** these pages. Do not turn this folder into the full submission dump.

## Current local checks

- On 2026-09-26, all 46 Jest suites and 178 tests passed.
- Jest exited normally without `act()` warnings or open-handle warnings.
- The Lingui check passed with 151 English source messages and no catalog difference.
