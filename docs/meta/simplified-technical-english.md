# Simplified Technical English (ASD-STE100)

This project uses [ASD-STE100](https://asd-ste100.org/about_STE.html) principles for:

- Agent replies to the user
- All pages under `docs/`
- JSDoc on shared code

We do **not** enforce the full official dictionary. We do enforce the writing rules below. You may use project technical nouns (Expo, Zod, MMKV, TanStack Query, and similar).

## Why

Short, active, consistent text is easier to read. It lowers cognitive load for humans and agents.

## Rules

1. Keep sentences short (about 20 words for procedures, 25 for description).
2. Put one idea in each sentence.
3. Use the active voice.
4. Use the imperative for instructions.
5. Use the same term for the same thing.
6. Do not use contractions.
7. Do not use idioms, slang, or metaphors.
8. Prefer simple connectors: and, but, if, then, because.
9. Use present tense for current behavior. Label planned work.
10. Use lists for multi-step procedures.

## Examples

| Avoid                                              | Prefer                                                   |
| -------------------------------------------------- | -------------------------------------------------------- |
| Favorites should be persisted so they aren’t lost. | Persist favorites in MMKV. Do not lose them on relaunch. |
| Under the hood we gut the old flow.                | Replace the old flow.                                    |
| You’ll want to open the index first.               | Open `docs/INDEX.md` first.                              |

## Related

- Root rulebook: `AGENTS.md` → Simplified Technical English
- Wiki maintenance: [wiki-maintenance.md](./wiki-maintenance.md)
