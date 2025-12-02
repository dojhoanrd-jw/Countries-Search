/**
 * Application Configuration
 * Centralized configuration for the entire application
 */

export const appConfig = {
  app: {
    name: 'Countries Search',
    version: '1.0.0',
    description: 'Explore countries around the world',
  },

  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://restcountries.com/v3.1',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 15000,
    retryAttempts: parseInt(import.meta.env.VITE_RETRY_ATTEMPTS) || 3,
    retryDelay: parseInt(import.meta.env.VITE_RETRY_DELAY) || 1000,
  },

  cache: {
    ttlMinutes: parseInt(import.meta.env.VITE_CACHE_TTL_MINUTES) || 5,
  },

  pagination: {
    defaultItemsPerPage: 12,
    itemsPerPageOptions: [12, 24, 48, 96],
  },

  i18n: {
    defaultLocale: 'es',
    availableLocales: ['es', 'en'],
    fallbackLocale: 'es',
  },

  theme: {
    default: 'light',
    storageKey: 'theme-preference',
  },

  features: {
    maxComparisonItems: 4,
    maxFavorites: 100,
  },

  notifications: {
    duration: {
      success: 4000,
      error: 7000,
      warning: 5000,
      info: 5000,
    },
  },

  localStorage: {
    keys: {
      theme: 'theme',
      locale: 'locale',
      favorites: 'country-favorites',
      comparison: 'country-comparison',
    },
  },
} as const

export type AppConfig = typeof appConfig
