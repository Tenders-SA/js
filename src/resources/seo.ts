import { BaseResource } from './base-resource.js'
import type { Article, Author } from '../types/seo.js'
import type { ApiResponse } from '../types/common.js'

export class SeoResource extends BaseResource {
  async category(slug: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.get<Record<string, unknown>>(`/v2/seo/category/${encodeURIComponent(slug)}`)
  }

  async province(slug: string): Promise<ApiResponse<Record<string, unknown>>> {
    return this.client.get<Record<string, unknown>>(`/v2/seo/province/${encodeURIComponent(slug)}`)
  }

  async listArticles(params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<Article[]>> {
    return this.listResource<Article>('/v2/articles', { ...params })
  }

  async getArticle(articleId: string): Promise<ApiResponse<Article>> {
    return this.client.get<Article>(`/v2/articles/${encodeURIComponent(articleId)}`)
  }

  async getAuthor(authorId: string): Promise<ApiResponse<Author>> {
    return this.client.get<Author>(`/v2/authors/${encodeURIComponent(authorId)}`)
  }
}
