import { BaseResource } from './base-resource.js'
import type { ProvinceInfo, ProvinceHealthScore } from '../types/provinces.js'
import type { ApiResponse } from '../types/common.js'

export class ProvincesResource extends BaseResource {
  async list(): Promise<ApiResponse<ProvinceInfo[]>> {
    return this.client.get<ProvinceInfo[]>('/v2/provinces')
  }

  async get(provinceSlug: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.get<Record<string, unknown>>(`/v2/provinces/${encodeURIComponent(provinceSlug)}`)
  }

  async healthScores(provinceSlug: string): Promise<ApiResponse<ProvinceHealthScore[]>> {
    return this.client.get<ProvinceHealthScore[]>(`/v2/provinces/${encodeURIComponent(provinceSlug)}/health-scores`)
  }
}
