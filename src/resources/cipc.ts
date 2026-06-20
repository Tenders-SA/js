import { BaseResource } from './base-resource.js'
import type { CipcEnrichment, CipcDirector } from '../types/cipc.js'
import type { ApiResponse } from '../types/common.js'

export class CipcResource extends BaseResource {
  async listEnrichments(params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<CipcEnrichment[]>> {
    return this.listResource<CipcEnrichment>('/v2/cipc/enrichments', { ...params })
  }

  async getEnrichment(enrichmentId: string): Promise<ApiResponse<CipcEnrichment>> {
    return this.client.get<CipcEnrichment>(`/v2/cipc/enrichments/${encodeURIComponent(enrichmentId)}`)
  }

  async listDirectors(params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<CipcDirector[]>> {
    return this.listResource<CipcDirector>('/v2/cipc/directors', { ...params })
  }

  async getDirector(directorId: string): Promise<ApiResponse<CipcDirector>> {
    return this.client.get<CipcDirector>(`/v2/cipc/directors/${encodeURIComponent(directorId)}`)
  }
}
