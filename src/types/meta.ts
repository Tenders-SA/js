export interface ApiStatus {
  healthy: boolean
  version: string
  entities: Record<string, unknown> | null
  cron: Record<string, unknown> | null
  timestamp: string | null
}

export interface ProvinceCount {
  name: string
  tenderCount: number
}

export interface CategoryCount {
  categorySlug: string
  categoryName: string
  tenderCount: number
}

export interface UsageStats {
  daily: number
  monthly: number
  limit: Record<string, number>
}

export interface IndustryBenchmarkSummary {
  id: string
  industryName: string
  sampleSize: number
  medianValue: number | null
}
