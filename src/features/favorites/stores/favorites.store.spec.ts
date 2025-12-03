import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFavoritesStore } from './favorites.store'
import { useNotificationsStore } from '@/shared/services'
import type { Country } from '@/core/types'

// Mock data
const mockCountry1: Country = {
  cca3: 'USA',
  name: {
    common: 'United States',
    official: 'United States of America',
  },
  capital: ['Washington, D.C.'],
  region: 'Americas',
  subregion: 'North America',
  population: 331002651,
  area: 9372610,
  flags: {
    svg: 'https://flagcdn.com/us.svg',
    png: 'https://flagcdn.com/w320/us.png',
  },
  languages: { eng: 'English' },
  currencies: { USD: { name: 'United States dollar', symbol: '$' } },
  timezones: ['UTC-12:00', 'UTC-11:00', 'UTC-10:00'],
  borders: ['CAN', 'MEX'],
  latlng: [38, -97],
  maps: { googleMaps: 'https://goo.gl/maps/e8M246zY4BSjkjAv6' },
}

const mockCountry2: Country = {
  cca3: 'CAN',
  name: {
    common: 'Canada',
    official: 'Canada',
  },
  capital: ['Ottawa'],
  region: 'Americas',
  subregion: 'North America',
  population: 37742154,
  area: 9984670,
  flags: {
    svg: 'https://flagcdn.com/ca.svg',
    png: 'https://flagcdn.com/w320/ca.png',
  },
  languages: { eng: 'English', fra: 'French' },
  currencies: { CAD: { name: 'Canadian dollar', symbol: '$' } },
  timezones: ['UTC-08:00', 'UTC-07:00', 'UTC-06:00'],
  borders: ['USA'],
  latlng: [60, -95],
  maps: { googleMaps: 'https://goo.gl/maps/rwBcqgt6B2U2q3fN9' },
}

const mockCountry3: Country = {
  cca3: 'MEX',
  name: {
    common: 'Mexico',
    official: 'United Mexican States',
  },
  capital: ['Mexico City'],
  region: 'Americas',
  subregion: 'North America',
  population: 128932753,
  area: 1964375,
  flags: {
    svg: 'https://flagcdn.com/mx.svg',
    png: 'https://flagcdn.com/w320/mx.png',
  },
  languages: { spa: 'Spanish' },
  currencies: { MXN: { name: 'Mexican peso', symbol: '$' } },
  timezones: ['UTC-08:00', 'UTC-07:00', 'UTC-06:00'],
  borders: ['BLZ', 'GTM', 'USA'],
  latlng: [23, -102],
  maps: { googleMaps: 'https://goo.gl/maps/s5g7imNPMDEePxzbA' },
}

describe('useFavoritesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should initialize with empty favorites and comparison', () => {
      const store = useFavoritesStore()

      expect(store.favorites).toEqual([])
      expect(store.comparison).toEqual([])
      expect(store.favoritesCount).toBe(0)
      expect(store.comparisonCount).toBe(0)
      expect(store.canAddToComparison).toBe(true)
    })
  })

  describe('Favorites', () => {
    it('should add country to favorites', () => {
      const store = useFavoritesStore()
      const notifications = useNotificationsStore()
      const notifySpy = vi.spyOn(notifications, 'success')

      store.toggleFavorite(mockCountry1)

      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0].cca3).toBe('USA')
      expect(store.favoritesCount).toBe(1)
      expect(notifySpy).toHaveBeenCalledWith(expect.stringContaining('United States'))
    })

    it('should remove country from favorites', () => {
      const store = useFavoritesStore()
      const notifications = useNotificationsStore()
      const notifySpy = vi.spyOn(notifications, 'info')

      store.toggleFavorite(mockCountry1)
      expect(store.favorites).toHaveLength(1)

      store.toggleFavorite(mockCountry1)

      expect(store.favorites).toHaveLength(0)
      expect(store.favoritesCount).toBe(0)
      expect(notifySpy).toHaveBeenCalledWith(expect.stringContaining('eliminado'))
    })

    it('should check if country is favorite', () => {
      const store = useFavoritesStore()

      expect(store.isFavorite('USA')).toBe(false)

      store.toggleFavorite(mockCountry1)

      expect(store.isFavorite('USA')).toBe(true)
    })

    it('should enforce max favorites limit', () => {
      const store = useFavoritesStore()
      const notifications = useNotificationsStore()
      const warnSpy = vi.spyOn(notifications, 'warning')

      // Add countries up to the limit (default is 100 in appConfig)
      // For testing, we'll mock a smaller limit by directly setting favorites
      store.favorites = Array.from({ length: 100 }, (_, i) => ({
        ...mockCountry1,
        cca3: `C${i}`,
        name: { common: `Country ${i}`, official: `Country ${i}` },
      }))

      store.toggleFavorite(mockCountry2)

      expect(store.favorites).toHaveLength(100) // Should not add
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Límite de favoritos'))
    })
  })

  describe('Comparison', () => {
    it('should add country to comparison', () => {
      const store = useFavoritesStore()
      const notifications = useNotificationsStore()
      const notifySpy = vi.spyOn(notifications, 'success')

      store.addToComparison(mockCountry1)

      expect(store.comparison).toHaveLength(1)
      expect(store.comparison[0].cca3).toBe('USA')
      expect(store.comparisonCount).toBe(1)
      expect(notifySpy).toHaveBeenCalledWith(expect.stringContaining('United States'))
    })

    it('should remove country from comparison', () => {
      const store = useFavoritesStore()
      const notifications = useNotificationsStore()
      const notifySpy = vi.spyOn(notifications, 'info')

      store.addToComparison(mockCountry1)
      expect(store.comparison).toHaveLength(1)

      store.removeFromComparison('USA')

      expect(store.comparison).toHaveLength(0)
      expect(store.comparisonCount).toBe(0)
      expect(notifySpy).toHaveBeenCalledWith(expect.stringContaining('eliminado'))
    })

    it('should check if country is in comparison', () => {
      const store = useFavoritesStore()

      expect(store.isInComparison('USA')).toBe(false)

      store.addToComparison(mockCountry1)

      expect(store.isInComparison('USA')).toBe(true)
    })

    it('should prevent adding duplicate countries to comparison', () => {
      const store = useFavoritesStore()
      const notifications = useNotificationsStore()
      const notifySpy = vi.spyOn(notifications, 'info')

      store.addToComparison(mockCountry1)
      store.addToComparison(mockCountry1)

      expect(store.comparison).toHaveLength(1)
      expect(notifySpy).toHaveBeenCalledWith(expect.stringContaining('ya está'))
    })

    it('should enforce max comparison limit', () => {
      const store = useFavoritesStore()
      const notifications = useNotificationsStore()
      const warnSpy = vi.spyOn(notifications, 'warning')

      // Add countries up to the limit (default is 4 in appConfig)
      store.addToComparison(mockCountry1)
      store.addToComparison(mockCountry2)
      store.addToComparison(mockCountry3)
      store.addToComparison({
        ...mockCountry1,
        cca3: 'BRA',
        name: { common: 'Brazil', official: 'Brazil' },
      })

      expect(store.comparison).toHaveLength(4)
      expect(store.canAddToComparison).toBe(false)

      store.addToComparison({
        ...mockCountry1,
        cca3: 'ARG',
        name: { common: 'Argentina', official: 'Argentina' },
      })

      expect(store.comparison).toHaveLength(4) // Should not add
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Límite de comparación'))
    })

    it('should clear all countries from comparison', () => {
      const store = useFavoritesStore()
      const notifications = useNotificationsStore()
      const notifySpy = vi.spyOn(notifications, 'info')

      store.addToComparison(mockCountry1)
      store.addToComparison(mockCountry2)
      store.addToComparison(mockCountry3)

      expect(store.comparison).toHaveLength(3)

      store.clearComparison()

      expect(store.comparison).toHaveLength(0)
      expect(store.comparisonCount).toBe(0)
      expect(notifySpy).toHaveBeenCalledWith(expect.stringContaining('3 países eliminados'))
    })

    it('should not notify when clearing empty comparison', () => {
      const store = useFavoritesStore()
      const notifications = useNotificationsStore()
      const notifySpy = vi.spyOn(notifications, 'info')

      store.clearComparison()

      expect(notifySpy).not.toHaveBeenCalled()
    })
  })

  describe('Persistence', () => {
    it('should persist favorites to localStorage', async () => {
      const store = useFavoritesStore()

      store.toggleFavorite(mockCountry1)

      // Wait for watch to trigger
      await new Promise((resolve) => setTimeout(resolve, 10))

      const stored = localStorage.getItem('country-favorites')
      expect(stored).toBeTruthy()
      expect(JSON.parse(stored!)).toHaveLength(1)
    })

    it('should persist comparison to localStorage', async () => {
      const store = useFavoritesStore()

      store.addToComparison(mockCountry1)

      // Wait for watch to trigger
      await new Promise((resolve) => setTimeout(resolve, 10))

      const stored = localStorage.getItem('country-comparison')
      expect(stored).toBeTruthy()
      expect(JSON.parse(stored!)).toHaveLength(1)
    })

    it('should load favorites from localStorage on init', () => {
      const mockData = [mockCountry1, mockCountry2]
      localStorage.setItem('country-favorites', JSON.stringify(mockData))

      const store = useFavoritesStore()

      expect(store.favorites).toHaveLength(2)
      expect(store.favorites[0].cca3).toBe('USA')
      expect(store.favorites[1].cca3).toBe('CAN')
    })

    it('should load comparison from localStorage on init', () => {
      const mockData = [mockCountry1]
      localStorage.setItem('country-comparison', JSON.stringify(mockData))

      const store = useFavoritesStore()

      expect(store.comparison).toHaveLength(1)
      expect(store.comparison[0].cca3).toBe('USA')
    })
  })
})
