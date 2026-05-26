export interface RateLimit {
  limit: number
  remaining: number
  reset: string
  policy: string
}

export interface Meta {
  requestId: string
  timestamp: string
  apiVersion: string
  deprecation?: string | null
  page?: number
  pageSize?: number
  totalCount?: number
  totalPages?: number
  hasNext?: boolean
  hasPrev?: boolean
  rateLimit?: RateLimit
  query?: string
}

export interface ApiResponse<T> {
  success: true
  data: T
  meta: Meta
}

export interface ApiErrorResponse {
  success: false
  error: string
  code: string
  message?: string
  requestId: string
  docs?: string
  timestamp: string
  details?: Record<string, unknown>
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface SparseFieldsParams {
  fields?: string
}

export interface EstimatedValue {
  min: number | null
  max: number | null
  median: number | null
  confidence: number | null
  methodology: 'historical' | 'document' | 'benchmark' | 'hybrid' | null
}
