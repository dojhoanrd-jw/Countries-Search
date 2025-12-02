import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  const initTheme = () => {
    // Check saved preference
    const stored = localStorage.getItem('theme')
    if (stored) {
      isDark.value = stored === 'dark'
    } else {
      // Use system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  // Watch for system preference changes
  watch(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    (matches) => {
      const stored = localStorage.getItem('theme')
      if (!stored) {
        isDark.value = matches
        applyTheme()
      }
    }
  )

  return {
    isDark,
    initTheme,
    toggleTheme,
  }
})
