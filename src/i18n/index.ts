import { createI18n } from 'vue-i18n'
import { watch } from 'vue'
import { useLocalStorageString } from '@/shared/composables'
import { appConfig } from '@/core/config/app.config'
import es from './locales/es.json'
import en from './locales/en.json'

export type MessageSchema = typeof es
export type Locale = 'es' | 'en'

// Get browser language or fallback to Spanish
const getBrowserLocale = (): Locale => {
  const browserLang = navigator.language.split('-')[0]
  return (['es', 'en'].includes(browserLang) ? browserLang : 'es') as Locale
}

// Use composable for locale persistence
const { data: persistedLocale } = useLocalStorageString(
  appConfig.localStorage.keys.locale,
  getBrowserLocale()
)

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: persistedLocale.value,
  fallbackLocale: appConfig.i18n.fallbackLocale,
  messages: {
    es,
    en
  },
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false
})

export default i18n

/**
 * Set application locale
 * Automatically persists to localStorage via composable
 */
export const setLocale = (locale: Locale) => {
  i18n.global.locale.value = locale
  persistedLocale.value = locale
  document.documentElement.lang = locale
}

/**
 * Get current locale
 */
export const getLocale = (): Locale => {
  return i18n.global.locale.value as Locale
}

// Watch for locale changes in composable (from other tabs/windows)
watch(persistedLocale, (newLocale) => {
  if (i18n.global.locale.value !== newLocale) {
    i18n.global.locale.value = newLocale
    document.documentElement.lang = newLocale
  }
})

// Set initial HTML lang attribute
document.documentElement.lang = i18n.global.locale.value
