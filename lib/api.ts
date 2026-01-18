/**
 * API utilities with retry logic and error handling
 */

interface FetchWithRetryOptions extends RequestInit {
  retries?: number
  retryDelay?: number
  retryOn?: number[]
  timeout?: number
  onRetry?: (attempt: number, error: Error) => void
}

interface ApiError extends Error {
  status?: number
  statusText?: string
  data?: unknown
}

/**
 * Custom API error class
 */
export class ApiRequestError extends Error implements ApiError {
  status?: number
  statusText?: string
  data?: unknown

  constructor(message: string, status?: number, statusText?: string, data?: unknown) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.statusText = statusText
    this.data = data
  }
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Fetch with automatic retry logic
 * 
 * @param url - The URL to fetch
 * @param options - Fetch options with retry configuration
 * @returns Promise with the fetch response
 * 
 * @example
 * const data = await fetchWithRetry('/api/poems', {
 *   retries: 3,
 *   retryDelay: 1000,
 *   onRetry: (attempt) => console.log(`Retry attempt ${attempt}`)
 * })
 */
export async function fetchWithRetry(
  url: string,
  options: FetchWithRetryOptions = {}
): Promise<Response> {
  const {
    retries = 3,
    retryDelay = 1000,
    retryOn = [408, 429, 500, 502, 503, 504],
    timeout = 10000,
    onRetry,
    ...fetchOptions
  } = options

  let lastError: Error = new Error('Unknown error')

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // If response is ok or not a retryable status, return it
      if (response.ok || !retryOn.includes(response.status)) {
        return response
      }

      // It's a retryable error
      lastError = new ApiRequestError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response.statusText
      )

      // If this was the last attempt, throw
      if (attempt === retries) {
        throw lastError
      }

      // Calculate delay with exponential backoff
      const delay = retryDelay * Math.pow(2, attempt)
      
      onRetry?.(attempt + 1, lastError)
      await sleep(delay)

    } catch (error) {
      // Handle abort errors (timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        lastError = new ApiRequestError('Request timeout', 408, 'Request Timeout')
      } else if (error instanceof Error) {
        lastError = error
      }

      // If this was the last attempt, throw
      if (attempt === retries) {
        throw lastError
      }

      // Calculate delay with exponential backoff
      const delay = retryDelay * Math.pow(2, attempt)
      
      onRetry?.(attempt + 1, lastError)
      await sleep(delay)
    }
  }

  throw lastError
}

/**
 * Typed fetch wrapper with JSON parsing and retry logic
 */
export async function apiFetch<T>(
  url: string,
  options: FetchWithRetryOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let errorData: unknown
    try {
      errorData = await response.json()
    } catch {
      errorData = null
    }

    throw new ApiRequestError(
      `API Error: ${response.status} ${response.statusText}`,
      response.status,
      response.statusText,
      errorData
    )
  }

  return response.json()
}

/**
 * POST request helper
 */
export async function apiPost<T, B = unknown>(
  url: string,
  body: B,
  options: FetchWithRetryOptions = {}
): Promise<T> {
  return apiFetch<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
  })
}

/**
 * PUT request helper
 */
export async function apiPut<T, B = unknown>(
  url: string,
  body: B,
  options: FetchWithRetryOptions = {}
): Promise<T> {
  return apiFetch<T>(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    ...options,
  })
}

/**
 * DELETE request helper
 */
export async function apiDelete<T>(
  url: string,
  options: FetchWithRetryOptions = {}
): Promise<T> {
  return apiFetch<T>(url, {
    method: 'DELETE',
    ...options,
  })
}

/**
 * Hook-friendly API call wrapper with loading and error states
 */
export interface UseApiResult<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
  refetch: () => Promise<void>
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('Failed to fetch') ||
      error.message.includes('Network request failed') ||
      error.message.includes('NetworkError') ||
      error.name === 'AbortError'
    )
  }
  return false
}

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  if (error instanceof ApiRequestError) {
    return error.status === 429
  }
  return false
}

/**
 * Get user-friendly error message in Hindi
 */
export function getErrorMessage(error: unknown): string {
  if (isNetworkError(error)) {
    return 'इंटरनेट कनेक्शन में समस्या है'
  }

  if (isRateLimitError(error)) {
    return 'बहुत अधिक अनुरोध — कृपया कुछ देर प्रतीक्षा करें'
  }

  if (error instanceof ApiRequestError) {
    switch (error.status) {
      case 400:
        return 'अमान्य अनुरोध'
      case 401:
        return 'प्रमाणीकरण आवश्यक है'
      case 403:
        return 'पहुँच निषेध'
      case 404:
        return 'सामग्री नहीं मिली'
      case 408:
        return 'अनुरोध समय समाप्त'
      case 500:
        return 'सर्वर में त्रुटि हुई'
      case 502:
      case 503:
      case 504:
        return 'सेवा अस्थायी रूप से अनुपलब्ध है'
      default:
        return 'कुछ गलत हो गया'
    }
  }

  if (error instanceof Error) {
    return error.message || 'अज्ञात त्रुटि'
  }

  return 'कुछ गलत हो गया'
}
