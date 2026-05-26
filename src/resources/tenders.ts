import { BaseResource } from './base-resource.js'
import type { Tender, TenderDetail, TenderDocument, TimelineEvent, Award } from '../types/tender.js'
import type { TenderListParams, TenderSearchParams } from '../types/tender.js'
import type { TenderAnalysis, ValueEstimate } from '../types/analysis.js'
import type { ApiResponse } from '../types/common.js'
import { PaginatedAsyncIterator } from '../pagination.js'

export class TendersResource extends BaseResource {
  async list(params?: TenderListParams): Promise<ApiResponse<Tender[]>> {
    return this.listResource<Tender>('/v1/tenders', {
      page: params?.page,
      limit: params?.limit,
      category: params?.category,
      province: params?.province,
      status: params?.status,
      q: params?.q,
      closingAfter: params?.closingAfter,
      closingBefore: params?.closingBefore,
      minValue: params?.minValue,
      maxValue: params?.maxValue,
      referenceNumber: params?.referenceNumber,
      sourceOrganization: params?.sourceOrganization,
      sort: params?.sort,
      fields: params?.fields,
    })
  }

  listPages(params?: TenderListParams): PaginatedAsyncIterator<Tender> {
    return this.createPaginator<Tender>('/v1/tenders', { ...params })
  }

  async get(id: string): Promise<ApiResponse<TenderDetail>> {
    return this.client.get<TenderDetail>(`/v1/tenders/${encodeURIComponent(id)}`)
  }

  async search(params: TenderSearchParams): Promise<ApiResponse<Tender[]>> {
    return this.listResource<Tender>('/v1/tenders/search', {
      q: params.q,
      category: params.category,
      page: params.page,
      limit: params.limit,
      fields: params.fields,
    })
  }

  async documents(id: string): Promise<ApiResponse<TenderDocument[]>> {
    return this.client.get<TenderDocument[]>(`/v1/tenders/${encodeURIComponent(id)}/documents`)
  }

  async awards(id: string): Promise<ApiResponse<Award[]>> {
    return this.client.get<Award[]>(`/v1/tenders/${encodeURIComponent(id)}/awards`)
  }

  async timeline(id: string): Promise<ApiResponse<TimelineEvent[]>> {
    return this.client.get<TimelineEvent[]>(`/v1/tenders/${encodeURIComponent(id)}/timeline`)
  }

  async analysis(id: string): Promise<ApiResponse<TenderAnalysis>> {
    return this.client.get<TenderAnalysis>(`/v1/tenders/${encodeURIComponent(id)}/analysis`)
  }

  async valueEstimate(id: string): Promise<ApiResponse<ValueEstimate>> {
    return this.client.get<ValueEstimate>(`/v1/tenders/${encodeURIComponent(id)}/value-estimate`)
  }
}
