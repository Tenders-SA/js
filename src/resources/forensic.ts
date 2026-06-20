import { BaseResource } from './base-resource.js'
import type { RestrictedSupplier, RestrictedSupplierMatch } from '../types/forensic.js'
import type { ApiResponse } from '../types/common.js'

export class ForensicResource extends BaseResource {
  async listRestrictedSuppliers(params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<RestrictedSupplier[]>> {
    return this.listResource<RestrictedSupplier>('/v2/forensic/restricted-suppliers', { ...params })
  }

  async getRestrictedSupplier(supplierId: string): Promise<ApiResponse<RestrictedSupplier>> {
    return this.client.get<RestrictedSupplier>(`/v2/forensic/restricted-suppliers/${encodeURIComponent(supplierId)}`)
  }

  async matchRestrictedSupplier(params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<Record<string, unknown>[]>> {
    return this.listResource<Record<string, unknown>>('/v2/forensic/restricted-suppliers/match', { ...params })
  }

  async checkRestrictedSupplier(params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<RestrictedSupplierMatch>> {
    return this.client.get<RestrictedSupplierMatch>('/v2/forensic/restricted-suppliers/check', { ...params })
  }
}
