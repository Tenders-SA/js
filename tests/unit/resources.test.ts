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
import { CategoriesResource } from '../../src/resources/categories.js'
import { ProvincesResource } from '../../src/resources/provinces.js'
import { DirectorsResource } from '../../src/resources/directors.js'
import { SeoResource } from '../../src/resources/seo.js'
import { IndustryResource } from '../../src/resources/industry.js'
import { ServicesResource } from '../../src/resources/services.js'
import { OcdsResource } from '../../src/resources/ocds.js'
import { IntelligenceResource } from '../../src/resources/intelligence.js'
import { ForensicResource } from '../../src/resources/forensic.js'
import { CipcResource } from '../../src/resources/cipc.js'
import { NewslettersResource } from '../../src/resources/newsletters.js'
import { DocumentsResource } from '../../src/resources/documents.js'

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

    it('closingSoon', async () => {
      const client = createClient(TENDER_LIST_RESPONSE)
      const tenders = new TendersResource(client)
      const result = await tenders.closingSoon({ limit: 5 })
      expect(result.success).toBe(true)
    })

    it('byProvince', async () => {
      const client = createClient(TENDER_LIST_RESPONSE)
      const tenders = new TendersResource(client)
      const result = await tenders.byProvince('Gauteng')
      expect(result.success).toBe(true)
    })

    it('countsByProvince', async () => {
      const resp = { success: true, data: [{ name: 'Gauteng', count: 50 }], meta: { requestId: 'r1', timestamp: 't', apiVersion: 'v2' } }
      const client = createClient(resp)
      const tenders = new TendersResource(client)
      const result = await tenders.countsByProvince()
      expect(result.data[0].name).toBe('Gauteng')
    })
  })

  describe('AwardsResource', () => {
    it('lists awards', async () => {
      const awardsResponse = {
        success: true,
        data: [{ awardId: 'AW001', tenderId: 'T012345', amount: 9500000, currency: 'ZAR', supplierName: 'TechSol' }],
        meta: { requestId: 'req_aw', timestamp: '', apiVersion: 'v2', page: 1, pageSize: 20, totalCount: 1 },
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
        meta: { requestId: 'req_aw', timestamp: '', apiVersion: 'v2' },
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
      expect(result.data.directors).toBeDefined()
    })

    it('searches companies', async () => {
      const searchResponse = {
        success: true,
        data: [{ name: 'TechSol SA', enterpriseType: 'QSE', beeLevel: 'Level 2', totalAwards: 42, totalValue: 95000000 }],
        meta: { requestId: 'req_cs', timestamp: '', apiVersion: 'v2', page: 1, pageSize: 20, totalCount: 1 },
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
        meta: { requestId: 'req_org', timestamp: '', apiVersion: 'v2' },
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
        meta: { requestId: 'req_pr', timestamp: '', apiVersion: 'v2' },
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
        meta: { requestId: 'req_us', timestamp: '', apiVersion: 'v2', rateLimit: { limit: 500, remaining: 493, reset: '', policy: 'daily' } },
      }
      const client = createClient(usageResponse)
      const meta = new MetaResource(client)
      const result = await meta.usage()
      expect(result.data.daily).toBe(7)
      expect(result.data.limit.daily).toBe(500)
    })

    it('gets industries', async () => {
      const industriesResponse = {
        success: true,
        data: [{ id: 'ind_1', industryName: 'Construction', sampleSize: 100, medianValue: 500000 }],
        meta: { requestId: 'req_in', timestamp: '', apiVersion: 'v2' },
      }
      const client = createClient(industriesResponse)
      const meta = new MetaResource(client)
      const result = await meta.industries()
      expect(result.data).toHaveLength(1)
      expect(result.data[0].industryName).toBe('Construction')
    })
  })

  describe('New Resources', () => {
    describe('CategoriesResource', () => {
      it('lists categories', async () => {
        const resp = { success: true, data: [{ slug: 'construction', name: 'Construction', tenderCount: 50 }], meta: { requestId: 'r1', timestamp: 't', apiVersion: 'v2' } }
        const client = createClient(resp)
        const categories = new CategoriesResource(client)
        const result = await categories.list()
        expect(result.data[0].slug).toBe('construction')
      })

      it('gets by slug', async () => {
        const resp = { success: true, data: { slug: 'construction', name: 'Construction' }, meta: { requestId: 'r1', timestamp: 't', apiVersion: 'v2' } }
        const client = createClient(resp)
        const categories = new CategoriesResource(client)
        const result = await categories.bySlug('construction')
        expect(result.success).toBe(true)
      })
    })

    describe('ProvincesResource', () => {
      it('lists provinces', async () => {
        const resp = { success: true, data: [{ name: 'Western Cape', tenderCount: 100 }], meta: { requestId: 'r1', timestamp: 't', apiVersion: 'v2' } }
        const client = createClient(resp)
        const provinces = new ProvincesResource(client)
        const result = await provinces.list()
        expect(result.data[0].name).toBe('Western Cape')
      })

      it('gets health scores', async () => {
        const resp = { success: true, data: [{ province: 'GP', score: 0.92, year: 2026 }], meta: { requestId: 'r1', timestamp: 't', apiVersion: 'v2' } }
        const client = createClient(resp)
        const provinces = new ProvincesResource(client)
        const result = await provinces.healthScores('Gauteng')
        expect(result.data[0].province).toBe('GP')
      })
    })

    describe('DirectorsResource', () => {
      it('lists directors', async () => {
        const resp = { success: true, data: [{ directorId: 'd1', fullName: 'John Doe', organizationId: 'org_1' }], meta: { requestId: 'r1', timestamp: 't', apiVersion: 'v2' } }
        const client = createClient(resp)
        const directors = new DirectorsResource(client)
        const result = await directors.list()
        expect(result.data[0].directorId).toBe('d1')
      })
    })

    describe('SeoResource', () => {
      it('lists articles', async () => {
        const resp = { success: true, data: [], meta: { requestId: 'r1', timestamp: 't', apiVersion: 'v2' } }
        const client = createClient(resp)
        const seo = new SeoResource(client)
        const result = await seo.listArticles()
        expect(result.success).toBe(true)
      })
    })

    describe('IndustryResource', () => {
      it('lists benchmarks', async () => {
        const resp = { success: true, data: [{ id: 'b1', industryName: 'Construction', sampleSize: 100 }], meta: { requestId: 'r1', timestamp: 't', apiVersion: 'v2' } }
        const client = createClient(resp)
        const industry = new IndustryResource(client)
        const result = await industry.list()
        expect(result.data[0].industryName).toBe('Construction')
      })
    })

    describe('ServicesResource', () => {
      it('lists services', async () => {
        const resp = { success: true, data: [{ id: 's1', name: 'PDF Extraction', slug: 'pdf-extraction' }], meta: { requestId: 'r1', timestamp: 't', apiVersion: 'v2' } }
        const client = createClient(resp)
        const services = new ServicesResource(client)
        const result = await services.list()
        expect(result.data[0].name).toBe('PDF Extraction')
      })
    })

    describe('OcdsResource', () => {
      it('lists parties', async () => {
        const resp = { success: true, data: [{ id: 'p1', name: 'Acme Corp', role: 'buyer' }], meta: { requestId: 'r1', timestamp: 't', apiVersion: 'v2' } }
        const client = createClient(resp)
        const ocds = new OcdsResource(client)
        const result = await ocds.listParties()
        expect(result.data[0].name).toBe('Acme Corp')
      })
    })

    describe('IntelligenceResource', () => {
      it('lists sources', async () => {
        const resp = { success: true, data: [{ id: 'src_1', name: 'Gov Gazette' }], meta: { requestId: 'r1', timestamp: 't', apiVersion: 'v2' } }
        const client = createClient(resp)
        const intel = new IntelligenceResource(client)
        const result = await intel.listSources()
        expect(result.data[0].name).toBe('Gov Gazette')
      })
    })

    describe('ForensicResource', () => {
      it('lists restricted suppliers', async () => {
        const resp = { success: true, data: [{ id: 'fr_1', supplierName: 'SuspiciousCo', restrictionType: 'Misrepresentation' }], meta: { requestId: 'r1', timestamp: 't', apiVersion: 'v2' } }
        const client = createClient(resp)
        const forensic = new ForensicResource(client)
        const result = await forensic.listRestrictedSuppliers()
        expect(result.data[0].supplierName).toBe('SuspiciousCo')
      })
    })

    describe('CipcResource', () => {
      it('gets enrichment', async () => {
        const resp = { success: true, data: { id: 'enr_1', name: 'BuildCorp', registrationNumber: '2020/123456/07' }, meta: { requestId: 'r1', timestamp: 't', apiVersion: 'v2' } }
        const client = createClient(resp)
        const cipc = new CipcResource(client)
        const result = await cipc.getEnrichment('enr_1')
        expect(result.data.name).toBe('BuildCorp')
      })
    })

    describe('NewslettersResource', () => {
      it('lists newsletters', async () => {
        const resp = { success: true, data: [{ id: 'nl_1', title: 'June 2026', editionNumber: 6, publishedAt: '2026-06-01' }], meta: { requestId: 'r1', timestamp: 't', apiVersion: 'v2' } }
        const client = createClient(resp)
        const newsletters = new NewslettersResource(client)
        const result = await newsletters.list()
        expect(result.data[0].id).toBe('nl_1')
      })
    })

    describe('DocumentsResource', () => {
      it('gets document', async () => {
        const resp = { success: true, data: { id: 'd1', fileName: 'spec.pdf' }, meta: { requestId: 'r1', timestamp: 't', apiVersion: 'v2' } }
        const client = createClient(resp)
        const documents = new DocumentsResource(client)
        const result = await documents.get('d1')
        expect(result.data.id).toBe('d1')
      })

      it('gets download url', async () => {
        const resp = { success: true, data: { id: 'd1', downloadUrl: 'https://docs.tenders-sa.org/t1/spec.pdf' }, meta: { requestId: 'r1', timestamp: 't', apiVersion: 'v2' } }
        const client = createClient(resp)
        const documents = new DocumentsResource(client)
        const result = await documents.downloadUrl('d1')
        expect(result.data.downloadUrl).toBe('https://docs.tenders-sa.org/t1/spec.pdf')
      })
    })
  })
})
