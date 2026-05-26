import { BaseResource } from './base-resource.js'
import type { CompanyProfileResponse, CompanySearchResult } from '../types/company.js'
import type { CompanyGetParams, CompanySearchParams } from '../types/company.js'
import type { ApiResponse } from '../types/common.js'

export class CompaniesResource extends BaseResource {
  async get(name: string, params?: CompanyGetParams): Promise<ApiResponse<CompanyProfileResponse>> {
    return this.client.get<CompanyProfileResponse>(`/v1/companies/${encodeURIComponent(name)}`, {
      page: params?.page,
      limit: params?.limit,
    })
  }

  async search(params: CompanySearchParams): Promise<ApiResponse<CompanySearchResult[]>> {
    return this.listResource<CompanySearchResult>('/v1/companies/search', {
      q: params.q,
      enterpriseType: params.enterpriseType,
      beeLevel: params.beeLevel,
      province: params.province,
      category: params.category,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    })
  }
}
