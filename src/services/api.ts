import axios from 'axios'
import type { Country } from '@/types/country'

const API_BASE_URL = 'https://restcountries.com/v3.1'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

const FIELDS = 'name,cca2,cca3,capital,region,subregion,languages,currencies,population,area,flags,coatOfArms,maps,timezones,continents,borders,tld,latlng'

export const countriesApi = {
  async getAllCountries(): Promise<Country[]> {
    const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']
    const promises = regions.map(region =>
      api.get<Country[]>(`/region/${region}`)
    )

    const responses = await Promise.all(promises)
    const allCountries = responses.flatMap(response => response.data)

    return allCountries
  },

  async getCountryByCode(code: string): Promise<Country> {
    const response = await api.get<Country[]>(`/alpha/${code}`, {
      params: {
        fields: FIELDS
      }
    })
    return response.data[0]
  },

  async getCountriesByRegion(region: string): Promise<Country[]> {
    const response = await api.get<Country[]>(`/region/${region}`, {
      params: {
        fields: FIELDS
      }
    })
    return response.data
  },

  async searchCountries(name: string): Promise<Country[]> {
    const response = await api.get<Country[]>(`/name/${name}`, {
      params: {
        fields: FIELDS
      }
    })
    return response.data
  },
}

export default api
