# @tendersa/sdk

Official TypeScript/JavaScript SDK for the [Tenders-SA Developer API](https://tenders-sa.org/developers) — enriched South African public procurement data.

## Installation

```bash
npm install @tendersa/sdk
```

## Quick Start

```typescript
import { TendersaClient, TendersResource } from '@tendersa/sdk'

const client = new TendersaClient({ apiKey: 'tsa_prod_your_key' })
const tenders = new TendersResource(client)

// List open tenders
const result = await tenders.list({ status: 'OPEN', province: 'Western Cape' })
console.log(result.data)

// Get tender detail
const detail = await tenders.get('tender_001')
console.log(detail.data)

// Search
const search = await tenders.search({ q: 'road construction' })
console.log(search.data)

// Pagination
const paginator = tenders.listPages({ status: 'OPEN' })
for await (const page of paginator.pages()) {
  for (const tender of page.data) {
    console.log(tender.title)
  }
}
```

## API

### Resources

| Resource | Methods |
|----------|---------|
| `TendersResource` | `list`, `get`, `search`, `documents`, `awards`, `timeline`, `analysis`, `valueEstimate`, `listPages` |
| `AwardsResource` | `list`, `get`, `analytics`, `listPages` |
| `CompaniesResource` | `get`, `search` |
| `OrganizationsResource` | `get`, `tenders` |
| `MetaResource` | `status`, `provinces`, `categories`, `usage` |

### Error Handling

```typescript
import { AuthError, NotFoundError, RateLimitError } from '@tendersa/sdk'

try {
  const result = await tenders.get('nonexistent')
} catch (err) {
  if (err instanceof AuthError) console.error('Check your API key')
  if (err instanceof NotFoundError) console.error('Tender not found')
  if (err instanceof RateLimitError) console.error('Rate limit hit')
}
```

## Requirements

- Node.js 18+ (native `fetch`)
- TypeScript 5+ (optional, for type safety)

## License

MIT
