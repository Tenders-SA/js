import type { ApiResponse, PaginationParams } from '../types/common.js'
import { createPaginatedResponse, type PaginatedResponse, PaginatedAsyncIterator } from '../pagination.js'
import type { TendersaClient } from '../client.js'

export abstract class BaseResource {
  protected readonly client: TendersaClient

  constructor(client: TendersaClient) {
    this.client = client
  }

  protected async listResource<T>(
    path: string,
    params: PaginationParams & Record<string, string | number | boolean | undefined | null>,
  ): Promise<ApiResponse<T[]>> {
    return this.client.get<T[]>(path, params as Record<string, string | number | boolean | undefined | null>)
  }

  protected paginatedResponse<T>(response: ApiResponse<T[]>): PaginatedResponse<T> {
    return createPaginatedResponse(response)
  }

  protected createPaginator<T>(
    path: string,
    params: PaginationParams & Record<string, string | number | boolean | undefined | null>,
    maxPages: number = Infinity,
  ): PaginatedAsyncIterator<T> {
    return new PaginatedAsyncIterator<T>(
      (pageParams) => this.client.get<T[]>(path, { ...params, ...pageParams }),
      params.limit || 100,
      maxPages,
    )
  }
}
