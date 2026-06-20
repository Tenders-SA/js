export { TendersaClient } from './client.js'
export type { TendersaClientConfig, RateLimitSnapshot } from './client.js'

export {
  TendersaError,
  BadRequestError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalError,
  ServiceUnavailableError,
} from './errors/index.js'

export { PaginatedAsyncIterator } from './pagination.js'
export type { PaginatedResponse } from './pagination.js'

export { withRetry } from './retry.js'
export type { RetryConfig } from './retry.js'

export { TendersResource } from './resources/tenders.js'
export { AwardsResource } from './resources/awards.js'
export type { AwardAnalyticsGroup } from './resources/awards.js'
export { CompaniesResource } from './resources/companies.js'
export { OrganizationsResource } from './resources/organizations.js'
export { MetaResource } from './resources/meta.js'
export { CategoriesResource } from './resources/categories.js'
export { ProvincesResource } from './resources/provinces.js'
export { DirectorsResource } from './resources/directors.js'
export { SeoResource } from './resources/seo.js'
export { IndustryResource } from './resources/industry.js'
export { ServicesResource } from './resources/services.js'
export { OcdsResource } from './resources/ocds.js'
export { IntelligenceResource } from './resources/intelligence.js'
export { ForensicResource } from './resources/forensic.js'
export { CipcResource } from './resources/cipc.js'
export { NewslettersResource } from './resources/newsletters.js'
export { DocumentsResource } from './resources/documents.js'

export type * from './types/index.js'

export { VERSION } from './version.js'
