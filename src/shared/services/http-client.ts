import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { appConfig } from '@/core/config/app.config'

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

class HttpCache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly TTL: number

  constructor(ttlMinutes: number) {
    this.TTL = ttlMinutes * 60 * 1000
  }

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

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

// ==================== REQUEST CONFIG ====================
export interface HttpRequestConfig<T = any> extends AxiosRequestConfig<T> {
  cacheKey?: string
  useCache?: boolean
  retryAttempts?: number
  retryDelay?: number
}

// ==================== HTTP CLIENT ====================
export class HttpClient {
  private axiosInstance: AxiosInstance
  private cache: HttpCache
  private abortControllers = new Map<string, AbortController>()
  private retryAttempts: number
  private retryDelay: number

  constructor(baseURL: string, timeout: number, cacheTTLMinutes: number, retryAttempts: number, retryDelay = 1000) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    this.cache = new HttpCache(cacheTTLMinutes)
    this.retryAttempts = retryAttempts
    this.retryDelay = retryDelay

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.metadata = {
          startTime: Date.now(),
        }
        return config
      },
      (error: AxiosError) => Promise.reject(error)
    )

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => Promise.reject(error)
    )
  }

  private getAbortController(key: string): AbortController {
    const prevController = this.abortControllers.get(key)
    if (prevController) {
      prevController.abort()
    }

    const controller = new AbortController()
    this.abortControllers.set(key, controller)
    return controller
  }

  private cleanupAbortController(key: string): void {
    this.abortControllers.delete(key)
  }

  private async fetchWithRetry<T>(
    fn: () => Promise<T>,
    retries: number,
    delay: number
  ): Promise<T> {
    try {
      return await fn()
    } catch (error) {
      const axiosError = error as AxiosError

      if (
        retries === 0 ||
        axiosError.code === 'ERR_CANCELED' ||
        (axiosError.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500)
      ) {
        throw error
      }

      await new Promise(resolve => setTimeout(resolve, delay))
      return this.fetchWithRetry(fn, retries - 1, delay * 2)
    }
  }

  /**
   * Generic GET request with cache, retry, and abort support
   */
  async get<T>(url: string, config: HttpRequestConfig = {}): Promise<T> {
    const {
      cacheKey = url,
      useCache = true,
      retryAttempts = this.retryAttempts,
      retryDelay = this.retryDelay,
      ...axiosConfig
    } = config

    // Check cache
    if (useCache) {
      const cached = this.cache.get<T>(cacheKey)
      if (cached) return cached
    }

    // Setup abort controller
    const controller = this.getAbortController(cacheKey)

    try {
      const data = await this.fetchWithRetry(
        async () => {
          const response = await this.axiosInstance.get<T>(url, {
            ...axiosConfig,
            signal: controller.signal,
          })
          return response.data
        },
        retryAttempts,
        retryDelay
      )

      // Cache result
      if (useCache) {
        this.cache.set(cacheKey, data)
      }

      this.cleanupAbortController(cacheKey)
      return data
    } catch (error) {
      this.cleanupAbortController(cacheKey)
      throw error
    }
  }

  /**
   * Generic POST request with retry and abort support
   */
  async post<T, D = any>(url: string, data?: D, config: HttpRequestConfig = {}): Promise<T> {
    const {
      cacheKey = url,
      retryAttempts = this.retryAttempts,
      retryDelay = this.retryDelay,
      ...axiosConfig
    } = config

    const controller = this.getAbortController(cacheKey)

    try {
      const result = await this.fetchWithRetry(
        async () => {
          const response = await this.axiosInstance.post<T>(url, data, {
            ...axiosConfig,
            signal: controller.signal,
          })
          return response.data
        },
        retryAttempts,
        retryDelay
      )

      this.cleanupAbortController(cacheKey)
      return result
    } catch (error) {
      this.cleanupAbortController(cacheKey)
      throw error
    }
  }

  /**
   * Generic PUT request with retry and abort support
   */
  async put<T, D = any>(url: string, data?: D, config: HttpRequestConfig = {}): Promise<T> {
    const {
      cacheKey = url,
      retryAttempts = this.retryAttempts,
      retryDelay = this.retryDelay,
      ...axiosConfig
    } = config

    const controller = this.getAbortController(cacheKey)

    try {
      const result = await this.fetchWithRetry(
        async () => {
          const response = await this.axiosInstance.put<T>(url, data, {
            ...axiosConfig,
            signal: controller.signal,
          })
          return response.data
        },
        retryAttempts,
        retryDelay
      )

      this.cleanupAbortController(cacheKey)
      return result
    } catch (error) {
      this.cleanupAbortController(cacheKey)
      throw error
    }
  }

  /**
   * Generic DELETE request with retry and abort support
   */
  async delete<T>(url: string, config: HttpRequestConfig = {}): Promise<T> {
    const {
      cacheKey = url,
      retryAttempts = this.retryAttempts,
      retryDelay = this.retryDelay,
      ...axiosConfig
    } = config

    const controller = this.getAbortController(cacheKey)

    try {
      const result = await this.fetchWithRetry(
        async () => {
          const response = await this.axiosInstance.delete<T>(url, {
            ...axiosConfig,
            signal: controller.signal,
          })
          return response.data
        },
        retryAttempts,
        retryDelay
      )

      this.cleanupAbortController(cacheKey)
      return result
    } catch (error) {
      this.cleanupAbortController(cacheKey)
      throw error
    }
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(): void {
    this.abortControllers.forEach((controller) => controller.abort())
    this.abortControllers.clear()
  }

  /**
   * Check if a specific cache key exists
   */
  isCached(key: string): boolean {
    return this.cache.has(key)
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cache.getStats()
  }

  /**
   * Get abort controller statistics
   */
  getAbortStats() {
    return {
      pendingRequests: this.abortControllers.size,
      keys: Array.from(this.abortControllers.keys()),
    }
  }

  /**
   * Get the underlying axios instance for advanced usage
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance
  }
}

// ==================== SINGLETON INSTANCE ====================
export const httpClient = new HttpClient(
  appConfig.api.baseUrl,
  appConfig.api.timeout,
  appConfig.cache.ttlMinutes,
  appConfig.api.retryAttempts,
  1000
)
