import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCountriesStore } from './countries.store'
import { countriesApi } from '@/shared/services'
import type { Country } from '@/core/types'

// Mock the API
vi.mock('@/shared/services', async () => {
  const actual = await vi.importActual('@/shared/services')
  return {
    ...actual,
    countriesApi: {
      getAllCountries: vi.fn(),
    },
  }
})

// Mock data
const mockCountries: Country[] = [
  {
    cca3: 'USA',
    name: { common: 'United States', official: 'United States of America' },
    capital: ['Washington, D.C.'],
    region: 'Americas',
    subregion: 'North America',
    population: 331002651,
    area: 9372610,
    flags: { svg: 'https://flagcdn.com/us.svg', png: 'https://flagcdn.com/w320/us.png' },
    languages: { eng: 'English' },
    currencies: { USD: { name: 'United States dollar', symbol: '$' } },
    timezones: ['UTC-12:00'],
    borders: ['CAN', 'MEX'],
    latlng: [38, -97],
    maps: { googleMaps: 'https://goo.gl/maps/e8M246zY4BSjkjAv6' },
  },
  {
    cca3: 'CAN',
    name: { common: 'Canada', official: 'Canada' },
    capital: ['Ottawa'],
    region: 'Americas',
    subregion: 'North America',
    population: 37742154,
    area: 9984670,
    flags: { svg: 'https://flagcdn.com/ca.svg', png: 'https://flagcdn.com/w320/ca.png' },
    languages: { eng: 'English', fra: 'French' },
    currencies: { CAD: { name: 'Canadian dollar', symbol: '$' } },
    timezones: ['UTC-08:00'],
    borders: ['USA'],
    latlng: [60, -95],
    maps: { googleMaps: 'https://goo.gl/maps/rwBcqgt6B2U2q3fN9' },
  },
  {
    cca3: 'MEX',
    name: { common: 'Mexico', official: 'United Mexican States' },
    capital: ['Mexico City'],
    region: 'Americas',
    subregion: 'Central America',
    population: 128932753,
    area: 1964375,
    flags: { svg: 'https://flagcdn.com/mx.svg', png: 'https://flagcdn.com/w320/mx.png' },
    languages: { spa: 'Spanish' },
    currencies: { MXN: { name: 'Mexican peso', symbol: '$' } },
    timezones: ['UTC-08:00'],
    borders: ['BLZ', 'GTM', 'USA'],
    latlng: [23, -102],
    maps: { googleMaps: 'https://goo.gl/maps/s5g7imNPMDEePxzbA' },
  },
  {
    cca3: 'FRA',
    name: { common: 'France', official: 'French Republic' },
    capital: ['Paris'],
    region: 'Europe',
    subregion: 'Western Europe',
    population: 67391582,
    area: 551695,
    flags: { svg: 'https://flagcdn.com/fr.svg', png: 'https://flagcdn.com/w320/fr.png' },
    languages: { fra: 'French' },
    currencies: { EUR: { name: 'Euro', symbol: '€' } },
    timezones: ['UTC+01:00'],
    borders: ['AND', 'BEL', 'DEU', 'ITA', 'LUX', 'MCO', 'ESP', 'CHE'],
    latlng: [46, 2],
    maps: { googleMaps: 'https://goo.gl/maps/g7QxxSFsWyTPKuzd7' },
  },
]

describe('useCountriesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with empty state', () => {
      const store = useCountriesStore()

      expect(store.countries).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.filters).toEqual({
        search: '',
        region: '',
        minPopulation: 0,
        maxPopulation: Infinity,
        language: '',
        currency: '',
      })
      expect(store.sortBy).toBe('name')
      expect(store.sortOrder).toBe('asc')
    })
  })

  describe('Fetch Countries', () => {
    it('should fetch countries successfully', async () => {
      const store = useCountriesStore()
      vi.mocked(countriesApi.getAllCountries).mockResolvedValue(mockCountries)

      await store.fetchCountries()

      expect(store.countries).toHaveLength(4)
      expect(store.loading).toBe(false)
      expect(countriesApi.getAllCountries).toHaveBeenCalledTimes(1)
    })

    it('should set loading state during fetch', async () => {
      const store = useCountriesStore()
      vi.mocked(countriesApi.getAllCountries).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockCountries), 100)
          })
      )

      const fetchPromise = store.fetchCountries()
      expect(store.loading).toBe(true)

      await fetchPromise
      expect(store.loading).toBe(false)
    })

    it('should handle fetch errors', async () => {
      const store = useCountriesStore()
      vi.mocked(countriesApi.getAllCountries).mockRejectedValue(new Error('Network error'))

      await store.fetchCountries()

      expect(store.countries).toEqual([])
      expect(store.loading).toBe(false)
    })
  })

  describe('Filtering', () => {
    beforeEach(async () => {
      const store = useCountriesStore()
      vi.mocked(countriesApi.getAllCountries).mockResolvedValue(mockCountries)
      await store.fetchCountries()
    })

    it('should filter by search term', () => {
      const store = useCountriesStore()

      store.setFilters({ search: 'mexico' })

      expect(store.filteredCountries).toHaveLength(1)
      expect(store.filteredCountries[0].name.common).toBe('Mexico')
    })

    it('should filter by capital', () => {
      const store = useCountriesStore()

      store.setFilters({ search: 'paris' })

      expect(store.filteredCountries).toHaveLength(1)
      expect(store.filteredCountries[0].name.common).toBe('France')
    })

    it('should filter by region', () => {
      const store = useCountriesStore()

      store.setFilters({ region: 'Europe' })

      expect(store.filteredCountries).toHaveLength(1)
      expect(store.filteredCountries[0].name.common).toBe('France')
    })

    it('should filter by population range', () => {
      const store = useCountriesStore()

      store.setFilters({ minPopulation: 100000000, maxPopulation: 400000000 })

      expect(store.filteredCountries).toHaveLength(2) // USA and Mexico
      expect(store.filteredCountries.map((c) => c.cca3)).toContain('USA')
      expect(store.filteredCountries.map((c) => c.cca3)).toContain('MEX')
    })

    it('should filter by language', () => {
      const store = useCountriesStore()

      store.setFilters({ language: 'French' })

      expect(store.filteredCountries).toHaveLength(2) // Canada and France
      expect(store.filteredCountries.map((c) => c.cca3)).toContain('CAN')
      expect(store.filteredCountries.map((c) => c.cca3)).toContain('FRA')
    })

    it('should filter by currency', () => {
      const store = useCountriesStore()

      store.setFilters({ currency: 'dollar' })

      expect(store.filteredCountries).toHaveLength(2) // USA and Canada
      expect(store.filteredCountries.map((c) => c.cca3)).toContain('USA')
      expect(store.filteredCountries.map((c) => c.cca3)).toContain('CAN')
    })

    it('should combine multiple filters', () => {
      const store = useCountriesStore()

      store.setFilters({
        region: 'Americas',
        language: 'English',
      })

      expect(store.filteredCountries).toHaveLength(2) // USA and Canada
    })

    it('should reset filters', () => {
      const store = useCountriesStore()

      store.setFilters({ search: 'test', region: 'Europe' })
      store.resetFilters()

      expect(store.filters).toEqual({
        search: '',
        region: '',
        minPopulation: 0,
        maxPopulation: Infinity,
        language: '',
        currency: '',
      })
    })
  })

  describe('Sorting', () => {
    beforeEach(async () => {
      const store = useCountriesStore()
      vi.mocked(countriesApi.getAllCountries).mockResolvedValue(mockCountries)
      await store.fetchCountries()
    })

    it('should sort by name ascending', () => {
      const store = useCountriesStore()

      store.setSorting('name', 'asc')

      const names = store.filteredCountries.map((c) => c.name.common)
      expect(names).toEqual(['Canada', 'France', 'Mexico', 'United States'])
    })

    it('should sort by name descending', () => {
      const store = useCountriesStore()

      store.setSorting('name', 'desc')

      const names = store.filteredCountries.map((c) => c.name.common)
      expect(names).toEqual(['United States', 'Mexico', 'France', 'Canada'])
    })

    it('should sort by population ascending', () => {
      const store = useCountriesStore()

      store.setSorting('population', 'asc')

      const populations = store.filteredCountries.map((c) => c.population)
      expect(populations[0]).toBe(37742154) // Canada (smallest)
      expect(populations[populations.length - 1]).toBe(331002651) // USA (largest)
    })

    it('should sort by population descending', () => {
      const store = useCountriesStore()

      store.setSorting('population', 'desc')

      const populations = store.filteredCountries.map((c) => c.population)
      expect(populations[0]).toBe(331002651) // USA (largest)
      expect(populations[populations.length - 1]).toBe(37742154) // Canada (smallest)
    })

    it('should sort by area', () => {
      const store = useCountriesStore()

      store.setSorting('area', 'desc')

      const areas = store.filteredCountries.map((c) => c.area)
      expect(areas[0]).toBe(9984670) // Canada (largest)
    })
  })

  describe('Computed Properties', () => {
    beforeEach(async () => {
      const store = useCountriesStore()
      vi.mocked(countriesApi.getAllCountries).mockResolvedValue(mockCountries)
      await store.fetchCountries()
    })

    it('should compute regions', () => {
      const store = useCountriesStore()

      expect(store.regions).toEqual(['Americas', 'Europe'])
    })

    it('should compute statistics', () => {
      const store = useCountriesStore()

      expect(store.stats.totalCountries).toBe(4)
      expect(store.stats.totalPopulation).toBe(
        331002651 + 37742154 + 128932753 + 67391582
      )
      expect(store.stats.largestCountry?.cca3).toBe('CAN')
      expect(store.stats.smallestCountry?.cca3).toBe('FRA')
      expect(store.stats.mostPopulated?.cca3).toBe('USA')
      expect(store.stats.leastPopulated?.cca3).toBe('CAN')
    })

    it('should compute region distribution', () => {
      const store = useCountriesStore()

      expect(store.stats.regionDistribution).toEqual({
        Americas: 3,
        Europe: 1,
      })
    })

    it('should compute population by region', () => {
      const store = useCountriesStore()

      expect(store.stats.populationByRegion['Americas']).toBe(
        331002651 + 37742154 + 128932753
      )
      expect(store.stats.populationByRegion['Europe']).toBe(67391582)
    })
  })
})
