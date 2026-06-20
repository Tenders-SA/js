# @tenders-sa-org/sdk-js

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
https://api.tenders-sa.org/v2
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
    "apiVersion": "v2",
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
GET /v2/tenders?fields=tenderId,title,status,closingDate
```

---

## Installation

```bash
npm install @tenders-sa-org/sdk-js
```

### Requirements

- Node.js 18+ (native `fetch`)
- TypeScript 5+ (optional, for type safety)

---

## Quick Start

```typescript
import { TendersaClient } from '@tenders-sa-org/sdk-js'

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
import { TendersaClient } from '@tenders-sa-org/sdk-js'

const client = new TendersaClient({
  apiKey: 'tsa_prod_your_key',

  // Optional:
  baseUrl: 'https://api.tenders-sa.org',   // default
  timeout: 30_000,                          // 30s (default)
  retry: { maxRetries: 3 },                 // exponential backoff
})
```

### Resources

The SDK is organised into **16 resource classes**, each mirroring a section of the v2 API.

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

// v2 new methods
const closingSoon = await client.tenders.closingSoon({ limit: 5 })
const newTenders = await client.tenders.newTenders()
const bbbeeRequired = await client.tenders.bbbeeRequired()
const byProvince = await client.tenders.byProvince('Western Cape')
const byCategory = await client.tenders.byCategory('Construction')
const search = await client.tenders.search({ q: 'road construction' })
const seo = await client.tenders.seo('tender_001')
const slug = await client.tenders.slug('tender_001')
const related = await client.tenders.related('tender_001', { limit: 5 })
const contracts = await client.tenders.contracts('tender_001')
const milestones = await client.tenders.milestones('tender_001')
const bidders = await client.tenders.bidders('tender_001')
const submissionReqs = await client.tenders.submissionRequirements('tender_001')

// Counts
const byProvinceCount = await client.tenders.countsByProvince()
const byCategoryCount = await client.tenders.countsByCategory()
const byOrgCount = await client.tenders.countsByOrganization()
const byStatusCount = await client.tenders.countsByStatus()
```

#### Awards

```typescript
const { data } = await client.awards.list({
  province: 'Western Cape',
  beeLevel: 'Level 1',
  minAmount: 1_000_000,
})

const award = await client.awards.get('award_001')

// v2 new methods
const byTender = await client.awards.byTender('tender_001')
const bySupplier = await client.awards.bySupplier('BuildCorp')
const byDateRange = await client.awards.byDateRange({ awardDateFrom: '2026-01-01' })
const subcontractors = await client.awards.subcontractors('award_001')

// Analytics
const analytics = await client.awards.analytics({ groupBy: 'province' })
const byProv = await client.awards.analyticsByProvince()
const byCat = await client.awards.analyticsByCategory()
const byBee = await client.awards.analyticsByBeeLevel()
const byEnt = await client.awards.analyticsByEnterpriseType()
```

#### Companies

```typescript
const company = await client.companies.get('BuildCorp SA')
// Returns { profile, awards, directors }
console.log(company.data.profile.beeLevel)
console.log(company.data.awards.length)
console.log(company.data.directors)

// v2 new methods
const list = await client.companies.list({ limit: 20 })
const top = await client.companies.top()
const byReg = await client.companies.byRegistration('2020/123456/07')
const companyAwards = await client.companies.awards('BuildCorp')
const contracts = await client.companies.contracts('BuildCorp')
const tenders = await client.companies.tenders('BuildCorp')
const directors = await client.companies.directors('BuildCorp')

const results = await client.companies.search({
  q: 'Construction',
  beeLevel: 'Level 1',
  province: 'Gauteng',
})
```

#### Organisations (Procurement Bodies)

```typescript
const org = await client.organizations.get('org_001')
const orgTenders = await client.organizations.tenders('org_001', { status: 'OPEN' })

// v2 new methods
const orgList = await client.organizations.list()
const orgSearch = await client.organizations.search({ q: 'Treasury' })
const bySlug = await client.organizations.bySlug('national-treasury')
const byReg = await client.organizations.byRegistration('2020/123456/07')
const countsByType = await client.organizations.countsByType()
const orgDirectors = await client.organizations.directors('org_001')
```

#### Categories

```typescript
const categories = await client.categories.list()
const category = await client.categories.get('cat_001')
const bySlug = await client.categories.bySlug('construction')
```

#### Provinces

```typescript
const provinces = await client.provinces.list()
const province = await client.provinces.get('western-cape')
const healthScores = await client.provinces.healthScores('gauteng')
```

#### Directors

```typescript
const directors = await client.directors.list()
const director = await client.directors.get('dir_001')
const search = await client.directors.search({ q: 'John' })
const byOrg = await client.directors.byOrganization('org_001')
```

#### SEO & Content

```typescript
const articles = await client.seo.listArticles()
const article = await client.seo.getArticle('article_001')
const author = await client.seo.getAuthor('author_001')
const seoCategory = await client.seo.category('construction')
const seoProvince = await client.seo.province('gauteng')
```

#### Industry

```typescript
const benchmarks = await client.industry.list()
const benchmark = await client.industry.get('benchmark_001')
```

#### Services

```typescript
const services = await client.services.list()
const service = await client.services.get('pdf-extraction')
```

#### OCDS

```typescript
const parties = await client.ocds.listParties()
const party = await client.ocds.getParty('party_001')
```

#### Intelligence

```typescript
const sources = await client.intel.listSources()
const source = await client.intel.getSource('source_001')
const items = await client.intel.listItems()
const item = await client.intel.getItem('item_001')
```

#### Forensic

```typescript
const suppliers = await client.forensic.listRestrictedSuppliers()
const supplier = await client.forensic.getRestrictedSupplier('sup_001')
const match = await client.forensic.matchRestrictedSupplier({ q: 'BuildCorp' })
const check = await client.forensic.checkRestrictedSupplier({ name: 'BuildCorp' })
```

#### CIPC

```typescript
const enrichments = await client.cipc.listEnrichments()
const enrichment = await client.cipc.getEnrichment('enr_001')
const directors = await client.cipc.listDirectors()
const director = await client.cipc.getDirector('dir_001')
```

#### Newsletters

```typescript
const newsletters = await client.newsletters.list()
const newsletter = await client.newsletters.get('nl_001')
```

#### Documents

```typescript
const document = await client.documents.get('doc_001')
const downloadUrl = await client.documents.downloadUrl('doc_001')
```

#### Meta

```typescript
const status = await client.meta.status()
const provinces = await client.meta.provinces()
const categories = await client.meta.categories()
const usage = await client.meta.usage()
const industries = await client.meta.industries()
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
} from '@tenders-sa-org/sdk-js'

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
| `client.tenders` | `list(params?)` | `GET /v2/tenders` |
| | `listPages(params?)` | (paginated iterator) |
| | `get(id)` | `GET /v2/tenders/{id}` |
| | `search(params)` | `GET /v2/tenders/search` |
| | `closingSoon(params?)` | `GET /v2/tenders/closing-soon` |
| | `newTenders(params?)` | `GET /v2/tenders/new` |
| | `bbbeeRequired(params?)` | `GET /v2/tenders/bbbee-required` |
| | `valueRange(min, max, params?)` | `GET /v2/tenders/value-range` |
| | `byProvince(province, params?)` | `GET /v2/tenders/by-province/{province}` |
| | `byOrganization(orgId, params?)` | `GET /v2/tenders/by-organization/{orgId}` |
| | `byPublicationType(pubType, params?)` | `GET /v2/tenders/by-publication-type/{pubType}` |
| | `byCategory(category, params?)` | `GET /v2/tenders/by-category/{category}` |
| | `countsByProvince()` | `GET /v2/tenders/counts/province` |
| | `countsByCategory()` | `GET /v2/tenders/counts/category` |
| | `countsByOrganization()` | `GET /v2/tenders/counts/organization` |
| | `countsByStatus()` | `GET /v2/tenders/counts/status` |
| | `documents(id)` | `GET /v2/tenders/{id}/documents` |
| | `contracts(id)` | `GET /v2/tenders/{id}/contracts` |
| | `milestones(id)` | `GET /v2/tenders/{id}/milestones` |
| | `bidders(id)` | `GET /v2/tenders/{id}/bidders` |
| | `submissionRequirements(id)` | `GET /v2/tenders/{id}/submission-requirements` |
| | `awards(id)` | `GET /v2/tenders/{id}/awards` |
| | `timeline(id)` | `GET /v2/tenders/{id}/timeline` |
| | `analysis(id)` | `GET /v2/tenders/{id}/analysis` |
| | `valueEstimate(id)` | `GET /v2/tenders/{id}/value-estimate` |
| | `seo(id)` | `GET /v2/tenders/{id}/seo` |
| | `slug(id)` | `GET /v2/tenders/{id}/slug` |
| | `related(id, params?)` | `GET /v2/tenders/{id}/related` |
| `client.awards` | `list(params?)` | `GET /v2/awards` |
| | `listPages(params?)` | (paginated iterator) |
| | `get(id)` | `GET /v2/awards/{id}` |
| | `analytics(params?)` | `GET /v2/awards/analytics` |
| | `analyticsByProvince()` | `GET /v2/awards/analytics/province` |
| | `analyticsByCategory()` | `GET /v2/awards/analytics/category` |
| | `analyticsByBeeLevel()` | `GET /v2/awards/analytics/bee-level` |
| | `analyticsByEnterpriseType()` | `GET /v2/awards/analytics/enterprise-type` |
| | `byTender(tenderId)` | `GET /v2/awards/by-tender/{tenderId}` |
| | `bySupplier(name)` | `GET /v2/awards/by-supplier/{name}` |
| | `bySupplierParty(partyId)` | `GET /v2/awards/by-supplier-party/{partyId}` |
| | `byDateRange(params?)` | `GET /v2/awards/by-date-range` |
| | `subcontractors(awardId)` | `GET /v2/awards/{awardId}/subcontractors` |
| `client.companies` | `list(params?)` | `GET /v2/companies` |
| | `get(name)` | `GET /v2/companies/{name}` |
| | `search(params)` | `GET /v2/companies/search` |
| | `top(params?)` | `GET /v2/companies/top` |
| | `byRegistration(regNumber)` | `GET /v2/companies/by-registration/{regNumber}` |
| | `awards(name)` | `GET /v2/companies/{name}/awards` |
| | `contracts(name)` | `GET /v2/companies/{name}/contracts` |
| | `tenders(name)` | `GET /v2/companies/{name}/tenders` |
| | `directors(name)` | `GET /v2/companies/{name}/directors` |
| `client.organizations` | `list(params?)` | `GET /v2/organizations` |
| | `get(id)` | `GET /v2/organizations/{id}` |
| | `search(params)` | `GET /v2/organizations/search` |
| | `bySlug(slug)` | `GET /v2/organizations/by-slug/{slug}` |
| | `byRegistration(regNumber)` | `GET /v2/organizations/by-registration/{regNumber}` |
| | `countsByType()` | `GET /v2/organizations/counts/type` |
| | `directors(orgId)` | `GET /v2/organizations/{orgId}/directors` |
| | `tenders(id, params?)` | `GET /v2/organizations/{id}/tenders` |
| `client.categories` | `list()` | `GET /v2/categories` |
| | `get(categoryId)` | `GET /v2/categories/{id}` |
| | `bySlug(slug)` | `GET /v2/categories/by-slug/{slug}` |
| `client.provinces` | `list()` | `GET /v2/provinces` |
| | `get(provinceSlug)` | `GET /v2/provinces/{slug}` |
| | `healthScores(provinceSlug)` | `GET /v2/provinces/{slug}/health-scores` |
| `client.directors` | `list(params?)` | `GET /v2/directors` |
| | `get(directorId)` | `GET /v2/directors/{id}` |
| | `search(params)` | `GET /v2/directors/search` |
| | `byOrganization(orgId)` | `GET /v2/directors/by-organization/{orgId}` |
| `client.seo` | `category(slug)` | `GET /v2/seo/category/{slug}` |
| | `province(slug)` | `GET /v2/seo/province/{slug}` |
| | `listArticles(params?)` | `GET /v2/articles` |
| | `getArticle(articleId)` | `GET /v2/articles/{id}` |
| | `getAuthor(authorId)` | `GET /v2/authors/{id}` |
| `client.industry` | `list()` | `GET /v2/industry/benchmarks` |
| | `get(benchmarkId)` | `GET /v2/industry/benchmarks/{id}` |
| `client.services` | `list()` | `GET /v2/services` |
| | `get(serviceSlug)` | `GET /v2/services/{slug}` |
| `client.ocds` | `listParties(params?)` | `GET /v2/ocds/parties` |
| | `getParty(partyId)` | `GET /v2/ocds/parties/{id}` |
| `client.intel` | `listSources()` | `GET /v2/intel/sources` |
| | `getSource(sourceId)` | `GET /v2/intel/sources/{id}` |
| | `listItems(params?)` | `GET /v2/intel/items` |
| | `getItem(itemId)` | `GET /v2/intel/items/{id}` |
| `client.forensic` | `listRestrictedSuppliers(params?)` | `GET /v2/forensic/restricted-suppliers` |
| | `getRestrictedSupplier(supplierId)` | `GET /v2/forensic/restricted-suppliers/{id}` |
| | `matchRestrictedSupplier(params)` | `GET /v2/forensic/restricted-suppliers/match` |
| | `checkRestrictedSupplier(params)` | `GET /v2/forensic/restricted-suppliers/check` |
| `client.cipc` | `listEnrichments(params?)` | `GET /v2/cipc/enrichments` |
| | `getEnrichment(enrichmentId)` | `GET /v2/cipc/enrichments/{id}` |
| | `listDirectors(params?)` | `GET /v2/cipc/directors` |
| | `getDirector(directorId)` | `GET /v2/cipc/directors/{id}` |
| `client.newsletters` | `list(params?)` | `GET /v2/newsletters` |
| | `get(editionId)` | `GET /v2/newsletters/{id}` |
| `client.documents` | `get(documentId)` | `GET /v2/documents/{id}` |
| | `downloadUrl(documentId)` | `GET /v2/documents/{id}/download-url` |
| `client.meta` | `status()` | `GET /v2/meta/status` |
| | `provinces()` | `GET /v2/meta/provinces` |
| | `categories()` | `GET /v2/meta/categories` |
| | `usage()` | `GET /v2/meta/usage` |
| | `industries()` | `GET /v2/meta/industries` |

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
