import { BaseResource } from './base-resource.js'
import type { OrganizationProfile, OrganizationTenderSummary } from '../types/organization.js'
import type { OrganizationTendersParams } from '../types/organization.js'
import type { ApiResponse } from '../types/common.js'
import { PaginatedAsyncIterator } from '../pagination.js'

export class OrganizationsResource extends BaseResource {
  async get(id: string): Promise<ApiResponse<OrganizationProfile>> {
    return this.client.get<OrganizationProfile>(`/v1/organizations/${encodeURIComponent(id)}`)
  }

  tendersPaginator(id: string, params?: OrganizationTendersParams): PaginatedAsyncIterator<OrganizationTenderSummary> {
    return this.createPaginator<OrganizationTenderSummary>(`/v1/organizations/${encodeURIComponent(id)}/tenders`, {
      page: params?.page,
      limit: params?.limit,
      status: params?.status,
    })
  }

  async tenders(id: string, params?: OrganizationTendersParams): Promise<ApiResponse<OrganizationTenderSummary[]>> {
    return this.listResource<OrganizationTenderSummary>(`/v1/organizations/${encodeURIComponent(id)}/tenders`, {
      page: params?.page,
      limit: params?.limit,
      status: params?.status,
    })
  }
}
