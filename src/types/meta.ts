export interface ApiStatus {
  healthy: boolean
  version: string
  lastSync: {
    tenders: string | null
    awards: string | null
    companies: string | null
    organizations: string | null
    analyses: string | null
    estimates: string | null
  }
}

export interface ProvinceCount {
  name: string
  tenderCount: number
}

export interface CategoryCount {
  name: string
  count: number
}

export interface UsageStats {
  daily: number
  monthly: number
  limit: {
    daily: number
    monthly: number
  }
}
