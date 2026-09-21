# Decisions

Architecture Decision Records (ADRs) for lasting choices. Each page is short: context, decision, consequences. Do not store debate transcripts here.

| ID      | Title                                                                                | Status   |
| ------- | ------------------------------------------------------------------------------------ | -------- |
| ADR-001 | [Technical wiki in `docs/`](./adr-001-docs-wiki.md)                                  | Accepted |
| ADR-002 | [Zod for payload validation](./adr-002-zod-validation.md)                            | Accepted |
| ADR-003 | [Simplified Technical English](./adr-003-simplified-technical-english.md)            | Accepted |
| ADR-004 | [Pre-commit lint, format, and TypeScript check](./adr-004-pre-commit-lint-staged.md) | Accepted |
| ADR-005 | [react-native-a11y for accessibility](./adr-005-react-native-a11y.md)                | Accepted |

## Template

When you add a decision, copy:

```markdown
# ADR-XXX: Title

- Status: Proposed | Accepted | Superseded
- Date: YYYY-MM-DD

## Context

## Decision

## Consequences
```

Link the new file from this index. Link it from `docs/INDEX.md` if the topic is cross-cutting.
