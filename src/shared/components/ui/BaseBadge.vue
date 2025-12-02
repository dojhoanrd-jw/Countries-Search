<template>
  <span :class="badgeClasses">
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface BaseBadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  outlined?: boolean
  dot?: boolean
}

const props = withDefaults(defineProps<BaseBadgeProps>(), {
  variant: 'primary',
  size: 'md',
  rounded: false,
  outlined: false,
  dot: false
})

const badgeClasses = computed(() => {
  const classes = ['badge', `badge-${props.variant}`, `badge-${props.size}`]

  if (props.rounded) classes.push('badge-rounded')
  if (props.outlined) classes.push('badge-outlined')
  if (props.dot) classes.push('badge-dot')

  return classes.join(' ')
})
</script>

<style scoped>
/* Base Badge */
.badge {
  @apply inline-flex items-center justify-center gap-1 font-medium transition-colors duration-200;
}

/* Sizes */
.badge-sm {
  @apply px-2 py-0.5 text-xs rounded;
}

.badge-md {
  @apply px-2.5 py-1 text-xs rounded-md;
}

.badge-lg {
  @apply px-3 py-1.5 text-sm rounded-md;
}

/* Color Variants - Solid */
.badge-primary {
  @apply bg-primary-600 text-white dark:bg-primary-500;
}

.badge-secondary {
  @apply bg-gray-600 text-white dark:bg-gray-500;
}

.badge-success {
  @apply bg-green-600 text-white dark:bg-green-500;
}

.badge-warning {
  @apply bg-yellow-500 text-white dark:bg-yellow-600;
}

.badge-danger {
  @apply bg-red-600 text-white dark:bg-red-500;
}

.badge-info {
  @apply bg-blue-600 text-white dark:bg-blue-500;
}

.badge-neutral {
  @apply bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200;
}

/* Outlined Variants */
.badge-outlined.badge-primary {
  @apply bg-transparent border border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400;
}

.badge-outlined.badge-secondary {
  @apply bg-transparent border border-gray-600 text-gray-600 dark:border-gray-400 dark:text-gray-400;
}

.badge-outlined.badge-success {
  @apply bg-transparent border border-green-600 text-green-600 dark:border-green-400 dark:text-green-400;
}

.badge-outlined.badge-warning {
  @apply bg-transparent border border-yellow-600 text-yellow-600 dark:border-yellow-400 dark:text-yellow-400;
}

.badge-outlined.badge-danger {
  @apply bg-transparent border border-red-600 text-red-600 dark:border-red-400 dark:text-red-400;
}

.badge-outlined.badge-info {
  @apply bg-transparent border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400;
}

.badge-outlined.badge-neutral {
  @apply bg-transparent border border-gray-400 text-gray-700 dark:border-gray-600 dark:text-gray-300;
}

/* Modifiers */
.badge-rounded {
  @apply rounded-full;
}

.badge-dot {
  @apply w-2 h-2 p-0 rounded-full;
}
</style>
