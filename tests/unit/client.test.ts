import { describe, it, expect, vi } from 'vitest'
import { TendersaClient } from '../../src/client.js'
import { TENDER_LIST_RESPONSE, ERROR_RESPONSES } from '../fixtures/responses.js'

function createMockFetch(response: unknown, status = 200, headers: Record<string, string> = {}) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: new Map(Object.entries(headers)),
    json: () => Promise.resolve(response),
  })
}

describe('TendersaClient', () => {
  const apiKey = 'tsa_prod_test_key'

  it('requires an API key', () => {
    expect(() => new TendersaClient({ apiKey: '' })).toThrow('apiKey is required')
  })

  it('sets default baseUrl', () => {
    const client = new TendersaClient({ apiKey })
    expect(client['baseUrl']).toBe('https://api.tenders-sa.org')
  })

  it('allows custom baseUrl', () => {
    const client = new TendersaClient({ apiKey, baseUrl: 'https://api.staging.tenders-sa.org' })
    expect(client['baseUrl']).toBe('https://api.staging.tenders-sa.org')
  })

  it('strips trailing slashes from baseUrl', () => {
    const client = new TendersaClient({ apiKey, baseUrl: 'https://api.tenders-sa.org/' })
    expect(client['baseUrl']).toBe('https://api.tenders-sa.org')
  })

  it('has all 16 resource properties', () => {
    const client = new TendersaClient({ apiKey })
    expect(client.tenders).toBeDefined()
    expect(client.awards).toBeDefined()
    expect(client.companies).toBeDefined()
    expect(client.organizations).toBeDefined()
    expect(client.meta).toBeDefined()
    expect(client.categories).toBeDefined()
    expect(client.provinces).toBeDefined()
    expect(client.directors).toBeDefined()
    expect(client.seo).toBeDefined()
    expect(client.industry).toBeDefined()
    expect(client.services).toBeDefined()
    expect(client.ocds).toBeDefined()
    expect(client.intel).toBeDefined()
    expect(client.forensic).toBeDefined()
    expect(client.cipc).toBeDefined()
    expect(client.newsletters).toBeDefined()
    expect(client.documents).toBeDefined()
  })

  it('parses successful response', async () => {
    const mockFetch = createMockFetch(TENDER_LIST_RESPONSE)
    const client = new TendersaClient({ apiKey, fetch: mockFetch })

    const response = await client.get('/v2/tenders')

    expect(response.success).toBe(true)
    expect(response.data).toHaveLength(1)
    expect(response.data[0].tenderId).toBe('T012345')
    expect(response.meta.rateLimit?.limit).toBe(500)
  })

  it('sends auth header', async () => {
    const mockFetch = createMockFetch(TENDER_LIST_RESPONSE)
    const client = new TendersaClient({ apiKey, fetch: mockFetch })

    await client.get('/v2/tenders')

    const callUrl = mockFetch.mock.calls[0][0]
    const callHeaders = mockFetch.mock.calls[0][1].headers
    expect(callHeaders['Authorization']).toBe(`Bearer ${apiKey}`)
    expect(callUrl).toContain('/v2/tenders')
  })

  it('appends query parameters', async () => {
    const mockFetch = createMockFetch(TENDER_LIST_RESPONSE)
    const client = new TendersaClient({ apiKey, fetch: mockFetch })

    await client.get('/v2/tenders', { category: 'ict-technology', page: 1, limit: 20 })

    const callUrl = mockFetch.mock.calls[0][0]
    expect(callUrl).toContain('category=ict-technology')
    expect(callUrl).toContain('page=1')
    expect(callUrl).toContain('limit=20')
  })

  it('skips null/undefined query params', async () => {
    const mockFetch = createMockFetch(TENDER_LIST_RESPONSE)
    const client = new TendersaClient({ apiKey, fetch: mockFetch })

    await client.get('/v2/tenders', { category: undefined, province: null as unknown as undefined, page: 1 })

    const callUrl = mockFetch.mock.calls[0][0]
    expect(callUrl).not.toContain('category')
    expect(callUrl).not.toContain('province')
    expect(callUrl).toContain('page=1')
  })

  it('parses rate limit headers', async () => {
    const mockFetch = createMockFetch(TENDER_LIST_RESPONSE, 200, {
      'X-RateLimit-Limit': '500',
      'X-RateLimit-Remaining': '498',
      'X-RateLimit-Reset': '2026-05-26T00:00:00Z',
      'X-RateLimit-Policy': 'daily',
    })
    const client = new TendersaClient({ apiKey, fetch: mockFetch })

    await client.get('/v2/tenders')

    expect(client.lastRateLimit.limit).toBe(500)
    expect(client.lastRateLimit.remaining).toBe(498)
    expect(client.lastRateLimit.reset).toBe('2026-05-26T00:00:00Z')
    expect(client.lastRateLimit.policy).toBe('daily')
  })

  it('throws BadRequestError for 400', async () => {
    const mockFetch = createMockFetch(ERROR_RESPONSES[400], 400)
    const client = new TendersaClient({ apiKey, fetch: mockFetch })

    await expect(client.get('/v2/tenders', { page: 9999 })).rejects.toThrow('Page exceeds')
  })

  it('throws AuthError for 401', async () => {
    const mockFetch = createMockFetch(ERROR_RESPONSES[401], 401)
    const client = new TendersaClient({ apiKey, fetch: mockFetch })

    await expect(client.get('/v2/tenders')).rejects.toThrow('Missing Authorization header')
  })

  it('throws NotFoundError for 404', async () => {
    const mockFetch = createMockFetch(ERROR_RESPONSES[404], 404)
    const client = new TendersaClient({ apiKey, fetch: mockFetch })

    await expect(client.get('/v2/tenders/invalid')).rejects.toThrow('Tender not found')
  })

  it('throws RateLimitError for 429', async () => {
    const mockFetch = createMockFetch(ERROR_RESPONSES[429], 429)
    const client = new TendersaClient({ apiKey, fetch: mockFetch })

    try {
      await client.get('/v2/tenders')
      expect.unreachable()
    } catch (error) {
      const e = error as { name: string; status: number; limit: number; used: number; resetsAt: string; tier: string }
      expect(e.name).toBe('RateLimitError')
      expect(e.status).toBe(429)
      expect(e.limit).toBe(500)
      expect(e.used).toBe(500)
    }
  })

  it('throws InternalError for 500', async () => {
    const mockFetch = createMockFetch(ERROR_RESPONSES[500], 500)
    const client = new TendersaClient({ apiKey, fetch: mockFetch })

    await expect(client.get('/v2/tenders')).rejects.toThrow('Internal server error')
  })

  it('throws on missing API key', () => {
    expect(() => new TendersaClient({ apiKey: '' })).toThrow('apiKey is required')
  })
})
