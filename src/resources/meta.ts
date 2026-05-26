import { BaseResource } from './base-resource.js'
import type { ApiStatus, ProvinceCount, CategoryCount, UsageStats } from '../types/meta.js'
import type { ApiResponse } from '../types/common.js'

export class MetaResource extends BaseResource {
  async status(): Promise<ApiResponse<ApiStatus>> {
    return this.client.get<ApiStatus>('/v1/meta/status')
  }

  async provinces(): Promise<ApiResponse<ProvinceCount[]>> {
    return this.client.get<ProvinceCount[]>('/v1/meta/provinces')
  }

  async categories(): Promise<ApiResponse<CategoryCount[]>> {
    return this.client.get<CategoryCount[]>('/v1/categories')
  }

  async usage(): Promise<ApiResponse<UsageStats>> {
    return this.client.get<UsageStats>('/v1/meta/usage')
  }
}
