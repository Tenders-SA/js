import type { ApiResponse, ApiErrorResponse } from './types/common.js'
import { createErrorFromResponse } from './errors/index.js'
import { withRetry, type RetryConfig, DEFAULT_RETRY_CONFIG } from './retry.js'
import { VERSION } from './version.js'

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

  constructor(config: TendersaClientConfig) {
    if (!config.apiKey) {
      throw new Error('apiKey is required. Get your API key at https://tenders-sa.org/developers/api-keys')
    }

    this.apiKey = config.apiKey
    this.baseUrl = (config.baseUrl || 'https://api.tenders-sa.org').replace(/\/+$/, '')
    this.timeout = config.timeout || 30000
    this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config.retry }
    this.fetchFn = config.fetch || globalThis.fetch
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
