# Explora wiki

This is the technical knowledge base for humans and AI agents. It is not a changelog, journal, or chat log.

**Start here** when you need product behavior, architecture, feature detail, or a decision. Keep pages current as you develop.

Always-on coding rules and hard assessment constraints live in root [`AGENTS.md`](../AGENTS.md). That file keeps a short checklist. It links here for detail.

Write wiki pages in Simplified Technical English. See [meta/simplified-technical-english.md](./meta/simplified-technical-english.md).

| Area              | Content                                 | Index                                                                          |
| ----------------- | --------------------------------------- | ------------------------------------------------------------------------------ |
| Product           | Goals, journeys, scope                  | [product/overview.md](./product/overview.md)                                   |
| Design system     | Tokens, components, states, materials   | [../DESIGN.md](../DESIGN.md)                                                   |
| Dataset           | Supplied JSON, 1k scale, mocks          | [product/dataset.md](./product/dataset.md)                                     |
| Assessment        | Full requirements, delivery, AI session | [assessment/requirements.md](./assessment/requirements.md)                     |
| Architecture      | Structure, data flow                    | [architecture/overview.md](./architecture/overview.md)                         |
| Project structure | Folder map                              | [architecture/project-structure.md](./architecture/project-structure.md)       |
| Features          | Capability behavior                     | [features/index.md](./features/index.md)                                       |
| Decisions         | ADR-style trade-offs                    | [decisions/index.md](./decisions/index.md)                                     |
| Verification      | Scenarios, tests, evidence pointers     | [verification/index.md](./verification/index.md)                               |
| Operations        | Local run, reset data, load modes       | [operations/local-dev.md](./operations/local-dev.md)                           |
| Wiki meta         | How to maintain this tree               | [meta/wiki-maintenance.md](./meta/wiki-maintenance.md)                         |
| STE               | Simplified Technical English rules      | [meta/simplified-technical-english.md](./meta/simplified-technical-english.md) |

## How to use

1. Open this file first.
2. Follow the link for your topic.
3. Prefer an update to an existing page over a new page.
4. If you add a page, link it from this index and from the area index.

## What does not belong here

- Session transcripts or diary notes → `AI_SESSION.md` / submission materials
- Agent coding rules and stack mandates → root `AGENTS.md`
- Personal todos or scratch notes
- A full copy of `AGENTS.md` inside wiki pages
