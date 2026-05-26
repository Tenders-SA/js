import type { EstimatedValue, PaginationParams, SparseFieldsParams } from './common.js'

export interface Tender {
  tenderId: string
  title: string | null
  description: string | null
  province: string | null
  category: Array<{ name: string }>
  estimatedValue: EstimatedValue | null
  closingDate: string | null
  status: string | null
  publicationDate: string | null
  publicationType: 'TENDER_NOTICE' | 'CORRIGENDUM' | 'AWARD_NOTICE' | 'CANCELLATION_NOTICE' | 'ADDENDUM' | null
  aiSummary: string | null
  aiKeyRequirements: string[] | null
  aiConfidence: number | null
  classificationConfidence: number | null
  sourceOrganization: { name: string } | null
  referenceNumber: string | null
  siteUrl: string | null
  municipality: string | null
  department: string | null
  institution: string | null
  dataSource: string | null
}

export interface TenderDetail extends Tender {
  awards: Award[]
}

export interface TenderDocument {
  documentId: string
  fileName: string
  fileSize: number | null
  mimeType: string | null
  cacheStatus: 'CACHED' | 'UNCACHED' | 'PROCESSING' | null
  processingStatus: 'COMPLETED' | 'PROCESSING' | 'FAILED' | 'PENDING' | null
  downloadUrl: string
}

export interface TimelineEvent {
  event: string
  label: string
  date: string
  type: 'milestone' | 'deadline' | 'status'
}

export interface Subcontractor {
  name: string
  percentage: number | null
  beeLevel: string | null
  blackYouth: boolean
  blackWomen: boolean
  blackDisabled: boolean
  blackMilitary: boolean
  blackRural: boolean
}

export interface Award {
  awardId: string
  tenderId: string | null
  title: string | null
  status: string | null
  awardDate: string | null
  amount: number | null
  currency: string
  supplierName: string | null
  supplierId: string | null
  enterpriseType: 'EME' | 'QSE' | 'Large' | 'UNSPECIFIED' | null
  beeLevel: string | null
  beePoints: number | null
  points: number | null
  description: string | null
  tenderTitle: string | null
  tenderReference: string | null
  tenderCategory: string | null
  tenderProvince: string | null
  subcontractors: Subcontractor[] | null
}

export interface TenderListParams extends PaginationParams, SparseFieldsParams {
  category?: string
  province?: string
  status?: 'active' | 'awarded' | 'cancelled' | 'closed'
  q?: string
  closingAfter?: string
  closingBefore?: string
  minValue?: number
  maxValue?: number
  referenceNumber?: string
  sourceOrganization?: string
  sort?: string
}

export interface TenderSearchParams extends PaginationParams, SparseFieldsParams {
  q: string
  category?: string
}

export interface TenderListResponse {
  data: Tender[]
  meta: {
    totalCount: number
    page: number
    pageSize: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
    rateLimit?: RateLimit
  }
}

export interface AwardListParams extends PaginationParams, SparseFieldsParams {
  supplierName?: string
  supplierId?: string
  tenderId?: string
  category?: string
  province?: string
  enterpriseType?: 'EME' | 'QSE' | 'Large' | 'UNSPECIFIED'
  beeLevel?: string
  minAmount?: number
  maxAmount?: number
  awardDateFrom?: string
  awardDateTo?: string
  status?: string
  sort?: string
}

export interface AwardAnalyticsParams {
  groupBy?: 'enterpriseType' | 'beeLevel' | 'province' | 'category' | 'month' | 'quarter' | 'year'
  from?: string
  to?: string
}

// Re-export for convenience
import type { RateLimit } from './common.js'
