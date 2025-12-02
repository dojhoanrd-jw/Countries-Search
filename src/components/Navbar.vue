<template>
  <nav class="bg-white dark:bg-black border-b-2 border-primary-500 shadow-lg sticky top-0 z-50 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-8">
          <router-link to="/" class="flex items-center space-x-2 text-xl font-bold text-primary-600 dark:text-primary-400">
            <Globe class="w-8 h-8" />
            <span>Countries Search</span>
          </router-link>

          <div class="hidden md:flex space-x-4">
            <router-link
              to="/"
              class="nav-link"
              :class="{ 'active': $route.name === 'dashboard' }"
            >
              <LayoutDashboard class="w-4 h-4" />
              <span>{{ $t('nav.dashboard') }}</span>
            </router-link>

            <router-link
              to="/statistics"
              class="nav-link"
              :class="{ 'active': $route.name === 'statistics' }"
            >
              <BarChart3 class="w-4 h-4" />
              <span>{{ $t('nav.statistics') }}</span>
            </router-link>

            <router-link
              to="/favorites"
              class="nav-link"
              :class="{ 'active': $route.name === 'favorites' }"
            >
              <Heart class="w-4 h-4" :fill="favoritesCount > 0 ? 'currentColor' : 'none'" />
              <span>{{ $t('nav.favorites') }}</span>
              <span v-if="favoritesCount > 0" class="badge">{{ favoritesCount }}</span>
            </router-link>

            <router-link
              to="/compare"
              class="nav-link"
              :class="{ 'active': $route.name === 'compare' }"
            >
              <GitCompare class="w-4 h-4" />
              <span>{{ $t('nav.compare') }}</span>
              <span v-if="comparisonCount > 0" class="badge">{{ comparisonCount }}</span>
            </router-link>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <button
            @click="toggleLanguage"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 font-semibold text-gray-600 dark:text-gray-300"
            :title="$t('nav.language')"
          >
            {{ locale === 'es' ? 'EN' : 'ES' }}
          </button>

          <button
            @click="toggleTheme"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            :title="isDark ? $t('nav.theme.light') : $t('nav.theme.dark')"
          >
            <Sun v-if="isDark" class="w-5 h-5 text-yellow-500" />
            <Moon v-else class="w-5 h-5 text-gray-600" />
          </button>

          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 dark:border-gray-700">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            to="/"
            @click="mobileMenuOpen = false"
            class="mobile-nav-link"
            :class="{ 'active': $route.name === 'dashboard' }"
          >
            <LayoutDashboard class="w-4 h-4" />
            <span>{{ $t('nav.dashboard') }}</span>
          </router-link>

          <router-link
            to="/statistics"
            @click="mobileMenuOpen = false"
            class="mobile-nav-link"
            :class="{ 'active': $route.name === 'statistics' }"
          >
            <BarChart3 class="w-4 h-4" />
            <span>{{ $t('nav.statistics') }}</span>
          </router-link>

          <router-link
            to="/favorites"
            @click="mobileMenuOpen = false"
            class="mobile-nav-link"
            :class="{ 'active': $route.name === 'favorites' }"
          >
            <Heart class="w-4 h-4" />
            <span>{{ $t('nav.favorites') }} ({{ favoritesCount }})</span>
          </router-link>

          <router-link
            to="/compare"
            @click="mobileMenuOpen = false"
            class="mobile-nav-link"
            :class="{ 'active': $route.name === 'compare' }"
          >
            <GitCompare class="w-4 h-4" />
            <span>{{ $t('nav.compare') }} ({{ comparisonCount }})</span>
          </router-link>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Globe, LayoutDashboard, BarChart3, Heart, GitCompare, Sun, Moon, Menu } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import { useFavoritesStore } from '@/stores/favorites'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const favoritesStore = useFavoritesStore()
const { locale } = useI18n()

const { isDark } = storeToRefs(themeStore)
const { favoritesCount, comparisonCount } = storeToRefs(favoritesStore)
const { toggleTheme } = themeStore

const mobileMenuOpen = ref(false)

const toggleLanguage = () => {
  const newLocale = locale.value === 'es' ? 'en' : 'es'
  setLocale(newLocale as 'es' | 'en')
}
</script>

<style scoped>
.nav-link {
  @apply flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200;
}

.nav-link.active {
  @apply bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400;
}

.mobile-nav-link {
  @apply flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200;
}

.mobile-nav-link.active {
  @apply bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400;
}

.badge {
  @apply inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-primary-600 rounded-full;
}
</style>
