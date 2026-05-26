export interface RetryConfig {
  maxRetries: number
  baseDelayMs: number
  maxDelayMs: number
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
}

const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504])

export function isRetryable(status: number): boolean {
  return RETRYABLE_STATUSES.has(status)
}

export function calculateDelay(attempt: number, config: RetryConfig): number {
  const delay = config.baseDelayMs * Math.pow(2, attempt - 1)
  return Math.min(delay, config.maxDelayMs)
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  shouldRetry: (error: unknown) => boolean = (err) => {
    if (err && typeof err === 'object' && 'status' in err) {
      return isRetryable((err as { status: number }).status)
    }
    return false
  },
): Promise<T> {
  let lastError: unknown

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err

      if (attempt < config.maxRetries && shouldRetry(err)) {
        const delay = calculateDelay(attempt, config)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      throw err
    }
  }

  throw lastError
}
