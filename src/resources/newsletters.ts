import { BaseResource } from './base-resource.js'
import type { NewsletterEdition } from '../types/newsletters.js'
import type { ApiResponse } from '../types/common.js'

export class NewslettersResource extends BaseResource {
  async list(params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<NewsletterEdition[]>> {
    return this.listResource<NewsletterEdition>('/v2/newsletters', { ...params })
  }

  async get(editionId: string): Promise<ApiResponse<NewsletterEdition>> {
    return this.client.get<NewsletterEdition>(`/v2/newsletters/${encodeURIComponent(editionId)}`)
  }
}
