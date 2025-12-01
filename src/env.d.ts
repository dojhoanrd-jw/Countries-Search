/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string

  // Cache Configuration
  readonly VITE_CACHE_TTL_MINUTES: string

  // Retry Configuration
  readonly VITE_RETRY_ATTEMPTS: string
  readonly VITE_RETRY_DELAY: string

  // Feature Flags
  readonly VITE_ENABLE_ERROR_TRACKING: string
  readonly VITE_ENABLE_ANALYTICS: string

  // App Environment
  readonly VITE_APP_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Global constants defined in vite.config.ts
declare const __APP_ENV__: string
