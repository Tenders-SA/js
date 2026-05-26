import type { ApiErrorResponse } from '../types/common.js'

export class TendersaError extends Error {
  public readonly code: string
  public readonly status: number
  public readonly requestId: string
  public readonly docs?: string

  constructor(status: number, code: string, message: string, requestId: string, docs?: string) {
    super(message)
    this.name = 'TendersaError'
    this.code = code
    this.status = status
    this.requestId = requestId
    this.docs = docs
  }
}

export class BadRequestError extends TendersaError {
  constructor(message: string, requestId: string) {
    super(400, 'BAD_REQUEST', message, requestId)
    this.name = 'BadRequestError'
  }
}

export class AuthError extends TendersaError {
  constructor(message: string, requestId: string) {
    super(401, 'UNAUTHORIZED', message, requestId)
    this.name = 'AuthError'
  }
}

export class ForbiddenError extends TendersaError {
  constructor(message: string, requestId: string) {
    super(403, 'FORBIDDEN', message, requestId)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends TendersaError {
  constructor(message: string, requestId: string) {
    super(404, 'NOT_FOUND', message, requestId)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends TendersaError {
  constructor(message: string, requestId: string) {
    super(409, 'CONFLICT', message, requestId)
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends TendersaError {
  public readonly limit: number
  public readonly used: number
  public readonly resetsAt: string
  public readonly tier: string

  constructor(
    message: string,
    requestId: string,
    limit: number,
    used: number,
    resetsAt: string,
    tier: string,
  ) {
    super(429, 'RATE_LIMIT_EXCEEDED', message, requestId)
    this.name = 'RateLimitError'
    this.limit = limit
    this.used = used
    this.resetsAt = resetsAt
    this.tier = tier
  }
}

export class InternalError extends TendersaError {
  constructor(message: string, requestId: string) {
    super(500, 'INTERNAL_ERROR', message, requestId)
    this.name = 'InternalError'
  }
}

export class ServiceUnavailableError extends TendersaError {
  constructor(message: string, requestId: string) {
    super(502, 'SERVICE_UNAVAILABLE', message, requestId)
    this.name = 'ServiceUnavailableError'
  }
}

export function createErrorFromResponse(response: ApiErrorResponse, status: number): TendersaError {
  const { error, message, requestId, details } = response

  switch (status) {
    case 400:
      return new BadRequestError(message || error || 'Bad request', requestId)
    case 401:
      return new AuthError(message || error || 'Unauthorized', requestId)
    case 403:
      return new ForbiddenError(message || error || 'Forbidden', requestId)
    case 404:
      return new NotFoundError(message || error || 'Not found', requestId)
    case 409:
      return new ConflictError(message || error || 'Conflict', requestId)
    case 429: {
      const d = details as Record<string, unknown> | undefined
      return new RateLimitError(
        message || error || 'Rate limit exceeded',
        requestId,
        (d?.limit as number) || 0,
        (d?.used as number) || 0,
        (d?.resetsAt as string) || '',
        (d?.tier as string) || '',
      )
    }
    case 502:
      return new ServiceUnavailableError(message || error || 'Service unavailable', requestId)
    default:
      return new TendersaError(status, response.code, message || error || 'Unknown error', requestId)
  }
}
