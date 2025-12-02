import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { Country } from '@/core/types'
import { useNotificationsStore } from '@/shared/services'
import { useLocalStorage } from '@/shared/composables'
import { appConfig } from '@/core/config/app.config'

export const useFavoritesStore = defineStore('favorites', () => {
  const notifications = useNotificationsStore()

  // Use localStorage composable for automatic persistence
  const { data: favorites } = useLocalStorage<Country[]>(
    appConfig.localStorage.keys.favorites,
    [],
    {
      onError: (error) => {
        console.error('Error with favorites storage:', error)
        notifications.warning('Error al cargar/guardar favoritos')
      },
    }
  )

  const { data: comparison } = useLocalStorage<Country[]>(
    appConfig.localStorage.keys.comparison,
    [],
    {
      onError: (error) => {
        console.error('Error with comparison storage:', error)
        notifications.warning('Error al cargar/guardar comparación')
      },
    }
  )

  // Computed properties
  const favoritesCount = computed(() => favorites.value.length)
  const comparisonCount = computed(() => comparison.value.length)
  const canAddToComparison = computed(
    () => comparison.value.length < appConfig.features.maxComparisonItems
  )

  // Favorites methods
  const isFavorite = (countryCode: string) => {
    return favorites.value.some((c) => c.cca3 === countryCode)
  }

  const toggleFavorite = (country: Country) => {
    const index = favorites.value.findIndex((c) => c.cca3 === country.cca3)

    if (index >= 0) {
      favorites.value.splice(index, 1)
      notifications.info(`${country.name.common} eliminado de favoritos`)
    } else {
      // Check max favorites limit
      if (favorites.value.length >= appConfig.features.maxFavorites) {
        notifications.warning(`Límite de favoritos alcanzado (máximo ${appConfig.features.maxFavorites})`)
        return
      }

      favorites.value.push(country)
      notifications.success(`${country.name.common} agregado a favoritos`)
    }
  }

  // Comparison methods
  const addToComparison = (country: Country) => {
    if (!canAddToComparison.value) {
      notifications.warning(
        `Límite de comparación alcanzado (máximo ${appConfig.features.maxComparisonItems} países)`
      )
      return
    }

    if (isInComparison(country.cca3)) {
      notifications.info(`${country.name.common} ya está en la comparación`)
      return
    }

    comparison.value.push(country)
    notifications.success(`${country.name.common} agregado a la comparación`)
  }

  const removeFromComparison = (countryCode: string) => {
    const index = comparison.value.findIndex((c) => c.cca3 === countryCode)

    if (index >= 0) {
      const country = comparison.value[index]
      comparison.value.splice(index, 1)
      notifications.info(`${country.name.common} eliminado de la comparación`)
    }
  }

  const isInComparison = (countryCode: string) => {
    return comparison.value.some((c) => c.cca3 === countryCode)
  }

  const clearComparison = () => {
    const count = comparison.value.length

    if (count > 0) {
      comparison.value = []
      notifications.info(`Comparación limpiada (${count} países eliminados)`)
    }
  }

  return {
    favorites,
    comparison,
    favoritesCount,
    comparisonCount,
    canAddToComparison,
    isFavorite,
    toggleFavorite,
    addToComparison,
    removeFromComparison,
    isInComparison,
    clearComparison,
  }
})
