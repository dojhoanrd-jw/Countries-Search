/**
 * API Constants
 * Immutable constants for API interactions
 */

export const API_ENDPOINTS = {
  ALL_COUNTRIES: '/all',
  COUNTRY_BY_CODE: (code: string) => `/alpha/${code}`,
  COUNTRIES_BY_REGION: (region: string) => `/region/${region}`,
  SEARCH_BY_NAME: (name: string) => `/name/${name}`,
} as const

export const API_FIELDS = 'name,cca2,cca3,capital,region,subregion,languages,currencies,population,area,flags,coatOfArms,maps,timezones,continents,borders,tld,latlng,translations'

export const API_REGIONS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'] as const

export type ApiRegion = typeof API_REGIONS[number]
