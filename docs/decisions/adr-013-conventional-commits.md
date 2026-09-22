# ADR-013: Conventional Commits

- Status: Accepted
- Date: 2026-09-22

## Context

Commit messages must stay consistent for humans and tools. Free-form subjects become long, unclear, and hard to scan. The project already uses Husky for pre-commit checks.

## Decision

Use [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/#summary).

- Format: `<type>[optional scope]: <description>`
- Common types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`, `ci`, `build`, `style`
- Subject: imperative mood, no trailing period, header max 100 characters
- Enforce with `@commitlint/config-conventional` on the Husky `commit-msg` hook

## Consequences

- Bad commit messages fail before they land.
- History stays typed and scannable.
- Agents must follow the same format when they create commits.
