import { describe, it, expect } from 'vitest'
import { createPaginatedResponse, PaginatedAsyncIterator } from '../../src/pagination.js'
import type { ApiResponse } from '../../src/types/common.js'

describe('createPaginatedResponse', () => {
  it('wraps response with navigation helpers', () => {
    const response: ApiResponse<string[]> = {
      success: true,
      data: ['a', 'b'],
      meta: {
        requestId: 'r1', timestamp: '', apiVersion: 'v1',
        page: 1, pageSize: 20, totalCount: 45,
        totalPages: 3, hasNext: true, hasPrev: false,
      },
    }

    const paginated = createPaginatedResponse(response)
    expect(paginated.data).toEqual(['a', 'b'])
    expect(paginated.hasNextPage()).toBe(true)
    expect(paginated.hasPrevPage()).toBe(false)
    expect(paginated.nextPage()).toBe(2)
    expect(paginated.prevPage()).toBeNull()
  })

  it('returns null for next/prev at boundaries', () => {
    const response: ApiResponse<string[]> = {
      success: true,
      data: [],
      meta: {
        requestId: 'r1', timestamp: '', apiVersion: 'v1',
        page: 1, pageSize: 20, totalCount: 5,
        totalPages: 1, hasNext: false, hasPrev: false,
      },
    }

    const paginated = createPaginatedResponse(response)
    expect(paginated.hasNextPage()).toBe(false)
    expect(paginated.nextPage()).toBeNull()
    expect(paginated.prevPage()).toBeNull()
  })
})

describe('PaginatedAsyncIterator', () => {
  it('iterates through multiple pages', async () => {
    let callCount = 0
    const fetcher = async (params: { page?: number; limit?: number }): Promise<ApiResponse<number[]>> => {
      callCount++
      return {
        success: true,
        data: [params.page || 1],
        meta: {
          requestId: 'r1', timestamp: '', apiVersion: 'v1',
          page: params.page || 1, pageSize: params.limit || 100,
          totalCount: 3, totalPages: 3,
          hasNext: (params.page || 1) < 3,
          hasPrev: (params.page || 1) > 1,
        },
      }
    }

    const iterator = new PaginatedAsyncIterator(fetcher)
    const results: number[][] = []

    for await (const page of iterator.pages(1)) {
      results.push(page)
    }

    expect(results).toHaveLength(3)
    expect(results[0]).toEqual([1])
    expect(results[1]).toEqual([2])
    expect(results[2]).toEqual([3])
    expect(callCount).toBe(3)
  })

  it('stops on API error', async () => {
    const fetcher = async (): Promise<ApiResponse<number[]>> => ({
      success: false as unknown as true,
      data: [],
      meta: { requestId: 'r1', timestamp: '', apiVersion: 'v1' },
    })

    const iterator = new PaginatedAsyncIterator(fetcher)
    const results: number[][] = []

    for await (const page of iterator.pages()) {
      results.push(page)
    }

    expect(results).toHaveLength(0)
  })

  it('respects maxPages limit', async () => {
    const fetcher = async (params: { page?: number }): Promise<ApiResponse<number[]>> => ({
      success: true,
      data: [params.page || 1],
      meta: {
        requestId: 'r1', timestamp: '', apiVersion: 'v1',
        page: params.page || 1, pageSize: 100,
        totalCount: 100, totalPages: 10,
        hasNext: (params.page || 1) < 10,
        hasPrev: (params.page || 1) > 1,
      },
    })

    const iterator = new PaginatedAsyncIterator(fetcher, 100, 2)
    const results: number[][] = []

    for await (const page of iterator.pages()) {
      results.push(page)
    }

    expect(results).toHaveLength(2)
  })
})
