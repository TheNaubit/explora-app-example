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

Agents also run oxlint with `--format=agent` (then format and `tsc`) after a change batch. The commit hook is a backup. It is not the only check during agent work.

## Consequences

- Commits stay clean without full-tree lint cost on each tiny edit.
- Type errors block the commit when TypeScript files are staged.
- Agents get actionable lint output during the coding loop.
- Unstaged or uncommitted work can still be dirty until those checks or a commit.
- `tsc` checks the whole project, so one bad unstaged TS file can still fail the hook.
