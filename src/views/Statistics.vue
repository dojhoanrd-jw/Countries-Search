<template>
  <div class="min-h-screen bg-[#F8F9FA] dark:bg-black transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('statistics.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('statistics.subtitle', { count: stats.totalCountries }) }}
        </p>
      </div>

      <!-- Loading State -->
      <LoadingSpinner v-if="loading" />

      <!-- Stats Content -->
      <div v-else class="space-y-8">
        <!-- Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="stat-card glass-blue">
            <div class="flex items-center justify-between mb-4">
              <Globe class="w-8 h-8 text-blue-600 dark:text-primary-400" />
              <TrendingUp class="w-5 h-5 text-blue-600" />
            </div>
            <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{{ $t('statistics.cards.totalCountries') }}</h3>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalCountries }}</p>
          </div>

          <div class="stat-card glass-pink">
            <div class="flex items-center justify-between mb-4">
              <Users class="w-8 h-8 text-pink-600 dark:text-pink-400" />
              <TrendingUp class="w-5 h-5 text-pink-600" />
            </div>
            <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{{ $t('statistics.cards.totalPopulation') }}</h3>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ formatLargeNumber(stats.totalPopulation) }}
            </p>
          </div>

          <div class="stat-card glass-turquoise">
            <div class="flex items-center justify-between mb-4">
              <User class="w-8 h-8 text-teal-600 dark:text-teal-400" />
              <BarChart3 class="w-5 h-5 text-teal-600" />
            </div>
            <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{{ $t('countryCard.population') }}</h3>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ formatLargeNumber(Math.round(stats.averagePopulation)) }}
            </p>
          </div>

          <div class="stat-card glass-orange">
            <div class="flex items-center justify-between mb-4">
              <Globe2 class="w-8 h-8 text-orange-600 dark:text-orange-400" />
              <Activity class="w-5 h-5 text-orange-600" />
            </div>
            <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{{ $t('countryCard.region') }}</h3>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ Object.keys(stats.regionDistribution).length }}
            </p>
          </div>
        </div>

        <!-- Charts Row 1 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="chart-card">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {{ $t('statistics.charts.countriesByRegion') }}
            </h3>
            <canvas ref="regionChartRef"></canvas>
          </div>

          <div class="chart-card">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {{ $t('statistics.charts.populationByRegion') }}
            </h3>
            <canvas ref="populationChartRef"></canvas>
          </div>
        </div>

        <!-- Top Countries -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="chart-card">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Trophy class="w-6 h-6 mr-2 text-yellow-500" />
              {{ $t('statistics.charts.topByPopulation') }}
            </h3>
            <canvas ref="topPopulationChartRef"></canvas>
          </div>

          <div class="chart-card">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Maximize class="w-6 h-6 mr-2 text-green-500" />
              {{ $t('statistics.charts.topByArea') }}
            </h3>
            <canvas ref="topAreaChartRef"></canvas>
          </div>
        </div>

        <!-- Records Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-if="stats.mostPopulated" class="record-card glass-blue border-l-4 border-blue-500">
            <Crown class="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ $t('statistics.cards.mostPopulous') }}</h3>
            <p class="font-bold text-gray-900 dark:text-white mb-1">{{ getCountryName(stats.mostPopulated) }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatLargeNumber(stats.mostPopulated.population) }}
            </p>
          </div>

          <div v-if="stats.largestCountry" class="record-card glass-turquoise border-l-4 border-teal-500">
            <Expand class="w-8 h-8 text-teal-600 dark:text-teal-400 mb-3" />
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ $t('statistics.cards.largestCountry') }}</h3>
            <p class="font-bold text-gray-900 dark:text-white mb-1">{{ getCountryName(stats.largestCountry) }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatLargeNumber(stats.largestCountry.area) }} km²
            </p>
          </div>

          <div v-if="stats.leastPopulated" class="record-card glass-purple border-l-4 border-purple-500">
            <Users class="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ $t('countryCard.population') }}</h3>
            <p class="font-bold text-gray-900 dark:text-white mb-1">{{ getCountryName(stats.leastPopulated) }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatLargeNumber(stats.leastPopulated.population) }}
            </p>
          </div>

          <div v-if="stats.smallestCountry" class="record-card glass-pink border-l-4 border-pink-500">
            <Minimize class="w-8 h-8 text-pink-600 dark:text-pink-400 mb-3" />
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ $t('countryCard.area') }}</h3>
            <p class="font-bold text-gray-900 dark:text-white mb-1">{{ getCountryName(stats.smallestCountry) }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ formatLargeNumber(stats.smallestCountry.area) }} km²
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Chart, registerables } from 'chart.js'
import {
  Globe,
  Globe2,
  Users,
  User,
  TrendingUp,
  BarChart3,
  Activity,
  Trophy,
  Maximize,
  Crown,
  Expand,
  Minimize,
} from 'lucide-vue-next'
import { useCountriesStore } from '@/stores/countries'
import { useThemeStore } from '@/stores/theme'
import { useCountryName } from '@/composables/useCountryName'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

Chart.register(...registerables)

const countriesStore = useCountriesStore()
const themeStore = useThemeStore()
const { stats, loading, countries } = storeToRefs(countriesStore)
const { isDark } = storeToRefs(themeStore)
const { getCountryName } = useCountryName()

const regionChartRef = ref<HTMLCanvasElement | null>(null)
const populationChartRef = ref<HTMLCanvasElement | null>(null)
const topPopulationChartRef = ref<HTMLCanvasElement | null>(null)
const topAreaChartRef = ref<HTMLCanvasElement | null>(null)

let regionChart: Chart | null = null
let populationChart: Chart | null = null
let topPopulationChart: Chart | null = null
let topAreaChart: Chart | null = null

const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
  return num.toString()
}

const getChartColors = () => {
  const textColor = isDark.value ? '#e5e7eb' : '#1f2937'
  const gridColor = isDark.value ? '#374151' : '#e5e7eb'
  return { textColor, gridColor }
}

const createCharts = () => {
  const { textColor, gridColor } = getChartColors()

  // Region Distribution Chart
  if (regionChartRef.value && stats.value) {
    const ctx = regionChartRef.value.getContext('2d')
    if (ctx) {
      regionChart?.destroy()
      regionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(stats.value.regionDistribution),
          datasets: [{
            data: Object.values(stats.value.regionDistribution),
            backgroundColor: [
              '#36A2EB',  // Azul
              '#9966FF',  // Morado
              '#FF6384',  // Rosa
              '#FF9F40',  // Naranja
              '#4BC0C0',  // Turquesa
              '#004aad',  // Tu azul marca
            ],
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: textColor },
            },
          },
        },
      })
    }
  }

  // Population by Region Chart
  if (populationChartRef.value && stats.value) {
    const ctx = populationChartRef.value.getContext('2d')
    if (ctx) {
      populationChart?.destroy()
      populationChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(stats.value.populationByRegion),
          datasets: [{
            label: 'Población',
            data: Object.values(stats.value.populationByRegion),
            backgroundColor: '#36A2EB',
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

  // Top 10 Population Chart
  if (topPopulationChartRef.value && countries.value.length > 0) {
    const top10 = [...countries.value]
      .sort((a, b) => b.population - a.population)
      .slice(0, 10)

    const ctx = topPopulationChartRef.value.getContext('2d')
    if (ctx) {
      topPopulationChart?.destroy()
      topPopulationChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: top10.map(c => c.name.common),
          datasets: [{
            label: 'Población',
            data: top10.map(c => c.population),
            backgroundColor: '#9966FF',
          }],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: { color: textColor },
              grid: { color: gridColor },
            },
            y: {
              ticks: { color: textColor },
              grid: { color: gridColor },
            },
          },
        },
      })
    }
  }

  // Top 10 Area Chart
  if (topAreaChartRef.value && countries.value.length > 0) {
    const top10 = [...countries.value]
      .sort((a, b) => b.area - a.area)
      .slice(0, 10)

    const ctx = topAreaChartRef.value.getContext('2d')
    if (ctx) {
      topAreaChart?.destroy()
      topAreaChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: top10.map(c => c.name.common),
          datasets: [{
            label: 'Área (km²)',
            data: top10.map(c => c.area),
            backgroundColor: '#4BC0C0',
          }],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: { color: textColor },
              grid: { color: gridColor },
            },
            y: {
              ticks: { color: textColor },
              grid: { color: gridColor },
            },
          },
        },
      })
    }
  }
}

watch(isDark, () => {
  createCharts()
})

onMounted(async () => {
  if (countries.value.length === 0) {
    await countriesStore.fetchCountries()
  }

  setTimeout(() => {
    createCharts()
  }, 100)
})
</script>

<style scoped>
.stat-card {
  @apply rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-xl;
}

.chart-card {
  @apply rounded-lg shadow-md p-6 transition-all duration-300;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .chart-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.record-card {
  @apply rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-xl;
}
</style>
