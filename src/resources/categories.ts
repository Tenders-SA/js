import { BaseResource } from './base-resource.js'
import type { TenderCategory } from '../types/categories.js'
import type { ApiResponse } from '../types/common.js'

export class CategoriesResource extends BaseResource {
  async list(): Promise<ApiResponse<TenderCategory[]>> {
    return this.client.get<TenderCategory[]>('/v2/categories')
  }

  async get(categoryId: string): Promise<ApiResponse<TenderCategory>> {
    return this.client.get<TenderCategory>(`/v2/categories/${encodeURIComponent(categoryId)}`)
  }

  async bySlug(slug: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.get<Record<string, unknown>>(`/v2/categories/by-slug/${encodeURIComponent(slug)}`)
  }
}
