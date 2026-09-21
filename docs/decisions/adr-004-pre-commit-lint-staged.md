# ADR-004: Pre-commit lint, format, and TypeScript check

- Status: Accepted
- Date: 2026-09-21

## Context

The project must stay lint-clean, formatted, and type-safe. A full-tree fix after every edit is slow as the repo grows. Commits must not land with lint warnings, bad format, or TypeScript errors.

## Decision

Use Husky plus lint-staged on pre-commit.

- Staged JS/TS: `oxlint --fix --deny-warnings`, then `oxfmt`
- Staged JSON/Markdown: `oxfmt`
- When any `.ts` / `.tsx` file is staged: run `npx tsc --noEmit` once for the project

Agents rely on this gate instead of a full-tree fix after every change.

## Consequences

- Commits stay clean without full-tree lint cost on each edit.
- Type errors block the commit when TypeScript files are staged.
- Unstaged or uncommitted work can still be dirty until commit or a manual check.
- `tsc` checks the whole project, so one bad unstaged TS file can still fail the hook.
