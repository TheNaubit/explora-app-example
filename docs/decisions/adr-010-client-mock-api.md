# ADR-010: Client mock API with review modes

- Status: Accepted
- Date: 2026-09-22

## Context

The assessment needs production-shaped network calls, Zod validation, and reproducible success, slow, and fail loads. A real backend is out of scope.

## Decision

Keep a client-side mock API under `src/mocks/`. Validate every payload with Zod schemas under `src/schemas/`.

Drive request behavior with an in-memory review-mode store. Expose the store through the Dev Tools tab.

## Consequences

- Reviewers can reproduce load modes without external services.
- Screens and TanStack Query hooks can call the same mock functions later.
- Search and filter stay client-side on the returned catalog.
- Favorites stay a later local store. They are not part of this mock API.
