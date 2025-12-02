import { httpClient } from './http-client'
import { API_ENDPOINTS, API_FIELDS, API_REGIONS } from '@/core/constants/api.constants'
import type { Country } from '@/core/types'

/**
 * Countries API Service
 * Uses the generic HTTP client for all requests
 */
export const countriesApi = {
  /**
   * Get all countries from all regions
   * Uses cache and supports request cancellation
   */
  async getAllCountries(): Promise<Country[]> {
    const promises = API_REGIONS.map(region =>
      httpClient.get<Country[]>(API_ENDPOINTS.COUNTRIES_BY_REGION(region), {
        cacheKey: `region-${region}`,
      })
    )

    const responses = await Promise.all(promises)
    return responses.flat()
  },

  /**
   * Get a single country by its code (alpha code)
   * Uses cache and supports request cancellation
   */
  async getCountryByCode(code: string): Promise<Country> {
    const countries = await httpClient.get<Country[]>(API_ENDPOINTS.COUNTRY_BY_CODE(code), {
      params: { fields: API_FIELDS },
      cacheKey: `country-${code}`,
    })
    return countries[0]
  },

  /**
   * Get all countries in a specific region
   * Uses cache and supports request cancellation
   */
  async getCountriesByRegion(region: string): Promise<Country[]> {
    return httpClient.get<Country[]>(API_ENDPOINTS.COUNTRIES_BY_REGION(region), {
      params: { fields: API_FIELDS },
      cacheKey: `region-${region}`,
    })
  },

  /**
   * Search countries by name
   * Uses less aggressive caching for search results
   * Supports request cancellation
   */
  async searchCountries(name: string): Promise<Country[]> {
    return httpClient.get<Country[]>(API_ENDPOINTS.SEARCH_BY_NAME(name), {
      params: { fields: API_FIELDS },
      cacheKey: `search-${name}`,
      useCache: false, // Don't cache search results
      retryAttempts: 2, // Less retries for search
    })
  },

  // ==================== UTILITY METHODS ====================

  /**
   * Clear all cached data
   */
  clearCache(): void {
    httpClient.clearCache()
  },

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(): void {
    httpClient.cancelAllRequests()
  },

  /**
   * Check if a specific cache key exists
   */
  isCached(key: string): boolean {
    return httpClient.isCached(key)
  },

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return httpClient.getCacheStats()
  },

  /**
   * Get abort controller statistics
   */
  getAbortStats() {
    return httpClient.getAbortStats()
  },
}

export default httpClient.getAxiosInstance()
