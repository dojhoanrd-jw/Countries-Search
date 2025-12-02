import { createI18n } from 'vue-i18n'
import es from './locales/es.json'
import en from './locales/en.json'

// Get browser language or fallback to Spanish
const getBrowserLocale = (): string => {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale) return savedLocale

  const browserLang = navigator.language.split('-')[0]
  return ['es', 'en'].includes(browserLang) ? browserLang : 'es'
}

export type MessageSchema = typeof es

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: getBrowserLocale(),
  fallbackLocale: 'es',
  messages: {
    es,
    en
  },
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false
})

export default i18n

// Helper to save locale preference
export const setLocale = (locale: 'es' | 'en') => {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.lang = locale
}

// Set initial HTML lang attribute
document.documentElement.lang = i18n.global.locale.value
