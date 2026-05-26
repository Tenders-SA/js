# @tendersa/sdk

Official TypeScript/JavaScript SDK for the [Tenders-SA Developer API](https://tenders-sa.org/developers) — enriched South African public procurement data.

---

## About Tenders-SA

[Tenders-SA.org](https://www.tenders-sa.org) is an **AI-powered tender matching and application platform** for South African businesses. It aggregates tenders from national, provincial, and municipal government departments, SOEs (Eskom, Transnet, SANRAL), and public entities — sourced directly from official OCDS (Open Contracting Data Standard) feeds.

The platform goes beyond simple aggregation: AI enrichment extracts key requirements, generates summaries, estimates tender values, classifies categories, and calculates compatibility scores between your company profile and each opportunity. The result is a unified intelligence layer over South Africa's fragmented public procurement landscape.

### Key Platform Features

- **Tender Discovery** — Search and filter thousands of active, closed, and awarded tenders across all provinces and categories
- **AI Enrichment** — Every tender is processed through AI pipelines for summarisation, requirement extraction, value estimation, and classification
- **Company Intelligence** — Research award histories, track supplier performance, and perform due diligence
- **Organisation Profiles** — Procurement body profiles enriched with Google and Wikidata data
- **Award Analytics** — Analyse award patterns by enterprise type, BEE level, province, and category
- **Document Management** — Centralised document vault with CIPC, tax clearance, and BBBEE certificates
- **Tender Toolkit** — BBBEE Calculator, Readiness Assessment, Market Heatmap, AI Proposal Generator

---

## About the Developer API

The Tenders-SA Developer API exposes this enriched procurement data through a set of RESTful endpoints. It serves from a dedicated infrastructure layer with its own database, synced from the main platform, ensuring the API remains fast and available independently of the main web application.

### API Base URL

```
https://api.tenders-sa.org/v1
```

### Authentication

All API requests require a Bearer token passed via the `Authorization` header:

```
Authorization: Bearer tsa_prod_YOUR_API_KEY
```

API keys are generated through the [Developer Portal](https://tenders-sa.org/developers/api-keys). Keys use the format `tsa_prod_` followed by a unique generated string.

**Access Requirements:** API access requires a [Professional or Enterprise subscription](https://tenders-sa.org/pricing).

| Plan | Max Keys | Daily Limit | Monthly Limit |
|------|----------|-------------|---------------|
| Professional | 3 | 500 | 15,000 |
| Enterprise | 25 | 10,000 | 300,000 |

### Response Format

All API responses follow a consistent envelope:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "req_uuid",
    "timestamp": "2026-01-01T00:00:00Z",
    "apiVersion": "v1",
    "page": 1,
    "pageSize": 20,
    "totalCount": 142,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false,
    "rateLimit": {
      "limit": 500,
      "remaining": 498,
      "reset": "2026-01-02T00:00:00Z",
      "policy": "daily"
    }
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Not found",
  "code": "NOT_FOUND",
  "message": "The requested resource was not found",
  "requestId": "req_xxx",
  "docs": "https://tenders-sa.org/developers/docs/errors#NOT_FOUND",
  "timestamp": "2026-01-01T00:00:00Z"
}
```

### Rate Limiting

Rate limit status is returned in both response headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `X-RateLimit-Policy`) and the response body's `meta.rateLimit` object. When exceeded, a `429` status is returned.

### Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | `BAD_REQUEST` | Invalid request parameters |
| 401 | `UNAUTHORIZED` | Missing or invalid API key |
| 403 | `FORBIDDEN` / `KEY_NOT_ACTIVE` / `KEY_EXPIRED` | Key not active or expired |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` / `KEY_LIMIT_REACHED` | Key limit reached for plan |
| 429 | `RATE_LIMIT_DAILY_EXCEEDED` / `RATE_LIMIT_MONTHLY_EXCEEDED` | Rate limit exceeded |
| 500 | `INTERNAL_ERROR` | Server error |
| 502 | `SERVICE_UNAVAILABLE` | Service temporarily unavailable |

### Sparse Fields

Reduce response payload size by specifying only the fields you need:

```
GET /v1/tenders?fields=tenderId,title,status,closingDate
```

---

## Installation

```bash
npm install @tendersa/sdk
```

### Requirements

- Node.js 18+ (native `fetch`)
- TypeScript 5+ (optional, for type safety)

---

## Quick Start

```typescript
import { TendersaClient } from '@tendersa/sdk'

const client = new TendersaClient({ apiKey: 'tsa_prod_your_key' })

// List open tenders in Western Cape
const tenders = await client.tenders.list({
  status: 'OPEN',
  province: 'Western Cape',
})

for (const tender of tenders.data) {
  console.log(`${tender.title} — ${tender.closingDate}`)
}

// Get tender detail
const detail = await client.tenders.get('tender_001')
console.log(detail.data.aiSummary)

// AI-powered search
const results = await client.tenders.search({ q: 'road construction' })
```

---

## Usage

### Creating a Client

```typescript
import { TendersaClient } from '@tendersa/sdk'

const client = new TendersaClient({
  apiKey: 'tsa_prod_your_key',

  // Optional:
  baseUrl: 'https://api.tenders-sa.org',   // default
  timeout: 30_000,                          // 30s (default)
  retry: { maxRetries: 3 },                 // exponential backoff
})
```

### Resources

The SDK is organised into five resource classes, each mirroring a section of the API.

#### Tenders

```typescript
const { data } = await client.tenders.list({
  status: 'OPEN',
  category: 'Construction',
  province: 'Gauteng',
  sort: '-closingDate',
})

const detail = await client.tenders.get('tender_001')
const docs = await client.tenders.documents('tender_001')
const awards = await client.tenders.awards('tender_001')
const timeline = await client.tenders.timeline('tender_001')
const analysis = await client.tenders.analysis('tender_001')
const estimate = await client.tenders.valueEstimate('tender_001')
const search = await client.tenders.search({ q: 'road construction' })
```

#### Awards

```typescript
const { data } = await client.awards.list({
  province: 'Western Cape',
  beeLevel: 'Level 1',
  minAmount: 1_000_000,
})

const award = await client.awards.get('award_001')

const analytics = await client.awards.analytics({
  groupBy: 'province',
  from: '2025-01-01',
  to: '2025-12-31',
})
```

#### Companies

```typescript
const company = await client.companies.get('BuildCorp SA')

const results = await client.companies.search({
  q: 'Construction',
  beeLevel: 'Level 1',
  province: 'Gauteng',
})
```

#### Organisations (Procurement Bodies)

```typescript
const org = await client.organizations.get('org_001')

const tenders = await client.organizations.tenders('org_001', {
  status: 'OPEN',
})
```

#### Meta

```typescript
const status = await client.meta.status()
const provinces = await client.meta.provinces()
const categories = await client.meta.categories()
const usage = await client.meta.usage()
```

### Pagination

List endpoints support cursor-like pagination via `PaginatedAsyncIterator`:

```typescript
const paginator = client.tenders.listPages({
  status: 'OPEN',
  category: 'Construction',
})

for await (const page of paginator.pages()) {
  for (const tender of page) {
    console.log(tender.title)
  }
}
```

The paginator yields arrays of items per page. You can control page size and max pages:

```typescript
const paginator = client.awards.listPages({ ... }, {
  pageSize: 50,     // items per page (default: 100)
  maxPages: 10,     // stop after 10 pages
})
```

### Error Handling

The SDK throws typed errors for every API response status:

```typescript
import {
  TendersaError,
  AuthError,
  NotFoundError,
  RateLimitError,
  BadRequestError,
  ForbiddenError,
  ConflictError,
  InternalError,
  ServiceUnavailableError,
} from '@tendersa/sdk'

try {
  const result = await client.tenders.get('nonexistent')
} catch (err) {
  if (err instanceof AuthError) {
    console.error('Invalid API key. Get one at https://tenders-sa.org/developers/api-keys')
  } else if (err instanceof NotFoundError) {
    console.error('Tender not found')
  } else if (err instanceof RateLimitError) {
    console.error(`Rate limited: ${err.used}/${err.limit}. Resets at ${err.resetsAt}`)
  } else if (err instanceof TendersaError) {
    console.error(`API error [${err.code}]: ${err.message}`)
  }
}
```

Every error exposes:
- `status` — HTTP status code
- `code` — Machine-readable error code
- `message` — Human-readable description
- `requestId` — For tracing with support
- `docs` — Link to error documentation

### Rate Limit Tracking

The client stores the most recent rate limit snapshot:

```typescript
console.log(client.lastRateLimit)
// { limit: 500, remaining: 498, reset: '2026-01-02T00:00:00Z', policy: 'daily' }
```

### Sparse Fields

Pass the `fields` parameter to any list method to reduce payload:

```typescript
const { data } = await client.tenders.list({
  fields: 'tenderId,title,status,closingDate',
})
```

### Retry Configuration

The SDK retries on transient failures with exponential backoff:

```typescript
const client = new TendersaClient({
  apiKey: 'tsa_prod_your_key',
  retry: {
    maxRetries: 5,        // default: 3
    baseDelayMs: 200,     // default: 1000
    maxDelayMs: 10_000,   // default: 30_000
  },
})
```

---

## Resources API Reference

| Resource | Method | Endpoint |
|----------|--------|----------|
| `client.tenders` | `list(params?)` | `GET /v1/tenders` |
| | `get(id)` | `GET /v1/tenders/{id}` |
| | `search(params)` | `GET /v1/tenders/search` |
| | `documents(id)` | `GET /v1/tenders/{id}/documents` |
| | `awards(id)` | `GET /v1/tenders/{id}/awards` |
| | `timeline(id)` | `GET /v1/tenders/{id}/timeline` |
| | `analysis(id)` | `GET /v1/tenders/{id}/analysis` |
| | `valueEstimate(id)` | `GET /v1/tenders/{id}/value-estimate` |
| | `listPages(params?)` | (paginated iterator) |
| `client.awards` | `list(params?)` | `GET /v1/awards` |
| | `get(id)` | `GET /v1/awards/{id}` |
| | `analytics(params?)` | `GET /v1/awards/analytics` |
| | `listPages(params?)` | (paginated iterator) |
| `client.companies` | `get(name)` | `GET /v1/companies/{name}` |
| | `search(params)` | `GET /v1/companies/search` |
| `client.organizations` | `get(id)` | `GET /v1/organizations/{id}` |
| | `tenders(id)` | `GET /v1/organizations/{id}/tenders` |
| `client.meta` | `status()` | `GET /v1/meta/status` |
| | `provinces()` | `GET /v1/meta/provinces` |
| | `categories()` | `GET /v1/meta/categories` |
| | `usage()` | `GET /v1/meta/usage` |

---

## Links

- [Tenders-SA Platform](https://www.tenders-sa.org) — Main website
- [Developer Portal](https://tenders-sa.org/developers) — API keys, docs, and pricing
- [API Documentation](https://tenders-sa.org/developers/docs) — Full API reference
- [API Key Management](https://tenders-sa.org/developers/api-keys) — Create and manage keys
- [Pricing](https://tenders-sa.org/pricing) — Subscription plans
- [GitHub](https://github.com/Tenders-SA/js) — Source code & issues
- [Support](mailto:support@tenders-sa.org) — Email support
- [Developer Contact](mailto:developers@tenders-sa.org) — API & SDK feedback

---

## License

MIT
