<template>
  <ErrorBoundary>
    <div id="app" class="min-h-screen">
      <Navbar />

      <router-view v-slot="{ Component, route }">
        <transition
          :name="route.meta.transition || 'fade'"
          mode="out-in"
        >
          <ErrorBoundary :key="route.path">
            <component :is="Component" :key="route.path" />
          </ErrorBoundary>
        </transition>
      </router-view>

      <Toast />
    </div>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Navbar from '@/layouts/Navbar.vue'
import Toast from '@/shared/components/Toast.vue'
import ErrorBoundary from '@/shared/components/ErrorBoundary.vue'
import { useThemeStore } from '@/shared/services'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
