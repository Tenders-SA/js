import { describe, it, expect, vi } from 'vitest'
import { TendersaClient } from '../../src/client.js'
import { TendersResource } from '../../src/resources/tenders.js'
import { AwardsResource } from '../../src/resources/awards.js'
import { CompaniesResource } from '../../src/resources/companies.js'
import { OrganizationsResource } from '../../src/resources/organizations.js'
import { MetaResource } from '../../src/resources/meta.js'
import {
  TENDER_LIST_RESPONSE,
  COMPANY_RESPONSE,
  META_STATUS_RESPONSE,
  CATEGORY_RESPONSE,
} from '../fixtures/responses.js'

function createMockFetch(response: unknown, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: new Map(),
    json: () => Promise.resolve(response),
  })
}

describe('Resources', () => {
  const apiKey = 'tsa_prod_test_key'

  const createClient = (response: unknown, status = 200) =>
    new TendersaClient({ apiKey, fetch: createMockFetch(response, status) })

  describe('TendersResource', () => {
    it('lists tenders', async () => {
      const client = createClient(TENDER_LIST_RESPONSE)
      const tenders = new TendersResource(client)
      const result = await tenders.list({ category: 'ict-technology', limit: 10 })
      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(1)
      expect(result.data[0].tenderId).toBe('T012345')
    })

    it('gets tender detail', async () => {
      const detail = { ...TENDER_LIST_RESPONSE, data: { ...TENDER_LIST_RESPONSE.data[0], awards: [] } }
      const client = createClient({ ...detail, data: detail.data })
      const tenders = new TendersResource(client)
      const result = await tenders.get('T012345')
      expect(result.success).toBe(true)
      expect(result.data.tenderId).toBe('T012345')
    })

    it('searches tenders', async () => {
      const client = createClient(TENDER_LIST_RESPONSE)
      const tenders = new TendersResource(client)
      const result = await tenders.search({ q: 'ict', limit: 5 })
      expect(result.success).toBe(true)
    })

    it('provides paginator', () => {
      const client = createClient(TENDER_LIST_RESPONSE)
      const tenders = new TendersResource(client)
      const paginator = tenders.listPages({ category: 'ict' })
      expect(paginator).toBeDefined()
    })
  })

  describe('AwardsResource', () => {
    it('lists awards', async () => {
      const awardsResponse = {
        success: true,
        data: [{ awardId: 'AW001', tenderId: 'T012345', amount: 9500000, currency: 'ZAR', supplierName: 'TechSol' }],
        meta: { requestId: 'req_aw', timestamp: '', apiVersion: 'v1', page: 1, pageSize: 20, totalCount: 1 },
      }
      const client = createClient(awardsResponse)
      const awards = new AwardsResource(client)
      const result = await awards.list({ enterpriseType: 'QSE' })
      expect(result.success).toBe(true)
      expect(result.data[0].awardId).toBe('AW001')
    })

    it('gets award detail', async () => {
      const awardResponse = {
        success: true,
        data: { awardId: 'AW001', amount: 9500000, currency: 'ZAR', supplierName: 'TechSol' },
        meta: { requestId: 'req_aw', timestamp: '', apiVersion: 'v1' },
      }
      const client = createClient(awardResponse)
      const awards = new AwardsResource(client)
      const result = await awards.get('AW001')
      expect(result.data.awardId).toBe('AW001')
    })
  })

  describe('CompaniesResource', () => {
    it('gets company profile', async () => {
      const client = createClient(COMPANY_RESPONSE)
      const companies = new CompaniesResource(client)
      const result = await companies.get('TechSol SA (Pty) Ltd')
      expect(result.data.profile.beeLevel).toBe('Level 2')
      expect(result.data.profile.totalAwards).toBe(42)
      expect(result.data.awards).toHaveLength(1)
    })

    it('searches companies', async () => {
      const searchResponse = {
        success: true,
        data: [{ name: 'TechSol SA', enterpriseType: 'QSE', beeLevel: 'Level 2', totalAwards: 42, totalValue: 95000000 }],
        meta: { requestId: 'req_cs', timestamp: '', apiVersion: 'v1', page: 1, pageSize: 20, totalCount: 1 },
      }
      const client = createClient(searchResponse)
      const companies = new CompaniesResource(client)
      const result = await companies.search({ q: 'TechSol', beeLevel: 'Level 1' })
      expect(result.data[0].name).toBe('TechSol SA')
    })
  })

  describe('OrganizationsResource', () => {
    it('gets organization profile', async () => {
      const orgResponse = {
        success: true,
        data: {
          id: 'org_national_treasury',
          name: 'National Treasury',
          organizationType: 'government_department',
          stats: { totalTenders: 234, totalAwardValue: 12500000000, tenderCategories: ['Financial Services'] },
        },
        meta: { requestId: 'req_org', timestamp: '', apiVersion: 'v1' },
      }
      const client = createClient(orgResponse)
      const orgs = new OrganizationsResource(client)
      const result = await orgs.get('national-treasury')
      expect(result.data.organizationType).toBe('government_department')
    })
  })

  describe('MetaResource', () => {
    it('gets API status', async () => {
      const client = createClient(META_STATUS_RESPONSE)
      const meta = new MetaResource(client)
      const result = await meta.status()
      expect(result.data.healthy).toBe(true)
    })

    it('lists categories', async () => {
      const client = createClient(CATEGORY_RESPONSE)
      const meta = new MetaResource(client)
      const result = await meta.categories()
      expect(result.data).toHaveLength(2)
    })

    it('lists provinces', async () => {
      const provinceResponse = {
        success: true,
        data: [{ name: 'Gauteng', tenderCount: 3456 }, { name: 'Western Cape', tenderCount: 2134 }],
        meta: { requestId: 'req_pr', timestamp: '', apiVersion: 'v1' },
      }
      const client = createClient(provinceResponse)
      const meta = new MetaResource(client)
      const result = await meta.provinces()
      expect(result.data[0].name).toBe('Gauteng')
    })

    it('gets usage stats', async () => {
      const usageResponse = {
        success: true,
        data: { daily: 7, monthly: 234, limit: { daily: 500, monthly: 15000 } },
        meta: { requestId: 'req_us', timestamp: '', apiVersion: 'v1', rateLimit: { limit: 500, remaining: 493, reset: '', policy: 'daily' } },
      }
      const client = createClient(usageResponse)
      const meta = new MetaResource(client)
      const result = await meta.usage()
      expect(result.data.daily).toBe(7)
      expect(result.data.limit.daily).toBe(500)
    })
  })
})
