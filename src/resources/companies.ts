import { BaseResource } from './base-resource.js'
import type { CompanyProfile, CompanyProfileResponse, CompanySearchResult } from '../types/company.js'
import type { CompanyGetParams, CompanySearchParams } from '../types/company.js'
import type { Award } from '../types/tender.js'
import type { ApiResponse } from '../types/common.js'

export class CompaniesResource extends BaseResource {
  async list(params?: CompanyGetParams): Promise<ApiResponse<CompanyProfile[]>> {
    return this.listResource<CompanyProfile>('/v2/companies', { ...params })
  }

  async get(name: string, params?: CompanyGetParams): Promise<ApiResponse<CompanyProfileResponse>> {
    return this.client.get<CompanyProfileResponse>(`/v2/companies/${encodeURIComponent(name)}`, {
      page: params?.page,
      limit: params?.limit,
    })
  }

  async search(params: CompanySearchParams): Promise<ApiResponse<CompanySearchResult[]>> {
    return this.listResource<CompanySearchResult>('/v2/companies/search', {
      q: params.q,
      enterpriseType: params.enterpriseType,
      beeLevel: params.beeLevel,
      province: params.province,
      category: params.category,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    })
  }

  async top(params?: CompanyGetParams): Promise<ApiResponse<CompanyProfile[]>> {
    return this.listResource<CompanyProfile>('/v2/companies/top', { ...params })
  }

  async byRegistration(regNumber: string): Promise<ApiResponse<CompanyProfileResponse>> {
    return this.client.get<CompanyProfileResponse>(`/v2/companies/by-registration/${encodeURIComponent(regNumber)}`)
  }

  async awards(name: string, params?: CompanyGetParams): Promise<ApiResponse<Award[]>> {
    return this.listResource<Award>(`/v2/companies/${encodeURIComponent(name)}/awards`, { ...params })
  }

  async contracts(name: string, params?: CompanyGetParams): Promise<ApiResponse<Record<string, unknown>[]>> {
    return this.listResource<Record<string, unknown>>(`/v2/companies/${encodeURIComponent(name)}/contracts`, { ...params })
  }

  async tenders(name: string, params?: CompanyGetParams): Promise<ApiResponse<Record<string, unknown>[]>> {
    return this.listResource<Record<string, unknown>>(`/v2/companies/${encodeURIComponent(name)}/tenders`, { ...params })
  }

  async directors(name: string): Promise<ApiResponse<Record<string, unknown>[]>> {
    return this.client.get<Record<string, unknown>[]>(`/v2/companies/${encodeURIComponent(name)}/directors`)
  }
}
