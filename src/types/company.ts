import type { PaginationParams } from './common.js'
import type { Award } from './tender.js'

export interface Director {
  name: string
  idNumber: string | null
}

export interface CompanyProfile {
  name: string
  registrationNumber: string | null
  taxNumber: string | null
  companyType: string | null
  enterpriseType: 'EME' | 'QSE' | 'Large' | null
  beeLevel: string | null
  cidbGrading: string | null
  totalAwards: number
  totalValue: number
  latestAwardDate: string | null
  categories: string[]
  provinces: string[]
  complianceScore: number | null
  forensicRiskScore: number | null
  directorCount: number | null
  directors: Director[] | null
  contactEmail: string | null
  contactEmailConfidence: number | null
  contactPhone: string | null
  website: string | null
}

export interface CompanyProfileResponse {
  profile: CompanyProfile
  awards: Award[]
  directors: Director[]
}

export interface CompanySearchResult {
  name: string
  registrationNumber: string | null
  enterpriseType: string | null
  beeLevel: string | null
  totalAwards: number
  totalValue: number
  latestAwardDate: string | null
  categories: string[]
  provinces: string[]
}

export interface CompanyGetParams {
  page?: number
  limit?: number
}

export interface CompanySearchParams extends PaginationParams {
  q: string
  enterpriseType?: string
  beeLevel?: string
  province?: string
  category?: string
}
