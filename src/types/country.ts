export interface Country {
  name: {
    common: string
    official: string
    nativeName?: Record<string, { official: string; common: string }>
  }
  cca2: string
  cca3: string
  capital?: string[]
  region: string
  subregion?: string
  languages?: Record<string, string>
  currencies?: Record<string, { name: string; symbol: string }>
  population: number
  area: number
  flags: {
    png: string
    svg: string
    alt?: string
  }
  coatOfArms?: {
    png?: string
    svg?: string
  }
  maps: {
    googleMaps: string
    openStreetMaps: string
  }
  timezones?: string[]
  continents?: string[]
  borders?: string[]
  tld?: string[]
  latlng?: number[]
  translations?: Record<string, { common: string; official: string }>
}

export interface CountryFilters {
  search: string
  region: string
  minPopulation: number
  maxPopulation: number
  language: string
  currency: string
}

export interface CountryStats {
  totalCountries: number
  totalPopulation: number
  averagePopulation: number
  largestCountry: Country | null
  smallestCountry: Country | null
  mostPopulated: Country | null
  leastPopulated: Country | null
  regionDistribution: Record<string, number>
  populationByRegion: Record<string, number>
}
