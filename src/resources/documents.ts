import { BaseResource } from './base-resource.js'
import type { DocumentDetail } from '../types/documents.js'
import type { ApiResponse } from '../types/common.js'

export class DocumentsResource extends BaseResource {
  async get(documentId: string): Promise<ApiResponse<DocumentDetail>> {
    return this.client.get<DocumentDetail>(`/v2/documents/${encodeURIComponent(documentId)}`)
  }

  async downloadUrl(documentId: string, params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<DocumentDetail>> {
    return this.client.get<DocumentDetail>(`/v2/documents/${encodeURIComponent(documentId)}/download-url`, { ...params })
  }
}
