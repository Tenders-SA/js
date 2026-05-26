import { describe, it, expect, vi } from 'vitest'
import { withRetry, isRetryable, calculateDelay } from '../../src/retry.js'

describe('isRetryable', () => {
  it('returns true for retryable status codes', () => {
    expect(isRetryable(429)).toBe(true)
    expect(isRetryable(500)).toBe(true)
    expect(isRetryable(502)).toBe(true)
    expect(isRetryable(503)).toBe(true)
    expect(isRetryable(504)).toBe(true)
  })

  it('returns false for non-retryable codes', () => {
    expect(isRetryable(400)).toBe(false)
    expect(isRetryable(401)).toBe(false)
    expect(isRetryable(403)).toBe(false)
    expect(isRetryable(404)).toBe(false)
    expect(isRetryable(200)).toBe(false)
  })
})

describe('calculateDelay', () => {
  it('uses exponential backoff', () => {
    const config = { maxRetries: 3, baseDelayMs: 1000, maxDelayMs: 30000 }
    expect(calculateDelay(1, config)).toBe(1000)
    expect(calculateDelay(2, config)).toBe(2000)
    expect(calculateDelay(3, config)).toBe(4000)
  })

  it('caps at maxDelayMs', () => {
    const config = { maxRetries: 10, baseDelayMs: 10000, maxDelayMs: 15000 }
    expect(calculateDelay(3, config)).toBe(15000)
  })
})

describe('withRetry', () => {
  it('succeeds on first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success')
    const result = await withRetry(fn)
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries on failure and succeeds', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce({ status: 500 })
      .mockRejectedValueOnce({ status: 500 })
      .mockResolvedValue('success')

    const result = await withRetry(fn)
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('throws after exhausting retries', async () => {
    const error = { status: 500, message: 'Server error' }
    const fn = vi.fn().mockRejectedValue(error)

    await expect(withRetry(fn, { maxRetries: 2, baseDelayMs: 10, maxDelayMs: 100 })).rejects.toEqual(error)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('does not retry non-retryable errors', async () => {
    const error = { status: 400, message: 'Bad request' }
    const fn = vi.fn().mockRejectedValue(error)

    await expect(withRetry(fn)).rejects.toEqual(error)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('uses custom shouldRetry function', async () => {
    const error = new Error('Network error')
    const fn = vi.fn().mockRejectedValue(error)
    const shouldRetry = () => true

    await expect(withRetry(fn, { maxRetries: 2, baseDelayMs: 10, maxDelayMs: 100 }, shouldRetry))
      .rejects.toThrow('Network error')
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
