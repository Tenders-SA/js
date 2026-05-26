import type { ApiResponse, Meta, PaginationParams } from './types/common.js'

export interface PaginatedResponse<T> {
  data: T[]
  meta: Meta
  hasNextPage(): boolean
  hasPrevPage(): boolean
  nextPage(): number | null
  prevPage(): number | null
}

export function createPaginatedResponse<T>(response: ApiResponse<T[]>): PaginatedResponse<T> {
  const meta = response.meta
  return {
    data: response.data,
    meta,
    hasNextPage: () => meta.hasNext === true,
    hasPrevPage: () => meta.hasPrev === true,
    nextPage: () => {
      if (!meta.hasNext || meta.page === undefined) return null
      return meta.page + 1
    },
    prevPage: () => {
      if (!meta.hasPrev || meta.page === undefined) return null
      return meta.page - 1
    },
  }
}

export class PaginatedAsyncIterator<T> {
  private readonly fetcher: (params: PaginationParams) => Promise<ApiResponse<T[]>>
  private readonly pageSize: number
  private readonly maxPages: number

  constructor(
    fetcher: (params: PaginationParams) => Promise<ApiResponse<T[]>>,
    pageSize: number = 100,
    maxPages: number = Infinity,
  ) {
    this.fetcher = fetcher
    this.pageSize = pageSize
    this.maxPages = maxPages
  }

  async *pages(startPage: number = 1): AsyncIterableIterator<T[]> {
    let page = startPage
    let hasMore = true

    while (hasMore && page <= this.maxPages) {
      const response = await this.fetcher({ page, limit: this.pageSize })

      if (!response.success) break

      yield response.data
      hasMore = response.meta.hasNext === true
      page++
    }
  }
}
