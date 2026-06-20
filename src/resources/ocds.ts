import { BaseResource } from './base-resource.js'
import type { OcdsParty } from '../types/ocds.js'
import type { ApiResponse } from '../types/common.js'

export class OcdsResource extends BaseResource {
  async listParties(params?: Record<string, string | number | boolean | undefined | null>): Promise<ApiResponse<OcdsParty[]>> {
    return this.listResource<OcdsParty>('/v2/ocds/parties', { ...params })
  }

  async getParty(partyId: string): Promise<ApiResponse<OcdsParty>> {
    return this.client.get<OcdsParty>(`/v2/ocds/parties/${encodeURIComponent(partyId)}`)
  }
}
