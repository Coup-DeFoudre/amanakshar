'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { fetchWithRetry, getErrorMessage, ApiRequestError } from '../api'

interface UseApiOptions {
  retries?: number
  retryDelay?: number
  timeout?: number
  immediate?: boolean
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
}

interface UseApiState<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: () => Promise<T | null>
  reset: () => void
  refetch: () => Promise<T | null>
}

/**
 * useApi - React hook for making API calls with automatic retry logic
 * 
 * @example
 * const { data, isLoading, error, execute } = useApi<Poem[]>('/api/poems', {
 *   immediate: true,
 *   retries: 3,
 * })
 */
export function useApi<T>(
  url: string,
  options: UseApiOptions & RequestInit = {}
): UseApiReturn<T> {
  const {
    retries = 3,
    retryDelay = 1000,
    timeout = 10000,
    immediate = false,
    onSuccess,
    onError,
    ...fetchOptions
  } = options

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
    isError: false,
    isSuccess: false,
  })

  const mountedRef = useRef(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  const execute = useCallback(async (): Promise<T | null> => {
    // Cancel any pending requests
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    setState(prev => ({
      ...prev,
      isLoading: true,
      isError: false,
      error: null,
    }))

    try {
      const response = await fetchWithRetry(url, {
        ...fetchOptions,
        retries,
        retryDelay,
        timeout,
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new ApiRequestError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response.statusText
        )
      }

      const data = await response.json() as T

      if (mountedRef.current) {
        setState({
          data,
          error: null,
          isLoading: false,
          isError: false,
          isSuccess: true,
        })
        onSuccess?.(data)
      }

      return data
    } catch (error) {
      if (!mountedRef.current) return null

      // Ignore abort errors
      if (error instanceof Error && error.name === 'AbortError') {
        return null
      }

      const err = error instanceof Error ? error : new Error(String(error))
      
      setState({
        data: null,
        error: err,
        isLoading: false,
        isError: true,
        isSuccess: false,
      })
      
      onError?.(err)
      return null
    }
  }, [url, fetchOptions, retries, retryDelay, timeout, onSuccess, onError])

  const reset = useCallback(() => {
    abortControllerRef.current?.abort()
    setState({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
    })
  }, [])

  const refetch = useCallback(() => {
    return execute()
  }, [execute])

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      abortControllerRef.current?.abort()
    }
  }, [])

  return {
    ...state,
    execute,
    reset,
    refetch,
  }
}

/**
 * useMutation - Hook for POST/PUT/DELETE operations with optimistic updates
 */
interface UseMutationOptions<T, V> {
  onSuccess?: (data: T, variables: V) => void
  onError?: (error: Error, variables: V) => void
  onSettled?: (data: T | null, error: Error | null, variables: V) => void
}

interface UseMutationReturn<T, V> {
  mutate: (variables: V) => Promise<T | null>
  mutateAsync: (variables: V) => Promise<T>
  data: T | null
  error: Error | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  reset: () => void
}

export function useMutation<T, V = unknown>(
  mutationFn: (variables: V) => Promise<Response>,
  options: UseMutationOptions<T, V> = {}
): UseMutationReturn<T, V> {
  const { onSuccess, onError, onSettled } = options

  const [state, setState] = useState<{
    data: T | null
    error: Error | null
    isLoading: boolean
    isError: boolean
    isSuccess: boolean
  }>({
    data: null,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
  })

  const mutate = useCallback(async (variables: V): Promise<T | null> => {
    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }))

    try {
      const response = await mutationFn(variables)

      if (!response.ok) {
        throw new ApiRequestError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response.statusText
        )
      }

      const data = await response.json() as T

      setState({
        data,
        error: null,
        isLoading: false,
        isError: false,
        isSuccess: true,
      })

      onSuccess?.(data, variables)
      onSettled?.(data, null, variables)

      return data
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))

      setState({
        data: null,
        error: err,
        isLoading: false,
        isError: true,
        isSuccess: false,
      })

      onError?.(err, variables)
      onSettled?.(null, err, variables)

      return null
    }
  }, [mutationFn, onSuccess, onError, onSettled])

  const mutateAsync = useCallback(async (variables: V): Promise<T> => {
    const result = await mutate(variables)
    if (result === null && state.error) {
      throw state.error
    }
    return result as T
  }, [mutate, state.error])

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
    })
  }, [])

  return {
    ...state,
    mutate,
    mutateAsync,
    reset,
  }
}

/**
 * Get user-friendly error message
 */
export { getErrorMessage }
