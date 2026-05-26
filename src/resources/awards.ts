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
    return this.listResource<Award>('/v1/awards', {
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
    return this.createPaginator<Award>('/v1/awards', { ...params })
  }

  async get(id: string): Promise<ApiResponse<Award>> {
    return this.client.get<Award>(`/v1/awards/${encodeURIComponent(id)}`)
  }

  async analytics(params?: AwardAnalyticsParams): Promise<ApiResponse<AwardAnalyticsGroup[]>> {
    return this.client.get<AwardAnalyticsGroup[]>('/v1/awards/analytics', {
      groupBy: params?.groupBy,
      from: params?.from,
      to: params?.to,
    })
  }
}
