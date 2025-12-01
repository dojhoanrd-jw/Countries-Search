<template>
  <div class="min-h-screen bg-[#F8F9FA] dark:bg-black transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Heart class="w-10 h-10 mr-3 text-red-500" fill="currentColor" />
          Países Favoritos
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ favorites.length }} {{ favorites.length === 1 ? 'país guardado' : 'países guardados' }}
        </p>
      </div>

      <!-- Empty State -->
      <div v-if="favorites.length === 0" class="text-center py-20">
        <Heart class="w-24 h-24 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
        <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
          No tienes favoritos aún
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Explora países y agrega tus favoritos haciendo clic en el ícono de corazón en cada tarjeta
        </p>
        <router-link
          to="/"
          class="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
        >
          <Globe class="w-5 h-5" />
          <span>Explorar países</span>
        </router-link>
      </div>

      <!-- Favorites Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CountryCard
          v-for="country in favorites"
          :key="country.cca3"
          :country="country"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Heart, Globe } from 'lucide-vue-next'
import { useFavoritesStore } from '@/stores/favorites'
import { storeToRefs } from 'pinia'
import CountryCard from '@/components/CountryCard.vue'

const favoritesStore = useFavoritesStore()
const { favorites } = storeToRefs(favoritesStore)
</script>
