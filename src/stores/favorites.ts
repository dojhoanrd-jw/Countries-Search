import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Country } from '@/types/country'

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
      }
    }
  }

  // Save favorites to localStorage
  const saveFavorites = () => {
    localStorage.setItem('country-favorites', JSON.stringify(favorites.value))
  }

  const isFavorite = (countryCode: string) => {
    return favorites.value.some((c) => c.cca3 === countryCode)
  }

  const toggleFavorite = (country: Country) => {
    const index = favorites.value.findIndex((c) => c.cca3 === country.cca3)
    if (index >= 0) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(country)
    }
    saveFavorites()
  }

  const addToComparison = (country: Country) => {
    if (comparison.value.length < 4 && !isInComparison(country.cca3)) {
      comparison.value.push(country)
    }
  }

  const removeFromComparison = (countryCode: string) => {
    const index = comparison.value.findIndex((c) => c.cca3 === countryCode)
    if (index >= 0) {
      comparison.value.splice(index, 1)
    }
  }

  const isInComparison = (countryCode: string) => {
    return comparison.value.some((c) => c.cca3 === countryCode)
  }

  const clearComparison = () => {
    comparison.value = []
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
