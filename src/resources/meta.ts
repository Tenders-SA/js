import { BaseResource } from './base-resource.js'
import type { ApiStatus, ProvinceCount, CategoryCount, UsageStats, IndustryBenchmarkSummary } from '../types/meta.js'
import type { ApiResponse } from '../types/common.js'

export class MetaResource extends BaseResource {
  async status(): Promise<ApiResponse<ApiStatus>> {
    return this.client.get<ApiStatus>('/v2/meta/status')
  }

  async provinces(): Promise<ApiResponse<ProvinceCount[]>> {
    return this.client.get<ProvinceCount[]>('/v2/meta/provinces')
  }

  async categories(): Promise<ApiResponse<CategoryCount[]>> {
    return this.client.get<CategoryCount[]>('/v2/categories')
  }

  async usage(): Promise<ApiResponse<UsageStats>> {
    return this.client.get<UsageStats>('/v2/meta/usage')
  }

  async industries(params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<IndustryBenchmarkSummary[]>> {
    return this.client.get<IndustryBenchmarkSummary[]>('/v2/meta/industries', { ...params })
  }
}
