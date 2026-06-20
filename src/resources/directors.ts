import { BaseResource } from './base-resource.js'
import type { SourceDirector } from '../types/directors.js'
import type { ApiResponse } from '../types/common.js'

export class DirectorsResource extends BaseResource {
  async list(params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<SourceDirector[]>> {
    return this.listResource<SourceDirector>('/v2/directors', { ...params })
  }

  async get(directorId: string): Promise<ApiResponse<SourceDirector>> {
    return this.client.get<SourceDirector>(`/v2/directors/${encodeURIComponent(directorId)}`)
  }

  async search(params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<SourceDirector[]>> {
    return this.listResource<SourceDirector>('/v2/directors/search', { ...params })
  }

  async byOrganization(orgId: string, params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<SourceDirector[]>> {
    return this.listResource<SourceDirector>(`/v2/directors/by-organization/${encodeURIComponent(orgId)}`, { ...params })
  }
}
