<template>
  <div
    class="glass-card rounded-lg shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer group animate-fade-in"
    @click="navigateToDetail"
  >
    <div class="relative h-48">
      <OptimizedImage
        :src="country.flags.svg"
        :alt="country.flags.alt || `Bandera de ${countryName}`"
        aspect-ratio="3/2"
        container-class="relative h-full overflow-hidden bg-gray-200 dark:bg-gray-700"
        image-class="group-hover:scale-110 transition-transform duration-300"
      />
      <button
        @click.stop="toggleFavorite"
        class="absolute top-3 right-3 p-2 bg-white/90 dark:bg-[#1a1a1a]/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200 shadow-lg"
        :title="isFavorite ? $t('countryCard.removeFromFavorites') : $t('countryCard.addToFavorites')"
      >
        <Heart
          class="w-5 h-5 transition-colors duration-200"
          :class="isFavorite ? 'text-red-500' : 'text-gray-400'"
          :fill="isFavorite ? 'currentColor' : 'none'"
        />
      </button>
    </div>

    <div class="p-6">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
        {{ countryName }}
      </h3>

      <div class="space-y-2 text-sm">
        <div class="flex items-center text-gray-600 dark:text-gray-400">
          <MapPin class="w-4 h-4 mr-2 flex-shrink-0 text-primary-600 dark:text-primary-400" />
          <span class="line-clamp-1">
            <strong>{{ $t('countryCard.capital') }}:</strong> {{ formatCapital }}
          </span>
        </div>

        <div class="flex items-center text-gray-600 dark:text-gray-400">
          <Globe2 class="w-4 h-4 mr-2 flex-shrink-0 text-primary-600 dark:text-primary-400" />
          <span>
            <strong>{{ $t('countryCard.region') }}:</strong> {{ country.region }}
          </span>
        </div>

        <div class="flex items-center text-gray-600 dark:text-gray-400">
          <Users class="w-4 h-4 mr-2 flex-shrink-0 text-primary-600 dark:text-primary-400" />
          <span>
            <strong>{{ $t('countryCard.population') }}:</strong> {{ formatPopulation }}
          </span>
        </div>

        <div class="flex items-center text-gray-600 dark:text-gray-400">
          <Maximize class="w-4 h-4 mr-2 flex-shrink-0 text-primary-600 dark:text-primary-400" />
          <span>
            <strong>{{ $t('countryCard.area') }}:</strong> {{ formatArea }}
          </span>
        </div>

        <div v-if="formatLanguages" class="flex items-start text-gray-600 dark:text-gray-400">
          <Languages class="w-4 h-4 mr-2 flex-shrink-0 text-primary-600 dark:text-primary-400 mt-0.5" />
          <span class="line-clamp-1">
            <strong>{{ $t('countryCard.language') }}:</strong> {{ formatLanguages }}
          </span>
        </div>

        <div v-if="formatCurrency" class="flex items-start text-gray-600 dark:text-gray-400">
          <DollarSign class="w-4 h-4 mr-2 flex-shrink-0 text-primary-600 dark:text-primary-400 mt-0.5" />
          <span class="line-clamp-1">
            <strong>{{ $t('countryCard.currency') }}:</strong> {{ formatCurrency }}
          </span>
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <a
          :href="country.maps.googleMaps"
          target="_blank"
          rel="noopener noreferrer"
          @click.stop
          class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium flex items-center space-x-1 transition-colors duration-200"
        >
          <Map class="w-4 h-4" />
          <span>{{ $t('countryCard.viewOnMap') }}</span>
          <ExternalLink class="w-3 h-3" />
        </a>

        <button
          v-if="!isInComparison"
          @click.stop="addToComparison"
          :disabled="!canAddToComparison"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          :title="$t('countryCard.addToComparison')"
        >
          <GitCompare class="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          v-else
          @click.stop="removeFromComparison"
          class="p-2 rounded-lg bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors duration-200"
          :title="$t('countryCard.removeFromComparison')"
        >
          <GitCompare class="w-4 h-4 text-primary-600 dark:text-primary-400" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Heart, MapPin, Globe2, Users, Maximize, Languages, DollarSign, Map, ExternalLink, GitCompare } from 'lucide-vue-next'
import { useFavoritesStore } from '@/stores/favorites'
import { useCountryName } from '@/composables/useCountryName'
import { storeToRefs } from 'pinia'
import type { Country } from '@/types/country'
import OptimizedImage from './OptimizedImage.vue'

interface Props {
  country: Country
}

const props = defineProps<Props>()
const router = useRouter()
const favoritesStore = useFavoritesStore()
const { canAddToComparison } = storeToRefs(favoritesStore)
const { getCountryName } = useCountryName()

const countryName = computed(() => getCountryName(props.country))
const isFavorite = computed(() => favoritesStore.isFavorite(props.country.cca3))
const isInComparison = computed(() => favoritesStore.isInComparison(props.country.cca3))

const formatCapital = computed(() => {
  return props.country.capital?.join(', ') || 'N/A'
})

const formatPopulation = computed(() => {
  return new Intl.NumberFormat('es-ES').format(props.country.population)
})

const formatArea = computed(() => {
  return `${new Intl.NumberFormat('es-ES').format(props.country.area)} km²`
})

const formatLanguages = computed(() => {
  if (!props.country.languages) return null
  return Object.values(props.country.languages).slice(0, 2).join(', ')
})

const formatCurrency = computed(() => {
  if (!props.country.currencies) return null
  const currencies = Object.values(props.country.currencies)
  return currencies.length > 0 ? `${currencies[0].name} (${currencies[0].symbol})` : null
})

const toggleFavorite = () => {
  favoritesStore.toggleFavorite(props.country)
}

const addToComparison = () => {
  favoritesStore.addToComparison(props.country)
}

const removeFromComparison = () => {
  favoritesStore.removeFromComparison(props.country.cca3)
}

const navigateToDetail = () => {
  router.push({ name: 'country-detail', params: { code: props.country.cca3 } })
}
</script>
