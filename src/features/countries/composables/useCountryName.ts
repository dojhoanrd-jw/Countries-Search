import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Country } from '@/core/types'

/**
 * Composable to get country name in current locale
 * Uses country.translations from API when available
 */
export function useCountryName() {
  const { locale } = useI18n()

  /**
   * Get country name in current locale
   * Falls back to common name if translation not available
   */
  const getCountryName = (country: Country): string => {
    if (!country || !country.name) {
      return ''
    }

    const currentLocale = locale.value

    // Map i18n locale to API translation codes
    const localeMap: Record<string, string> = {
      'es': 'spa',
      'en': 'eng'
    }

    const apiLocale = localeMap[currentLocale]

    // Try to get translation from API
    if (apiLocale && country.translations && country.translations[apiLocale]) {
      const translation = country.translations[apiLocale]
      if (translation && translation.common) {
        return translation.common
      }
    }

    // Fallback to common name (usually in English)
    return country.name.common || ''
  }

  /**
   * Get official country name in current locale
   */
  const getOfficialName = (country: Country): string => {
    if (!country || !country.name) {
      return ''
    }

    const currentLocale = locale.value

    const localeMap: Record<string, string> = {
      'es': 'spa',
      'en': 'eng'
    }

    const apiLocale = localeMap[currentLocale]

    if (apiLocale && country.translations && country.translations[apiLocale]) {
      const translation = country.translations[apiLocale]
      if (translation && translation.official) {
        return translation.official
      }
    }

    return country.name.official || ''
  }

  return {
    getCountryName,
    getOfficialName,
    locale: computed(() => locale.value)
  }
}
