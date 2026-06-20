import { BaseResource } from './base-resource.js'
import type { Tender, TenderDetail, TenderDocument, TimelineEvent, Award } from '../types/tender.js'
import type { TenderListParams, TenderSearchParams } from '../types/tender.js'
import type { TenderAnalysis, ValueEstimate } from '../types/analysis.js'
import type { ApiResponse } from '../types/common.js'
import type { CountItem } from '../types/tender.js'
import { PaginatedAsyncIterator } from '../pagination.js'

export class TendersResource extends BaseResource {
  async list(params?: TenderListParams): Promise<ApiResponse<Tender[]>> {
    return this.listResource<Tender>('/v2/tenders', {
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
    return this.createPaginator<Tender>('/v2/tenders', { ...params })
  }

  async get(id: string): Promise<ApiResponse<TenderDetail>> {
    return this.client.get<TenderDetail>(`/v2/tenders/${encodeURIComponent(id)}`)
  }

  async search(params: TenderSearchParams): Promise<ApiResponse<Tender[]>> {
    return this.listResource<Tender>('/v2/tenders/search', {
      q: params.q,
      category: params.category,
      page: params.page,
      limit: params.limit,
      fields: params.fields,
    })
  }

  async closingSoon(params?: TenderListParams): Promise<ApiResponse<Tender[]>> {
    return this.listResource<Tender>('/v2/tenders/closing-soon', { ...params })
  }

  async newTenders(params?: TenderListParams): Promise<ApiResponse<Tender[]>> {
    return this.listResource<Tender>('/v2/tenders/new', { ...params })
  }

  async bbbeeRequired(params?: TenderListParams): Promise<ApiResponse<Tender[]>> {
    return this.listResource<Tender>('/v2/tenders/bbbee-required', { ...params })
  }

  async valueRange(min: number, max: number, params?: TenderListParams): Promise<ApiResponse<Tender[]>> {
    return this.listResource<Tender>('/v2/tenders/value-range', {
      min,
      max,
      ...params,
    })
  }

  async byProvince(province: string, params?: TenderListParams): Promise<ApiResponse<Tender[]>> {
    return this.listResource<Tender>(`/v2/tenders/by-province/${encodeURIComponent(province)}`, { ...params })
  }

  async byOrganization(orgId: string, params?: TenderListParams): Promise<ApiResponse<Tender[]>> {
    return this.listResource<Tender>(`/v2/tenders/by-organization/${encodeURIComponent(orgId)}`, { ...params })
  }

  async byPublicationType(pubType: string, params?: TenderListParams): Promise<ApiResponse<Tender[]>> {
    return this.listResource<Tender>(`/v2/tenders/by-publication-type/${encodeURIComponent(pubType)}`, { ...params })
  }

  async byCategory(category: string, params?: TenderListParams): Promise<ApiResponse<Tender[]>> {
    return this.listResource<Tender>(`/v2/tenders/by-category/${encodeURIComponent(category)}`, { ...params })
  }

  async countsByProvince(): Promise<ApiResponse<CountItem[]>> {
    return this.client.get<CountItem[]>('/v2/tenders/counts/province')
  }

  async countsByCategory(): Promise<ApiResponse<CountItem[]>> {
    return this.client.get<CountItem[]>('/v2/tenders/counts/category')
  }

  async countsByOrganization(): Promise<ApiResponse<CountItem[]>> {
    return this.client.get<CountItem[]>('/v2/tenders/counts/organization')
  }

  async countsByStatus(): Promise<ApiResponse<CountItem[]>> {
    return this.client.get<CountItem[]>('/v2/tenders/counts/status')
  }

  async documents(id: string): Promise<ApiResponse<TenderDocument[]>> {
    return this.client.get<TenderDocument[]>(`/v2/tenders/${encodeURIComponent(id)}/documents`)
  }

  async contracts(id: string): Promise<ApiResponse<Record<string, unknown>[]>> {
    return this.client.get<Record<string, unknown>[]>(`/v2/tenders/${encodeURIComponent(id)}/contracts`)
  }

  async milestones(id: string): Promise<ApiResponse<Record<string, unknown>[]>> {
    return this.client.get<Record<string, unknown>[]>(`/v2/tenders/${encodeURIComponent(id)}/milestones`)
  }

  async bidders(id: string): Promise<ApiResponse<Record<string, unknown>[]>> {
    return this.client.get<Record<string, unknown>[]>(`/v2/tenders/${encodeURIComponent(id)}/bidders`)
  }

  async submissionRequirements(id: string): Promise<ApiResponse<Record<string, unknown>[]>> {
    return this.client.get<Record<string, unknown>[]>(`/v2/tenders/${encodeURIComponent(id)}/submission-requirements`)
  }

  async awards(id: string): Promise<ApiResponse<Award[]>> {
    return this.client.get<Award[]>(`/v2/tenders/${encodeURIComponent(id)}/awards`)
  }

  async timeline(id: string): Promise<ApiResponse<TimelineEvent[]>> {
    return this.client.get<TimelineEvent[]>(`/v2/tenders/${encodeURIComponent(id)}/timeline`)
  }

  async analysis(id: string): Promise<ApiResponse<TenderAnalysis>> {
    return this.client.get<TenderAnalysis>(`/v2/tenders/${encodeURIComponent(id)}/analysis`)
  }

  async valueEstimate(id: string): Promise<ApiResponse<ValueEstimate>> {
    return this.client.get<ValueEstimate>(`/v2/tenders/${encodeURIComponent(id)}/value-estimate`)
  }

  async seo(id: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.get<Record<string, unknown>>(`/v2/tenders/${encodeURIComponent(id)}/seo`)
  }

  async slug(id: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.get<Record<string, unknown>>(`/v2/tenders/${encodeURIComponent(id)}/slug`)
  }

  async related(id: string, params?: TenderListParams): Promise<ApiResponse<Tender[]>> {
    return this.listResource<Tender>(`/v2/tenders/${encodeURIComponent(id)}/related`, { ...params })
  }
}
