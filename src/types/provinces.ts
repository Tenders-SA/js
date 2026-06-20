export interface ProvinceInfo {
  name: string
  tenderCount: number
}

export interface ProvinceHealthScore {
  province: string
  year: number | null
  quarter: number | null
  score: number | null
  metric: string | null
}
