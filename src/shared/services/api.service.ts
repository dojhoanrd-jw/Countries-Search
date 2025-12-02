import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import type { Country } from '@/core/types'

// Environment variables with fallback defaults
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://restcountries.com/v3.1'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 15000
const CACHE_TTL_MINUTES = parseInt(import.meta.env.VITE_CACHE_TTL_MINUTES) || 5
const RETRY_ATTEMPTS = parseInt(import.meta.env.VITE_RETRY_ATTEMPTS) || 3
const RETRY_DELAY = parseInt(import.meta.env.VITE_RETRY_DELAY) || 1000

// API Fields (hardcoded - business logic, not configuration)
const FIELDS = 'name,cca2,cca3,capital,region,subregion,languages,currencies,population,area,flags,coatOfArms,maps,timezones,continents,borders,tld,latlng'

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number
    }
  }
}

// ==================== CACHE SYSTEM ====================
interface CacheEntry<T> {
  data: T
  timestamp: number
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly TTL = CACHE_TTL_MINUTES * 60 * 1000 // From env variable

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  clear(): void {
    this.cache.clear()
  }

  has(key: string): boolean {
    return this.cache.has(key) && this.get(key) !== null
  }
}

const apiCache = new ApiCache()

// ==================== ABORT CONTROLLERS ====================
const abortControllers = new Map<string, AbortController>()

function getAbortController(key: string): AbortController {
  // Cancel previous request if exists
  const prevController = abortControllers.get(key)
  if (prevController) {
    prevController.abort()
  }

  // Create new controller
  const controller = new AbortController()
  abortControllers.set(key, controller)
  return controller
}

function cleanupAbortController(key: string): void {
  abortControllers.delete(key)
}

// ==================== RETRY LOGIC ====================
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
  requestKey?: string
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    const axiosError = error as AxiosError

    // Don't retry if:
    // 1. No retries left
    // 2. Request was manually cancelled
    // 3. Client error (4xx)
    if (
      retries === 0 ||
      axiosError.code === 'ERR_CANCELED' ||
      (axiosError.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500)
    ) {
      throw error
    }

    // Only retry on network errors or server errors (5xx)
    await new Promise(resolve => setTimeout(resolve, delay))

    // Exponential backoff
    return fetchWithRetry(fn, retries - 1, delay * 2, requestKey)
  }
}

// ==================== AXIOS INSTANCE ====================
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// ==================== REQUEST INTERCEPTOR ====================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add request timestamp for performance tracking
    config.metadata = {
      startTime: Date.now(),
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// ==================== RESPONSE INTERCEPTOR ====================
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    // Silent error handling - errors are handled in stores
    return Promise.reject(error)
  }
)

// ==================== API SERVICE ====================
export const countriesApi = {
  /**
   * Get all countries from all regions
   * Uses cache and supports request cancellation
   */
  async getAllCountries(): Promise<Country[]> {
    const cacheKey = 'all-countries'

    // Check cache first
    const cached = apiCache.get<Country[]>(cacheKey)
    if (cached) {
      return cached
    }

    // Setup request cancellation
    const controller = getAbortController(cacheKey)

    try {
      // Fetch with retry logic
      const data = await fetchWithRetry(
        async () => {
          const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']
          const promises = regions.map(region =>
            api.get<Country[]>(`/region/${region}`, {
              signal: controller.signal,
            })
          )

          const responses = await Promise.all(promises)
          return responses.flatMap(response => response.data)
        },
        RETRY_ATTEMPTS,
        RETRY_DELAY,
        cacheKey
      )

      // Cache the result
      apiCache.set(cacheKey, data)
      cleanupAbortController(cacheKey)

      return data
    } catch (error) {
      cleanupAbortController(cacheKey)
      throw error
    }
  },

  /**
   * Get a single country by its code (alpha code)
   * Uses cache and supports request cancellation
   */
  async getCountryByCode(code: string): Promise<Country> {
    const cacheKey = `country-${code}`

    // Check cache first
    const cached = apiCache.get<Country>(cacheKey)
    if (cached) {
      return cached
    }

    // Setup request cancellation
    const controller = getAbortController(cacheKey)

    try {
      // Fetch with retry logic
      const data = await fetchWithRetry(
        async () => {
          const response = await api.get<Country[]>(`/alpha/${code}`, {
            params: { fields: FIELDS },
            signal: controller.signal,
          })
          return response.data[0]
        },
        RETRY_ATTEMPTS,
        RETRY_DELAY,
        cacheKey
      )

      // Cache the result
      apiCache.set(cacheKey, data)
      cleanupAbortController(cacheKey)

      return data
    } catch (error) {
      cleanupAbortController(cacheKey)
      throw error
    }
  },

  /**
   * Get all countries in a specific region
   * Uses cache and supports request cancellation
   */
  async getCountriesByRegion(region: string): Promise<Country[]> {
    const cacheKey = `region-${region}`

    // Check cache first
    const cached = apiCache.get<Country[]>(cacheKey)
    if (cached) {
      return cached
    }

    // Setup request cancellation
    const controller = getAbortController(cacheKey)

    try {
      // Fetch with retry logic
      const data = await fetchWithRetry(
        async () => {
          const response = await api.get<Country[]>(`/region/${region}`, {
            params: { fields: FIELDS },
            signal: controller.signal,
          })
          return response.data
        },
        RETRY_ATTEMPTS,
        RETRY_DELAY,
        cacheKey
      )

      // Cache the result
      apiCache.set(cacheKey, data)
      cleanupAbortController(cacheKey)

      return data
    } catch (error) {
      cleanupAbortController(cacheKey)
      throw error
    }
  },

  /**
   * Search countries by name
   * No cache (search results change frequently)
   * Supports request cancellation
   */
  async searchCountries(name: string): Promise<Country[]> {
    const cacheKey = `search-${name}`

    // Setup request cancellation
    const controller = getAbortController(cacheKey)

    try {
      // Fetch with retry logic (no cache for search)
      const data = await fetchWithRetry(
        async () => {
          const response = await api.get<Country[]>(`/name/${name}`, {
            params: { fields: FIELDS },
            signal: controller.signal,
          })
          return response.data
        },
        2, // Less retries for search (hardcoded)
        RETRY_DELAY / 2, // Half delay for search
        cacheKey
      )

      cleanupAbortController(cacheKey)
      return data
    } catch (error) {
      cleanupAbortController(cacheKey)
      throw error
    }
  },

  // ==================== UTILITY METHODS ====================

  /**
   * Clear all cached data
   */
  clearCache(): void {
    apiCache.clear()
  },

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(): void {
    abortControllers.forEach((controller) => {
      controller.abort()
    })
    abortControllers.clear()
  },

  /**
   * Check if a specific cache key exists
   */
  isCached(key: string): boolean {
    return apiCache.has(key)
  },

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: abortControllers.size,
      keys: Array.from(abortControllers.keys()),
    }
  },
}

export default api
