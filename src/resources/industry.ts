import { BaseResource } from './base-resource.js'
import type { IndustryBenchmark } from '../types/industry.js'
import type { ApiResponse } from '../types/common.js'

export class IndustryResource extends BaseResource {
  async list(): Promise<ApiResponse<IndustryBenchmark[]>> {
    return this.client.get<IndustryBenchmark[]>('/v2/industry/benchmarks')
  }

  async get(benchmarkId: string): Promise<ApiResponse<IndustryBenchmark>> {
    return this.client.get<IndustryBenchmark>(`/v2/industry/benchmarks/${encodeURIComponent(benchmarkId)}`)
  }
}
