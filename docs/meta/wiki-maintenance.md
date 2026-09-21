# Wiki maintenance

Keep this wiki useful. Agents also see a short copy in root `AGENTS.md`.

Write all wiki pages in Simplified Technical English. See [simplified-technical-english.md](./simplified-technical-english.md).

## Purpose split

| Location        | Role                                                                     |
| --------------- | ------------------------------------------------------------------------ |
| `AGENTS.md`     | Always-on rules: stack, hard constraints, how to work                    |
| `docs/`         | Product and engineering wiki: behavior, architecture, ADRs, verification |
| `AI_SESSION.md` | AI usage for submission. Not the wiki.                                   |

## Writing rules

1. Write about the system in present tense. Do not write chat logs or “today I…” notes.
2. Keep one topic per file. Link from `INDEX.md` and area indexes.
3. Prefer an update to an existing page over a new near-duplicate page.
4. Record important trade-offs as ADRs under `decisions/`.
5. Mark planned work and shipped work clearly.
6. Keep `docs/.gitkeep` if you remove all pages.

## End-of-task checklist

- [ ] Feature pages match shipped behavior.
- [ ] Architecture and code maps are still valid.
- [ ] New trade-offs have ADRs.
- [ ] Verification and ops pages match current repro steps.
- [ ] Indexes link every page.
- [ ] New or changed text follows Simplified Technical English.
