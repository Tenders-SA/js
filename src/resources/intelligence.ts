import { BaseResource } from './base-resource.js'
import type { IntelSource, IntelItem } from '../types/intelligence.js'
import type { ApiResponse } from '../types/common.js'

export class IntelligenceResource extends BaseResource {
  async listSources(): Promise<ApiResponse<IntelSource[]>> {
    return this.client.get<IntelSource[]>('/v2/intel/sources')
  }

  async getSource(sourceId: string): Promise<ApiResponse<IntelSource>> {
    return this.client.get<IntelSource>(`/v2/intel/sources/${encodeURIComponent(sourceId)}`)
  }

  async listItems(params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<IntelItem[]>> {
    return this.listResource<IntelItem>('/v2/intel/items', { ...params })
  }

  async getItem(itemId: string): Promise<ApiResponse<IntelItem>> {
    return this.client.get<IntelItem>(`/v2/intel/items/${encodeURIComponent(itemId)}`)
  }
}
