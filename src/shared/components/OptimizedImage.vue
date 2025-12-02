<template>
  <div
    :class="containerClass"
    :style="{ aspectRatio: aspectRatio }"
  >
    <!-- Low quality placeholder (loaded first) -->
    <img
      v-if="!imageLoaded"
      :src="placeholderSrc"
      :alt="alt"
      class="absolute inset-0 w-full h-full object-cover blur-sm scale-110 transition-opacity duration-300"
      :class="imageLoaded ? 'opacity-0' : 'opacity-100'"
    />

    <!-- Main image (lazy loaded) -->
    <img
      ref="imageRef"
      :data-src="src"
      :alt="alt"
      :class="imageClass"
      class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
      :style="{ opacity: imageLoaded ? 1 : 0 }"
      loading="lazy"
      decoding="async"
      @load="handleImageLoad"
      @error="handleImageError"
    />

    <!-- Loading spinner -->
    <div
      v-if="!imageLoaded && !imageError"
      class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
    >
      <div class="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>

    <!-- Error state -->
    <div
      v-if="imageError"
      class="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400"
    >
      <ImageOff class="w-8 h-8 mb-2" />
      <span class="text-sm">Imagen no disponible</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ImageOff } from 'lucide-vue-next'

interface Props {
  src: string
  alt: string
  aspectRatio?: string
  containerClass?: string
  imageClass?: string
  placeholderSrc?: string
}

const props = withDefaults(defineProps<Props>(), {
  aspectRatio: '16/9',
  containerClass: 'relative overflow-hidden bg-gray-200 dark:bg-gray-700',
  imageClass: '',
  placeholderSrc: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3C/svg%3E'
})

const imageRef = ref<HTMLImageElement | null>(null)
const imageLoaded = ref(false)
const imageError = ref(false)
let observer: IntersectionObserver | null = null

const handleImageLoad = () => {
  imageLoaded.value = true
}

const handleImageError = () => {
  imageError.value = true
}

const loadImage = () => {
  if (imageRef.value && imageRef.value.dataset.src) {
    imageRef.value.src = imageRef.value.dataset.src
  }
}

onMounted(() => {
  if (!imageRef.value) return

  // Use Intersection Observer for lazy loading
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage()
            if (imageRef.value && observer) {
              observer.unobserve(imageRef.value)
            }
          }
        })
      },
      {
        rootMargin: '50px', // Load 50px before entering viewport
        threshold: 0.01
      }
    )

    observer.observe(imageRef.value)
  } else {
    // Fallback for browsers without IntersectionObserver
    loadImage()
  }
})

onUnmounted(() => {
  if (observer && imageRef.value) {
    observer.unobserve(imageRef.value)
    observer.disconnect()
  }
})
</script>
