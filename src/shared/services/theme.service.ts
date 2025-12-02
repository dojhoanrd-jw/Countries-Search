import { defineStore } from 'pinia'
import { computed, watch } from 'vue'
import { useLocalStorageString } from '@/shared/composables'
import { appConfig } from '@/core/config/app.config'

export const useThemeStore = defineStore('theme', () => {
  /**
   * Get system theme preference
   */
  function getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Use localStorage composable
  const { data: theme } = useLocalStorageString(
    appConfig.localStorage.keys.theme,
    getSystemTheme()
  )

  const isDark = computed(() => theme.value === 'dark')

  /**
   * Apply theme to DOM
   */
  function applyTheme() {
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  /**
   * Toggle between light and dark theme
   */
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  /**
   * Initialize theme on mount
   */
  function initTheme() {
    applyTheme()
  }

  // Watch for theme changes and apply
  watch(theme, () => {
    applyTheme()
  })

  // Watch for system preference changes (only if user hasn't set a preference)
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    // Only update if user hasn't manually set a theme
    const hasCustomTheme = localStorage.getItem(appConfig.localStorage.keys.theme)
    if (!hasCustomTheme) {
      theme.value = e.matches ? 'dark' : 'light'
    }
  })

  return {
    isDark,
    initTheme,
    toggleTheme,
  }
})
