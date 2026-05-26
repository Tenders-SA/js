import type { PaginationParams } from './common.js'
import type { EstimatedValue } from './common.js'

export interface GoogleEnrichment {
  placeId: string
  rating: number | null
  mapUrl: string | null
  types: string[] | null
}

export interface WikidataEnrichment {
  id: string
  label: string
  description: string
}

export interface OrganizationStats {
  totalTenders: number
  totalAwardValue: number
  tenderCategories: string[] | null
}

export interface OrganizationProfile {
  id: string
  name: string
  legalName: string | null
  organizationType: 'government_department' | 'municipality' | 'state_enterprise' | null
  registrationNumber: string | null
  bbbeeLevel: string | null
  industryCodes: string[] | null
  provincesOperating: string[] | null
  contactEmail: string | null
  contactPhone: string | null
  website: string | null
  physicalAddress: string | null
  google: GoogleEnrichment | null
  wikidata: WikidataEnrichment | null
  govDirectoryUrl: string | null
  salgaMunicipalityCode: string | null
  csdNumber: string | null
  enrichmentSources: string[] | null
  confidenceScore: number | null
  slug: string | null
  stats: OrganizationStats
}

export interface OrganizationTenderSummary {
  tenderId: string
  title: string
  closingDate: string | null
  status: string | null
  estimatedValue: EstimatedValue | null
}

export interface OrganizationTendersParams extends PaginationParams {
  status?: string
}
