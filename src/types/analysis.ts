export interface TenderAnalysis {
  id: string
  tenderId: string
  documentId: string | null
  submissionGuidelines: unknown | null
  evaluationCriteria: unknown | null
  importantDates: unknown | null
  contactInformation: unknown | null
  technicalSpecifications: unknown | null
  financialRequirements: unknown | null
  complianceRequirements: unknown | null
  qualityScore: number | null
  confidence: number | null
  aiModel: string | null
  aiExtractionMethod: string | null
}

export interface ValueEstimate {
  id: string
  tenderId: string
  estimatedMin: number | null
  estimatedMax: number | null
  estimatedMedian: number | null
  confidenceScore: number | null
  methodology: 'historical' | 'document' | 'benchmark' | 'hybrid' | null
  dataSources: string[] | null
  factors: unknown | null
}
