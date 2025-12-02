<template>
  <div class="min-h-screen bg-[#F8F9FA] dark:bg-black transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <GitCompare class="w-10 h-10 mr-3 text-blue-600 dark:text-primary-400" />
          {{ $t('compare.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ comparison.length }} {{ $t('compare.subtitle') }}
        </p>
      </div>

      <!-- Empty State -->
      <div v-if="comparison.length === 0" class="text-center py-20">
        <GitCompare class="w-24 h-24 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
        <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
          {{ $t('compare.empty') }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          {{ $t('compare.emptyMessage') }}
        </p>
        <router-link
          to="/"
          class="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
        >
          <Globe class="w-5 h-5" />
          <span>{{ $t('nav.dashboard') }}</span>
        </router-link>
      </div>

      <!-- Comparison View -->
      <div v-else class="space-y-8">
        <!-- Action Buttons -->
        <div class="flex justify-end">
          <BaseButton
            variant="danger"
            size="md"
            @click="clearComparison"
          >
            <template #icon-left>
              <X class="w-4 h-4" />
            </template>
            {{ $t('compare.clearAll') }}
          </BaseButton>
        </div>

        <!-- Countries Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="country in comparison"
            :key="country.cca3"
            class="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md overflow-hidden relative group"
          >
            <BaseButton
              @click="removeFromComparison(country.cca3)"
              variant="danger"
              size="sm"
              rounded
              class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
            >
              <X class="w-4 h-4" />
            </BaseButton>

            <img
              :src="country.flags.svg"
              :alt="`Bandera de ${getCountryName(country)}`"
              class="w-full h-32 object-cover"
            />

            <div class="p-4">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                {{ getCountryName(country) }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ country.region }}</p>
            </div>
          </div>
        </div>

        <!-- Comparison Table -->
        <div class="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    {{ $t('countryCard.region') }}
                  </th>
                  <th
                    v-for="country in comparison"
                    :key="country.cca3"
                    class="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {{ getCountryName(country) }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    <div class="flex items-center space-x-2">
                      <MapPin class="w-4 h-4 text-blue-600" />
                      <span>{{ $t('countryCard.capital') }}</span>
                    </div>
                  </td>
                  <td
                    v-for="country in comparison"
                    :key="`capital-${country.cca3}`"
                    class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400"
                  >
                    {{ country.capital?.join(', ') || $t('countryCard.notAvailable') }}
                  </td>
                </tr>

                <tr class="bg-gray-50 dark:bg-[#1a1a1a]">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    <div class="flex items-center space-x-2">
                      <Users class="w-4 h-4 text-blue-600" />
                      <span>{{ $t('countryCard.population') }}</span>
                    </div>
                  </td>
                  <td
                    v-for="country in comparison"
                    :key="`pop-${country.cca3}`"
                    class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400"
                  >
                    {{ new Intl.NumberFormat('es-ES').format(country.population) }}
                  </td>
                </tr>

                <tr>
                  <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    <div class="flex items-center space-x-2">
                      <Maximize class="w-4 h-4 text-green-600" />
                      <span>{{ $t('countryCard.area') }} (km²)</span>
                    </div>
                  </td>
                  <td
                    v-for="country in comparison"
                    :key="`area-${country.cca3}`"
                    class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400"
                  >
                    {{ new Intl.NumberFormat('es-ES').format(country.area) }}
                  </td>
                </tr>

                <tr class="bg-gray-50 dark:bg-[#1a1a1a]">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    <div class="flex items-center space-x-2">
                      <Activity class="w-4 h-4 text-purple-600" />
                      <span>{{ $t('countryDetail.population') }}</span>
                    </div>
                  </td>
                  <td
                    v-for="country in comparison"
                    :key="`density-${country.cca3}`"
                    class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400"
                  >
                    {{ calculateDensity(country) }}
                  </td>
                </tr>

                <tr>
                  <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    <div class="flex items-center space-x-2">
                      <Globe2 class="w-4 h-4 text-blue-600" />
                      <span>{{ $t('countryCard.region') }}</span>
                    </div>
                  </td>
                  <td
                    v-for="country in comparison"
                    :key="`region-${country.cca3}`"
                    class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400"
                  >
                    {{ country.region }}
                  </td>
                </tr>

                <tr class="bg-gray-50 dark:bg-[#1a1a1a]">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    <div class="flex items-center space-x-2">
                      <Languages class="w-4 h-4 text-green-600" />
                      <span>{{ $t('countryCard.languages') }}</span>
                    </div>
                  </td>
                  <td
                    v-for="country in comparison"
                    :key="`lang-${country.cca3}`"
                    class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400"
                  >
                    {{ country.languages ? Object.values(country.languages).slice(0, 3).join(', ') : $t('countryCard.notAvailable') }}
                  </td>
                </tr>

                <tr>
                  <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    <div class="flex items-center space-x-2">
                      <DollarSign class="w-4 h-4 text-blue-600" />
                      <span>{{ $t('countryCard.currency') }}</span>
                    </div>
                  </td>
                  <td
                    v-for="country in comparison"
                    :key="`curr-${country.cca3}`"
                    class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400"
                  >
                    {{
                      country.currencies
                        ? Object.values(country.currencies)[0]?.name || $t('countryCard.notAvailable')
                        : $t('countryCard.notAvailable')
                    }}
                  </td>
                </tr>

                <tr class="bg-gray-50 dark:bg-[#1a1a1a]">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    <div class="flex items-center space-x-2">
                      <MapPinned class="w-4 h-4 text-green-600" />
                      <span>{{ $t('countryDetail.borders') }}</span>
                    </div>
                  </td>
                  <td
                    v-for="country in comparison"
                    :key="`borders-${country.cca3}`"
                    class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400"
                  >
                    {{ country.borders?.length || 0 }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Visual Comparison Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ $t('countryCard.population') }}</h3>
            <canvas ref="populationChartRef"></canvas>
          </div>

          <div class="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ $t('countryCard.area') }}</h3>
            <canvas ref="areaChartRef"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Chart, registerables } from 'chart.js'
import {
  GitCompare,
  Globe,
  X,
  MapPin,
  Users,
  Maximize,
  Activity,
  Globe2,
  Languages,
  DollarSign,
  MapPinned,
} from 'lucide-vue-next'
import { useFavoritesStore } from '@/stores/favorites'
import { useCountriesStore } from '@/stores/countries'
import { useThemeStore } from '@/stores/theme'
import { useCountryName } from '@/composables/useCountryName'
import type { Country } from '@/types/country'
import { BaseButton } from '@/components/ui'

Chart.register(...registerables)

const favoritesStore = useFavoritesStore()
const countriesStore = useCountriesStore()
const themeStore = useThemeStore()
const { comparison } = storeToRefs(favoritesStore)
const { countries } = storeToRefs(countriesStore)
const { isDark } = storeToRefs(themeStore)
const { clearComparison, removeFromComparison } = favoritesStore
const { getCountryName } = useCountryName()

const populationChartRef = ref<HTMLCanvasElement | null>(null)
const areaChartRef = ref<HTMLCanvasElement | null>(null)

let populationChart: Chart | null = null
let areaChart: Chart | null = null

const calculateDensity = (country: Country) => {
  const density = country.population / country.area
  return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(density)
}

const createCharts = () => {
  if (comparison.value.length === 0) return

  const textColor = isDark.value ? '#e5e7eb' : '#1f2937'
  const gridColor = isDark.value ? '#374151' : '#e5e7eb'

  // Population Chart
  if (populationChartRef.value) {
    const ctx = populationChartRef.value.getContext('2d')
    if (ctx) {
      populationChart?.destroy()
      populationChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: comparison.value.map(c => getCountryName(c)),
          datasets: [{
            label: 'Población',
            data: comparison.value.map(c => c.population),
            backgroundColor: ['#36A2EB', '#9966FF', '#FF6384', '#FF9F40'].slice(0, comparison.value.length),
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: textColor },
              grid: { color: gridColor },
            },
            x: {
              ticks: { color: textColor },
              grid: { color: gridColor },
            },
          },
        },
      })
    }
  }

  // Area Chart
  if (areaChartRef.value) {
    const ctx = areaChartRef.value.getContext('2d')
    if (ctx) {
      areaChart?.destroy()
      areaChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: comparison.value.map(c => getCountryName(c)),
          datasets: [{
            label: 'Área (km²)',
            data: comparison.value.map(c => c.area),
            backgroundColor: ['#36A2EB', '#9966FF', '#FF6384', '#FF9F40'].slice(0, comparison.value.length),
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: textColor },
              grid: { color: gridColor },
            },
            x: {
              ticks: { color: textColor },
              grid: { color: gridColor },
            },
          },
        },
      })
    }
  }
}

watch([comparison, isDark], () => {
  setTimeout(() => createCharts(), 100)
}, { deep: true })

onMounted(async () => {
  // Ensure countries are loaded
  if (countries.value.length === 0) {
    await countriesStore.fetchCountries()
  }

  setTimeout(() => {
    createCharts()
  }, 100)
})
</script>
