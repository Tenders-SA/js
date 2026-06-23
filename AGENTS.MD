# @tenders-sa-org/sdk-js — Agent Instructions

**Path**: `api-sdk-packages/js/` | **Published**: [npm](https://npmjs.com/package/@tenders-sa-org/sdk-js) | **Repo**: [github.com/Tenders-SA/js](https://github.com/Tenders-SA/js)

## What It Is
Zero-dependency TypeScript SDK for the Tenders-SA Developer API. The most mature of all 3 SDKs. Dual ESM/CJS with full type definitions.

## Quick Start
```bash
npm install
npm run build        # tsup: esm + cjs (entry: src/index.ts → dist/)
npm test             # vitest (tests/unit/)
npm test:coverage    # vitest with coverage
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
# Publish: push to main (semantic-release auto-publishes) OR:
npm version patch && npm publish  # manual
```

## Key Files
| File | Purpose |
|------|---------|
| `src/client.ts` | `TendersaClient` — request dispatch, pagination, rate limiting |
| `src/resources/*.ts` | Resource classes: tenders, awards, companies, organizations, meta |
| `src/types/*.ts` | Domain type definitions (tender, company, organization, meta, analysis, common) |
| `src/errors/index.ts` | Error hierarchy: `TendersaError`, `AuthError`, `RateLimitError`, etc. |
| `src/pagination.ts` | `PaginatedAsyncIterator` for paginated list endpoints |
| `src/retry.ts` | `withRetry` — exponential backoff helper |
| `src/version.ts` | Version constant |

## Architecture Notes
- **Zero runtime dependencies** — pure TypeScript using native `fetch`
- **Dual ESM/CJS** via tsup `format: ['esm', 'cjs']` + `exports` map in package.json
- **semantic-release** on push to `main` — only submodule with automated publishing
- Resource pattern: `client.tenders.list()`, `client.companies.get(name)`, etc.
- Strict tsconfig: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`
- Has eslint configured (only SDK with a linter)

## Consumers
- `@tenders-sa-org/cli` wraps this SDK — update sdk-js first, then bump CLI

## Published
- v0.2.0 (current) — v2 API update: 16 resources, 90+ endpoints, new types (categories, provinces, directors, ocds, intel, forensic, cipc, newsletters, documents, industry, services, seo)
- v0.1.0 (initial)
