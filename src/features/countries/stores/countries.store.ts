import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Country, CountryFilters, CountryStats } from '@/core/types'
import { countriesApi, useNotificationsStore } from '@/shared/services'

export const useCountriesStore = defineStore('countries', () => {
  const countries = ref<Country[]>([])
  const loading = ref(false)
  const filters = ref<CountryFilters>({
    search: '',
    region: '',
    minPopulation: 0,
    maxPopulation: Infinity,
    language: '',
    currency: '',
  })
  const sortBy = ref<'name' | 'population' | 'area'>('name')
  const sortOrder = ref<'asc' | 'desc'>('asc')

  const filteredCountries = computed(() => {
    let result = [...countries.value]

    // Search by name or capital
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.common.toLowerCase().includes(search) ||
          c.capital?.some((cap) => cap.toLowerCase().includes(search))
      )
    }

    // Filter by region
    if (filters.value.region) {
      result = result.filter((c) => c.region === filters.value.region)
    }

    // Filter by population range
    result = result.filter(
      (c) =>
        c.population >= filters.value.minPopulation &&
        c.population <= filters.value.maxPopulation
    )

    // Filter by language
    if (filters.value.language) {
      result = result.filter((c) =>
        c.languages
          ? Object.values(c.languages).some((lang) =>
              lang.toLowerCase().includes(filters.value.language.toLowerCase())
            )
          : false
      )
    }

    // Filter by currency
    if (filters.value.currency) {
      result = result.filter((c) =>
        c.currencies
          ? Object.values(c.currencies).some((curr) =>
              curr.name.toLowerCase().includes(filters.value.currency.toLowerCase())
            )
          : false
      )
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy.value) {
        case 'name':
          comparison = a.name.common.localeCompare(b.name.common)
          break
        case 'population':
          comparison = a.population - b.population
          break
        case 'area':
          comparison = a.area - b.area
          break
      }
      return sortOrder.value === 'asc' ? comparison : -comparison
    })

    return result
  })

  const regions = computed(() => {
    return [...new Set(countries.value.map((c) => c.region))].sort()
  })

  const stats = computed<CountryStats>(() => {
    const totalCountries = countries.value.length
    const totalPopulation = countries.value.reduce((sum, c) => sum + c.population, 0)
    const averagePopulation = totalPopulation / totalCountries

    const sortedByArea = [...countries.value].sort((a, b) => b.area - a.area)
    const sortedByPopulation = [...countries.value].sort(
      (a, b) => b.population - a.population
    )

    const regionDistribution: Record<string, number> = {}
    const populationByRegion: Record<string, number> = {}

    countries.value.forEach((c) => {
      regionDistribution[c.region] = (regionDistribution[c.region] || 0) + 1
      populationByRegion[c.region] = (populationByRegion[c.region] || 0) + c.population
    })

    return {
      totalCountries,
      totalPopulation,
      averagePopulation,
      largestCountry: sortedByArea[0] || null,
      smallestCountry: sortedByArea[sortedByArea.length - 1] || null,
      mostPopulated: sortedByPopulation[0] || null,
      leastPopulated: sortedByPopulation[sortedByPopulation.length - 1] || null,
      regionDistribution,
      populationByRegion,
    }
  })

  async function fetchCountries() {
    const notifications = useNotificationsStore()
    loading.value = true

    try {
      countries.value = await countriesApi.getAllCountries()
      notifications.success(`${countries.value.length} países cargados correctamente`)
    } catch (e: any) {
      console.error('Error fetching countries:', e)

      // Determine specific error message
      let errorMessage = 'Error al cargar los países. Por favor, intenta de nuevo.'

      if (e.code === 'ECONNABORTED' || e.message?.includes('timeout')) {
        errorMessage = 'La solicitud tardó demasiado. Verifica tu conexión e intenta de nuevo.'
      } else if (e.response?.status === 404) {
        errorMessage = 'No se encontraron los datos de países. Por favor, contacta a soporte.'
      } else if (!navigator.onLine) {
        errorMessage = 'Sin conexión a internet. Por favor, verifica tu red.'
      } else if (e.response?.status >= 500) {
        errorMessage = 'Error del servidor. Por favor, intenta más tarde.'
      }

      notifications.error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters: Partial<CountryFilters>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters() {
    filters.value = {
      search: '',
      region: '',
      minPopulation: 0,
      maxPopulation: Infinity,
      language: '',
      currency: '',
    }
  }

  function setSorting(by: 'name' | 'population' | 'area', order: 'asc' | 'desc') {
    sortBy.value = by
    sortOrder.value = order
  }

  return {
    countries,
    loading,
    filters,
    sortBy,
    sortOrder,
    filteredCountries,
    regions,
    stats,
    fetchCountries,
    setFilters,
    resetFilters,
    setSorting,
  }
})
