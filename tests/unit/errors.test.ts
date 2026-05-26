import { describe, it, expect } from 'vitest'
import {
  TendersaError,
  BadRequestError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalError,
  ServiceUnavailableError,
  createErrorFromResponse,
} from '../../src/errors/index.js'

describe('Error classes', () => {
  it('TendersaError has correct properties', () => {
    const err = new TendersaError(400, 'BAD_REQUEST', 'Bad request', 'req_123', 'https://docs.example.com')
    expect(err.status).toBe(400)
    expect(err.code).toBe('BAD_REQUEST')
    expect(err.message).toBe('Bad request')
    expect(err.requestId).toBe('req_123')
    expect(err.docs).toBe('https://docs.example.com')
    expect(err.name).toBe('TendersaError')
  })

  it('BadRequestError', () => {
    const err = new BadRequestError('Invalid param', 'req_1')
    expect(err.status).toBe(400)
    expect(err.code).toBe('BAD_REQUEST')
    expect(err.name).toBe('BadRequestError')
  })

  it('AuthError', () => {
    const err = new AuthError('Unauthorized', 'req_2')
    expect(err.status).toBe(401)
    expect(err.code).toBe('UNAUTHORIZED')
  })

  it('ForbiddenError', () => {
    const err = new ForbiddenError('Forbidden', 'req_3')
    expect(err.status).toBe(403)
    expect(err.code).toBe('FORBIDDEN')
  })

  it('NotFoundError', () => {
    const err = new NotFoundError('Not found', 'req_4')
    expect(err.status).toBe(404)
    expect(err.code).toBe('NOT_FOUND')
  })

  it('ConflictError', () => {
    const err = new ConflictError('Conflict', 'req_5')
    expect(err.status).toBe(409)
    expect(err.code).toBe('CONFLICT')
  })

  it('RateLimitError', () => {
    const err = new RateLimitError('Rate limited', 'req_6', 500, 500, '2026-05-26T00:00:00Z', 'professional')
    expect(err.status).toBe(429)
    expect(err.code).toBe('RATE_LIMIT_EXCEEDED')
    expect(err.limit).toBe(500)
    expect(err.used).toBe(500)
    expect(err.tier).toBe('professional')
  })

  it('InternalError', () => {
    const err = new InternalError('Internal error', 'req_7')
    expect(err.status).toBe(500)
    expect(err.code).toBe('INTERNAL_ERROR')
  })

  it('ServiceUnavailableError', () => {
    const err = new ServiceUnavailableError('Unavailable', 'req_8')
    expect(err.status).toBe(502)
    expect(err.code).toBe('SERVICE_UNAVAILABLE')
  })
})

describe('createErrorFromResponse', () => {
  it('creates BadRequestError for 400', () => {
    const err = createErrorFromResponse({
      success: false, error: 'Bad', code: 'BAD', message: 'Invalid', requestId: 'r1', docs: '', timestamp: '',
    }, 400)
    expect(err).toBeInstanceOf(BadRequestError)
  })

  it('creates AuthError for 401', () => {
    const err = createErrorFromResponse({
      success: false, error: 'Unauthorized', code: 'UNAUTHORIZED', message: '', requestId: 'r2', docs: '', timestamp: '',
    }, 401)
    expect(err).toBeInstanceOf(AuthError)
  })

  it('creates NotFoundError for 404', () => {
    const err = createErrorFromResponse({
      success: false, error: 'Not found', code: 'NOT_FOUND', message: '', requestId: 'r3', docs: '', timestamp: '',
    }, 404)
    expect(err).toBeInstanceOf(NotFoundError)
  })

  it('creates RateLimitError for 429', () => {
    const err = createErrorFromResponse({
      success: false, error: 'Rate limited', code: 'RATE_LIMIT', message: '', requestId: 'r4', docs: '', timestamp: '',
      details: { limit: 500, used: 500, resetsAt: '2026-05-26T00:00:00Z', tier: 'professional' },
    }, 429)
    expect(err).toBeInstanceOf(RateLimitError)
    expect((err as RateLimitError).limit).toBe(500)
  })
})
