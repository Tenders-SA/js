import type { ApiResponse, ApiErrorResponse } from './types/common.js'
import { createErrorFromResponse } from './errors/index.js'
import { withRetry, type RetryConfig, DEFAULT_RETRY_CONFIG } from './retry.js'
import { VERSION } from './version.js'
import { TendersResource } from './resources/tenders.js'
import { AwardsResource } from './resources/awards.js'
import { CompaniesResource } from './resources/companies.js'
import { OrganizationsResource } from './resources/organizations.js'
import { MetaResource } from './resources/meta.js'
import { CategoriesResource } from './resources/categories.js'
import { ProvincesResource } from './resources/provinces.js'
import { DirectorsResource } from './resources/directors.js'
import { SeoResource } from './resources/seo.js'
import { IndustryResource } from './resources/industry.js'
import { ServicesResource } from './resources/services.js'
import { OcdsResource } from './resources/ocds.js'
import { IntelligenceResource } from './resources/intelligence.js'
import { ForensicResource } from './resources/forensic.js'
import { CipcResource } from './resources/cipc.js'
import { NewslettersResource } from './resources/newsletters.js'
import { DocumentsResource } from './resources/documents.js'

export interface TendersaClientConfig {
  apiKey: string
  baseUrl?: string
  timeout?: number
  retry?: Partial<RetryConfig>
  fetch?: typeof globalThis.fetch
}

export interface RateLimitSnapshot {
  limit: number | null
  remaining: number | null
  reset: string | null
  policy: string | null
}

export class TendersaClient {
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly timeout: number
  private readonly retryConfig: RetryConfig
  private readonly fetchFn: typeof globalThis.fetch
  public lastRateLimit: RateLimitSnapshot = {
    limit: null,
    remaining: null,
    reset: null,
    policy: null,
  }

  readonly tenders: TendersResource
  readonly awards: AwardsResource
  readonly companies: CompaniesResource
  readonly organizations: OrganizationsResource
  readonly meta: MetaResource
  readonly categories: CategoriesResource
  readonly provinces: ProvincesResource
  readonly directors: DirectorsResource
  readonly seo: SeoResource
  readonly industry: IndustryResource
  readonly services: ServicesResource
  readonly ocds: OcdsResource
  readonly intel: IntelligenceResource
  readonly forensic: ForensicResource
  readonly cipc: CipcResource
  readonly newsletters: NewslettersResource
  readonly documents: DocumentsResource

  constructor(config: TendersaClientConfig) {
    if (!config.apiKey) {
      throw new Error('apiKey is required. Get your API key at https://tenders-sa.org/developers/api-keys')
    }

    this.apiKey = config.apiKey
    this.baseUrl = (config.baseUrl || 'https://api.tenders-sa.org').replace(/\/+$/, '')
    this.timeout = config.timeout || 30000
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config.retry }
    this.fetchFn = config.fetch || globalThis.fetch

    this.tenders = new TendersResource(this)
    this.awards = new AwardsResource(this)
    this.companies = new CompaniesResource(this)
    this.organizations = new OrganizationsResource(this)
    this.meta = new MetaResource(this)
    this.categories = new CategoriesResource(this)
    this.provinces = new ProvincesResource(this)
    this.directors = new DirectorsResource(this)
    this.seo = new SeoResource(this)
    this.industry = new IndustryResource(this)
    this.services = new ServicesResource(this)
    this.ocds = new OcdsResource(this)
    this.intel = new IntelligenceResource(this)
    this.forensic = new ForensicResource(this)
    this.cipc = new CipcResource(this)
    this.newsletters = new NewslettersResource(this)
    this.documents = new DocumentsResource(this)
  }

  private parseRateLimitHeaders(headers: Headers): RateLimitSnapshot {
    const limit = headers.get('X-RateLimit-Limit')
    const remaining = headers.get('X-RateLimit-Remaining')
    const reset = headers.get('X-RateLimit-Reset')
    const policy = headers.get('X-RateLimit-Policy')

    return {
      limit: limit ? parseInt(limit, 10) : null,
      remaining: remaining ? parseInt(remaining, 10) : null,
      reset: reset || null,
      policy: policy || null,
    }
  }

  async request<T>(
    method: string,
    path: string,
    query?: Record<string, string | number | boolean | undefined | null>,
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${path}`)

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.set(key, String(value))
        }
      }
    }

    const execute = async (): Promise<ApiResponse<T>> => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      try {
        const response = await this.fetchFn(url.toString(), {
          method,
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'User-Agent': `@tenders-sa-org/sdk-js/${VERSION}`,
            'Accept': 'application/json',
          },
          signal: controller.signal,
        })

        this.lastRateLimit = this.parseRateLimitHeaders(response.headers)

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({
            success: false as const,
            error: response.statusText,
            code: 'UNKNOWN_ERROR',
            requestId: '',
            timestamp: new Date().toISOString(),
          }))

          throw createErrorFromResponse(
            errorBody as ApiErrorResponse,
            response.status,
          )
        }

        const json = await response.json() as ApiResponse<T> | ApiErrorResponse

        if (!json.success) {
          throw createErrorFromResponse(json as ApiErrorResponse, 200)
        }

        return json as ApiResponse<T>
      } finally {
        clearTimeout(timeoutId)
      }
    }

    return withRetry(execute, this.retryConfig)
  }

  async get<T>(
    path: string,
    query?: Record<string, string | number | boolean | undefined | null>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path, query)
  }
}
