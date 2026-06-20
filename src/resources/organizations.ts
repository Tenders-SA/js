import { BaseResource } from './base-resource.js'
import type { OrganizationProfile, OrganizationTenderSummary } from '../types/organization.js'
import type { OrganizationTendersParams } from '../types/organization.js'
import type { ApiResponse } from '../types/common.js'
import { PaginatedAsyncIterator } from '../pagination.js'

export class OrganizationsResource extends BaseResource {
  async list(params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<OrganizationProfile[]>> {
    return this.listResource<OrganizationProfile>('/v2/organizations', { ...params })
  }

  async get(id: string): Promise<ApiResponse<OrganizationProfile>> {
    return this.client.get<OrganizationProfile>(`/v2/organizations/${encodeURIComponent(id)}`)
  }

  async search(params: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<OrganizationProfile[]>> {
    return this.listResource<OrganizationProfile>('/v2/organizations/search', { ...params })
  }

  async bySlug(slug: string): Promise<ApiResponse<OrganizationProfile>> {
    return this.client.get<OrganizationProfile>(`/v2/organizations/by-slug/${encodeURIComponent(slug)}`)
  }

  async byRegistration(regNumber: string): Promise<ApiResponse<OrganizationProfile>> {
    return this.client.get<OrganizationProfile>(`/v2/organizations/by-registration/${encodeURIComponent(regNumber)}`)
  }

  async countsByType(): Promise<ApiResponse<Record<string, unknown>[]>> {
    return this.client.get<Record<string, unknown>[]>('/v2/organizations/counts/type')
  }

  async directors(orgId: string): Promise<ApiResponse<Record<string, unknown>[]>> {
    return this.client.get<Record<string, unknown>[]>(`/v2/organizations/${encodeURIComponent(orgId)}/directors`)
  }

  tendersPaginator(id: string, params?: OrganizationTendersParams): PaginatedAsyncIterator<OrganizationTenderSummary> {
    return this.createPaginator<OrganizationTenderSummary>(`/v2/organizations/${encodeURIComponent(id)}/tenders`, {
      page: params?.page,
      limit: params?.limit,
      status: params?.status,
    })
  }

  async tenders(id: string, params?: OrganizationTendersParams): Promise<ApiResponse<OrganizationTenderSummary[]>> {
    return this.listResource<OrganizationTenderSummary>(`/v2/organizations/${encodeURIComponent(id)}/tenders`, {
      page: params?.page,
      limit: params?.limit,
      status: params?.status,
    })
  }
}
