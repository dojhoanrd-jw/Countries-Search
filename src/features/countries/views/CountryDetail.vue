<template>
  <div class="min-h-screen bg-[#F8F9FA] dark:bg-black transition-colors duration-300">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Back Button -->
      <BaseButton
        variant="ghost"
        size="md"
        @click="router.back()"
        class="mb-6"
      >
        <template #icon-left>
          <ArrowLeft class="w-5 h-5" />
        </template>
        {{ $t('countryDetail.backToExplorer') }}
      </BaseButton>

      <LoadingSpinner v-if="loading" />

      <div v-else-if="country" class="space-y-8 animate-fade-in">
        <!-- Header -->
        <div class="glass-card rounded-lg shadow-lg overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <!-- Flag -->
            <div class="relative h-64 lg:h-auto">
              <img
                :src="country.flags.svg"
                :alt="country.flags.alt || `Bandera de ${countryName}`"
                class="w-full h-full object-cover"
              />
              <div class="absolute top-4 right-4 flex space-x-2">
                <BaseButton
                  variant="ghost"
                  size="md"
                  rounded
                  @click="toggleFavorite"
                  class="bg-white/90 dark:bg-[#1a1a1a]/90 hover:bg-white dark:hover:bg-gray-800 shadow-lg"
                >
                  <Heart
                    class="w-6 h-6"
                    :class="isFavorite ? 'text-red-500' : 'text-gray-400'"
                    :fill="isFavorite ? 'currentColor' : 'none'"
                  />
                </BaseButton>
                <BaseButton
                  v-if="!isInComparison && canAddToComparison"
                  variant="ghost"
                  size="md"
                  rounded
                  @click="addToComparison"
                  class="bg-white/90 dark:bg-[#1a1a1a]/90 hover:bg-white dark:hover:bg-gray-800 shadow-lg"
                >
                  <GitCompare class="w-6 h-6" />
                </BaseButton>
              </div>
            </div>

            <!-- Main Info -->
            <div class="p-8">
              <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {{ countryName }}
              </h1>
              <p class="text-xl text-gray-600 dark:text-gray-400 mb-6">
                {{ officialName }}
              </p>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('countryDetail.region') }}</p>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ country.region }}</p>
                </div>
                <div v-if="country.subregion">
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('countryDetail.subregion') }}</p>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ country.subregion }}</p>
                </div>
                <div v-if="country.capital">
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('countryDetail.capital') }}</p>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ country.capital.join(', ') }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('countryDetail.tld') }}</p>
                  <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ country.cca3 }}</p>
                </div>
              </div>

              <a
                :href="country.maps.googleMaps"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-6 inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
              >
                <MapPin class="w-5 h-5" />
                <span>{{ $t('countryDetail.viewOnGoogleMaps') }}</span>
                <ExternalLink class="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="detail-card">
            <Users class="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ $t('countryDetail.population') }}</h3>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ new Intl.NumberFormat('es-ES').format(country.population) }}
            </p>
          </div>

          <div class="detail-card">
            <Maximize class="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ $t('countryDetail.area') }}</h3>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ new Intl.NumberFormat('es-ES').format(country.area) }} km²
            </p>
          </div>

          <div class="detail-card">
            <Activity class="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ $t('countryCard.population') }}</h3>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ calculateDensity() }} hab/km²
            </p>
          </div>

          <div v-if="country.languages" class="detail-card md:col-span-2 lg:col-span-1">
            <Languages class="w-8 h-8 text-orange-600 dark:text-orange-400 mb-3" />
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ $t('countryDetail.languages') }}</h3>
            <div class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="(lang, code) in country.languages"
                :key="code"
                class="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-sm"
              >
                {{ lang }}
              </span>
            </div>
          </div>

          <div v-if="country.currencies" class="detail-card md:col-span-2">
            <DollarSign class="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-3" />
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ $t('countryDetail.currencies') }}</h3>
            <div class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="(curr, code) in country.currencies"
                :key="code"
                class="px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full text-sm"
              >
                {{ curr.name }} ({{ curr.symbol }})
              </span>
            </div>
          </div>

          <div v-if="country.timezones" class="detail-card">
            <Clock class="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-3" />
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ $t('countryDetail.timezones') }}</h3>
            <div class="mt-2 space-y-1">
              <p
                v-for="(tz, index) in country.timezones.slice(0, 3)"
                :key="index"
                class="text-sm text-gray-700 dark:text-gray-300"
              >
                {{ tz }}
              </p>
              <p v-if="country.timezones.length > 3" class="text-sm text-gray-500">
                +{{ country.timezones.length - 3 }} {{ $t('common.showMore') }}
              </p>
            </div>
          </div>

          <div v-if="country.tld" class="detail-card">
            <Globe class="w-8 h-8 text-cyan-600 dark:text-cyan-400 mb-3" />
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ $t('countryDetail.tld') }}</h3>
            <p class="text-xl font-bold text-gray-900 dark:text-white">
              {{ country.tld.join(', ') }}
            </p>
          </div>

          <div v-if="country.borders && country.borders.length > 0" class="detail-card md:col-span-2">
            <MapPinned class="w-8 h-8 text-rose-600 dark:text-rose-400 mb-3" />
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {{ $t('countryDetail.borders') }} ({{ country.borders.length }})
            </h3>
            <div class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="border in country.borders"
                :key="border"
                class="px-3 py-1 bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 rounded-full text-sm"
              >
                {{ border }}
              </span>
            </div>
          </div>
        </div>

        <!-- Coat of Arms -->
        <div v-if="country.coatOfArms?.svg" class="glass-card rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ $t('countryDetail.coatOfArms') }}</h2>
          <div class="flex justify-center">
            <img
              :src="country.coatOfArms.svg"
              :alt="`${$t('countryDetail.coatOfArms')} - ${countryName}`"
              class="h-64 object-contain"
            />
          </div>
        </div>

        <!-- Map -->
        <div v-if="country.latlng" class="glass-card rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ $t('countryDetail.coordinates') }}</h2>
          <div class="aspect-video rounded-lg overflow-hidden">
            <iframe
              :src="`https://www.google.com/maps?q=${country.latlng[0]},${country.latlng[1]}&z=5&output=embed`"
              class="w-full h-full border-0"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ $t('countryDetail.countryNotFound') }}</h3>
        <BaseButton
          variant="primary"
          size="lg"
          @click="router.push('/')"
          class="mt-4"
        >
          {{ $t('countryDetail.backToExplorer') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  ArrowLeft,
  Heart,
  GitCompare,
  MapPin,
  ExternalLink,
  Users,
  Maximize,
  Activity,
  Languages,
  DollarSign,
  Clock,
  Globe,
  MapPinned,
  AlertCircle,
} from 'lucide-vue-next'
import { useCountriesStore } from '@/features/countries'
import { useFavoritesStore } from '@/features/favorites'
import { useCountryName } from '@/features/countries'
import LoadingSpinner from '@/shared/components/LoadingSpinner.vue'
import type { Country } from '@/core/types'
import { BaseButton } from '@/shared/components'

interface Props {
  code: string
}

const props = defineProps<Props>()
const router = useRouter()

const countriesStore = useCountriesStore()
const favoritesStore = useFavoritesStore()
const { countries } = storeToRefs(countriesStore)
const { canAddToComparison } = storeToRefs(favoritesStore)
const { getCountryName, getOfficialName, locale } = useCountryName()

const country = ref<Country | null>(null)
const loading = ref(true)

const countryName = computed(() => {
  locale.value // Force reactivity
  return country.value ? getCountryName(country.value) : ''
})
const officialName = computed(() => {
  locale.value // Force reactivity
  return country.value ? getOfficialName(country.value) : ''
})

const isFavorite = computed(() =>
  country.value ? favoritesStore.isFavorite(country.value.cca3) : false
)

const isInComparison = computed(() =>
  country.value ? favoritesStore.isInComparison(country.value.cca3) : false
)

const calculateDensity = () => {
  if (!country.value) return 0
  const density = country.value.population / country.value.area
  return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(density)
}

const toggleFavorite = () => {
  if (country.value) {
    favoritesStore.toggleFavorite(country.value)
  }
}

const addToComparison = () => {
  if (country.value) {
    favoritesStore.addToComparison(country.value)
  }
}

onMounted(async () => {
  if (countries.value.length === 0) {
    await countriesStore.fetchCountries()
  }

  country.value = countries.value.find(c => c.cca3 === props.code) || null
  loading.value = false
})
</script>

<style scoped>
.detail-card {
  @apply rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-xl;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .detail-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
