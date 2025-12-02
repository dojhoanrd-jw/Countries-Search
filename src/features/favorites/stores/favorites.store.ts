import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Country } from '@/core/types'
import { useNotificationsStore } from '@/shared/services'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<Country[]>([])
  const comparison = ref<Country[]>([])

  // Load favorites from localStorage
  const loadFavorites = () => {
    const stored = localStorage.getItem('country-favorites')
    if (stored) {
      try {
        favorites.value = JSON.parse(stored)
      } catch (e) {
        console.error('Error loading favorites:', e)
        const notifications = useNotificationsStore()
        notifications.warning('No se pudieron cargar los favoritos guardados')
      }
    }
  }

  // Save favorites to localStorage
  const saveFavorites = () => {
    try {
      localStorage.setItem('country-favorites', JSON.stringify(favorites.value))
    } catch (e) {
      console.error('Error saving favorites:', e)
      const notifications = useNotificationsStore()
      notifications.error('Error al guardar favoritos. El almacenamiento puede estar lleno.')
    }
  }

  const isFavorite = (countryCode: string) => {
    return favorites.value.some((c) => c.cca3 === countryCode)
  }

  const toggleFavorite = (country: Country) => {
    const notifications = useNotificationsStore()
    const index = favorites.value.findIndex((c) => c.cca3 === country.cca3)

    if (index >= 0) {
      favorites.value.splice(index, 1)
      notifications.info(`${country.name.common} eliminado de favoritos`)
    } else {
      favorites.value.push(country)
      notifications.success(`${country.name.common} agregado a favoritos`)
    }
    saveFavorites()
  }

  const addToComparison = (country: Country) => {
    const notifications = useNotificationsStore()

    if (comparison.value.length >= 4) {
      notifications.warning('Límite de comparación alcanzado (máximo 4 países)')
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
    const notifications = useNotificationsStore()
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
    const notifications = useNotificationsStore()
    const count = comparison.value.length

    if (count > 0) {
      comparison.value = []
      notifications.info(`Comparación limpiada (${count} países eliminados)`)
    }
  }

  const favoritesCount = computed(() => favorites.value.length)
  const comparisonCount = computed(() => comparison.value.length)
  const canAddToComparison = computed(() => comparison.value.length < 4)

  // Initialize
  loadFavorites()

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
