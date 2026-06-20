export interface CipcEnrichment {
  id: string
  name: string
  registrationNumber: string | null
  enterpriseType: string | null
  cipcEnrichmentId: string | null
  complianceScore: number | null
  forensicRiskScore: number | null
  directorCount: number | null
}

export interface CipcDirector {
  id: string
  companyName: string | null
  registrationNo: string | null
  roleType: string | null
  status: string | null
  appointedDate: string | null
  resignedDate: string | null
  directorFullName: string | null
  complianceScore: number | null
  forensicRiskScore: number | null
}
