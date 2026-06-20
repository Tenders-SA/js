import { BaseResource } from './base-resource.js'
import type { Award, AwardListParams, AwardAnalyticsParams } from '../types/tender.js'
import type { ApiResponse } from '../types/common.js'
import { PaginatedAsyncIterator } from '../pagination.js'

export interface AwardAnalyticsGroup {
  enterpriseType?: string
  beeLevel?: string
  province?: string
  category?: string
  period?: string
  totalAwards: number
  totalValue: number
  avgValue: number
}

export class AwardsResource extends BaseResource {
  async list(params?: AwardListParams): Promise<ApiResponse<Award[]>> {
    return this.listResource<Award>('/v2/awards', {
      page: params?.page,
      limit: params?.limit,
      supplierName: params?.supplierName,
      supplierId: params?.supplierId,
      tenderId: params?.tenderId,
      category: params?.category,
      province: params?.province,
      enterpriseType: params?.enterpriseType,
      beeLevel: params?.beeLevel,
      minAmount: params?.minAmount,
      maxAmount: params?.maxAmount,
      awardDateFrom: params?.awardDateFrom,
      awardDateTo: params?.awardDateTo,
      status: params?.status,
      sort: params?.sort,
      fields: params?.fields,
    })
  }

  listPages(params?: AwardListParams): PaginatedAsyncIterator<Award> {
    return this.createPaginator<Award>('/v2/awards', { ...params })
  }

  async get(id: string): Promise<ApiResponse<Award>> {
    return this.client.get<Award>(`/v2/awards/${encodeURIComponent(id)}`)
  }

  async analytics(params?: AwardAnalyticsParams): Promise<ApiResponse<AwardAnalyticsGroup[]>> {
    return this.client.get<AwardAnalyticsGroup[]>('/v2/awards/analytics', {
      groupBy: params?.groupBy,
      from: params?.from,
      to: params?.to,
    })
  }

  async analyticsByProvince(params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<Record<string, unknown>[]>> {
    return this.client.get<Record<string, unknown>[]>('/v2/awards/analytics/province', { ...params })
  }

  async analyticsByCategory(params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<Record<string, unknown>[]>> {
    return this.client.get<Record<string, unknown>[]>('/v2/awards/analytics/category', { ...params })
  }

  async analyticsByBeeLevel(params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<Record<string, unknown>[]>> {
    return this.client.get<Record<string, unknown>[]>('/v2/awards/analytics/bee-level', { ...params })
  }

  async analyticsByEnterpriseType(params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<Record<string, unknown>[]>> {
    return this.client.get<Record<string, unknown>[]>('/v2/awards/analytics/enterprise-type', { ...params })
  }

  async byTender(tenderId: string, params?: AwardListParams): Promise<ApiResponse<Award[]>> {
    return this.listResource<Award>(`/v2/awards/by-tender/${encodeURIComponent(tenderId)}`, { ...params })
  }

  async bySupplier(name: string, params?: AwardListParams): Promise<ApiResponse<Award[]>> {
    return this.listResource<Award>(`/v2/awards/by-supplier/${encodeURIComponent(name)}`, { ...params })
  }

  async bySupplierParty(partyId: string, params?: AwardListParams): Promise<ApiResponse<Award[]>> {
    return this.listResource<Award>(`/v2/awards/by-supplier-party/${encodeURIComponent(partyId)}`, { ...params })
  }

  async byDateRange(params?: AwardListParams): Promise<ApiResponse<Award[]>> {
    return this.listResource<Award>('/v2/awards/by-date-range', { ...params })
  }

  async subcontractors(awardId: string, params?: AwardListParams): Promise<ApiResponse<Record<string, unknown>[]>> {
    return this.listResource<Record<string, unknown>>(`/v2/awards/${encodeURIComponent(awardId)}/subcontractors`, { ...params })
  }
}
