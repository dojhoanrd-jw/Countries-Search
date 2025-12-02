<template>
  <div class="min-h-screen bg-[#F8F9FA] dark:bg-black transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('dashboard.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('dashboard.subtitle', { count: filteredCountries.length }) }}
        </p>
      </div>

      <!-- Search and Filters -->
      <div class="mb-8 space-y-4">
        <!-- Search Bar -->
        <BaseInput
          v-model="searchQuery"
          type="search"
          :placeholder="$t('dashboard.searchPlaceholder')"
          size="lg"
        >
          <template #icon-left>
            <Search class="w-5 h-5" />
          </template>
        </BaseInput>

        <!-- Filters Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Region Filter -->
          <div class="relative">
            <Filter class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              v-model="selectedRegion"
              class="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none cursor-pointer transition-all duration-200"
            >
              <option value="">{{ $t('dashboard.allRegions') }}</option>
              <option v-for="region in regions" :key="region" :value="region">
                {{ region }}
              </option>
            </select>
          </div>

          <!-- Sort By -->
          <div class="relative">
            <ArrowUpDown class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              v-model="sortByValue"
              class="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none cursor-pointer transition-all duration-200"
            >
              <option value="name">{{ $t('dashboard.sortBy.name') }}</option>
              <option value="population">{{ $t('dashboard.sortBy.population') }}</option>
              <option value="area">{{ $t('dashboard.sortBy.area') }}</option>
            </select>
          </div>

          <!-- Sort Order -->
          <BaseButton
            variant="outline"
            size="lg"
            @click="toggleSortOrder"
            full-width
          >
            <template #icon-left>
              <component :is="sortOrder === 'asc' ? ArrowUp : ArrowDown" class="w-4 h-4" />
            </template>
            {{ sortOrder === 'asc' ? $t('dashboard.sortOrder.asc') : $t('dashboard.sortOrder.desc') }}
          </BaseButton>

          <!-- Reset Filters -->
          <BaseButton
            variant="primary"
            size="lg"
            @click="resetAllFilters"
            full-width
          >
            <template #icon-left>
              <RotateCcw class="w-4 h-4" />
            </template>
            {{ $t('common.reset') }}
          </BaseButton>
        </div>

        <!-- Advanced Filters (Collapsible) -->
        <div class="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
          <button
            @click="showAdvancedFilters = !showAdvancedFilters"
            class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <span class="font-medium text-gray-900 dark:text-white">{{ $t('dashboard.advancedFilters') }}</span>
            <ChevronDown
              class="w-5 h-5 text-gray-500 transition-transform duration-200"
              :class="{ 'rotate-180': showAdvancedFilters }"
            />
          </button>

          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-if="showAdvancedFilters" class="px-4 pb-4 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput
                  v-model="languageFilter"
                  type="text"
                  :placeholder="$t('dashboard.filterByLanguage')"
                  variant="filled"
                />
                <BaseInput
                  v-model="currencyFilter"
                  type="text"
                  :placeholder="$t('dashboard.filterByCurrency')"
                  variant="filled"
                />
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard v-for="i in 9" :key="i" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ $t('dashboard.errorLoading') }}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
        <BaseButton
          variant="primary"
          size="lg"
          @click="fetchCountries"
        >
          {{ $t('common.retry') }}
        </BaseButton>
      </div>

      <!-- Countries Grid with Pagination -->
      <div v-else-if="filteredCountries.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CountryCard
            v-for="country in paginatedItems"
            :key="country.cca3"
            :country="country"
          />
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t('dashboard.showing', { start: startIndex + 1, end: endIndex, total: filteredCountries.length }) }}
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="goToFirstPage"
              :disabled="currentPage === 1"
              class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              :title="$t('dashboard.firstPage')"
            >
              <ChevronsLeft class="w-4 h-4" />
            </button>

            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              :title="$t('dashboard.previousPage')"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>

            <div class="flex items-center space-x-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-4 py-2 rounded-lg transition-colors duration-200',
                  currentPage === page
                    ? 'bg-primary-600 text-white'
                    : 'border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              :title="$t('dashboard.nextPage')"
            >
              <ChevronRight class="w-4 h-4" />
            </button>

            <button
              @click="goToLastPage"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              :title="$t('dashboard.lastPage')"
            >
              <ChevronsRight class="w-4 h-4" />
            </button>
          </div>

          <div class="flex items-center space-x-2">
            <label for="itemsPerPage" class="text-sm text-gray-600 dark:text-gray-400">
              {{ $t('common.perPage') }}:
            </label>
            <select
              id="itemsPerPage"
              v-model.number="itemsPerPage"
              class="px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option :value="12">12</option>
              <option :value="24">24</option>
              <option :value="48">48</option>
              <option :value="96">96</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <Globe class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ $t('dashboard.noCountries') }}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ $t('dashboard.tryAdjustFilters') }}</p>
        <BaseButton
          variant="primary"
          size="lg"
          @click="resetAllFilters"
        >
          {{ $t('common.reset') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, RotateCcw,
  ChevronDown, Globe, AlertCircle, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight
} from 'lucide-vue-next'
import { useCountriesStore } from '@/stores/countries'
import { usePagination } from '@/composables/usePagination'
import SkeletonCard from '@/components/SkeletonCard.vue'
import { BaseButton, BaseInput } from '@/components/ui'

// Async component for better code splitting
const CountryCard = defineAsyncComponent(() => import('@/components/CountryCard.vue'))

const countriesStore = useCountriesStore()
const { filteredCountries, regions, loading, error } = storeToRefs(countriesStore)
const { fetchCountries, setFilters, resetFilters, setSorting } = countriesStore

const searchQuery = ref('')
const selectedRegion = ref('')
const sortByValue = ref<'name' | 'population' | 'area'>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')
const showAdvancedFilters = ref(false)
const languageFilter = ref('')
const currencyFilter = ref('')

// Pagination
const {
  currentPage,
  itemsPerPage,
  totalPages,
  startIndex,
  endIndex,
  paginatedItems,
  visiblePages,
  goToPage,
  nextPage,
  prevPage,
  goToFirstPage,
  goToLastPage,
} = usePagination(() => filteredCountries.value, { itemsPerPage: 12 })

// Watch filters and update store
watch([searchQuery, selectedRegion, languageFilter, currencyFilter], () => {
  setFilters({
    search: searchQuery.value,
    region: selectedRegion.value,
    language: languageFilter.value,
    currency: currencyFilter.value,
  })
})

watch([sortByValue, sortOrder], () => {
  setSorting(sortByValue.value, sortOrder.value)
})

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

const resetAllFilters = () => {
  searchQuery.value = ''
  selectedRegion.value = ''
  languageFilter.value = ''
  currencyFilter.value = ''
  sortByValue.value = 'name'
  sortOrder.value = 'asc'
  resetFilters()
}

onMounted(() => {
  if (countriesStore.countries.length === 0) {
    fetchCountries()
  }
})
</script>
