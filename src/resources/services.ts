import { BaseResource } from './base-resource.js'
import type { ServiceType } from '../types/services.js'
import type { ApiResponse } from '../types/common.js'

export class ServicesResource extends BaseResource {
  async list(): Promise<ApiResponse<ServiceType[]>> {
    return this.client.get<ServiceType[]>('/v2/services')
  }

  async get(serviceSlug: string): Promise<ApiResponse<ServiceType>> {
    return this.client.get<ServiceType>(`/v2/services/${encodeURIComponent(serviceSlug)}`)
  }
}
