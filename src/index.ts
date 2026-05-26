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

export type * from './types/index.js'

export { VERSION } from './version.js'
