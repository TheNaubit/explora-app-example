# ADR-002: Zod for payload validation

- Status: Accepted
- Date: 2026-09-21

## Context

Explora uses mocked APIs, JSON fixtures, and generated activities. Untyped payloads can corrupt local state or hide broken mocks.

## Decision

Validate external-shaped data with Zod schemas under `src/schemas/`. Infer types with `z.infer`. Parse with shared helpers in `src/utils/parse-with-schema.ts` before data enters app state or UI.

## Consequences

- Invalid mocks and fixtures fail clearly. This helps failure and recovery demos.
- Types stay aligned with runtime checks.
- New payload shapes need schemas. Schemas are required.
