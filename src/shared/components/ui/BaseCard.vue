<template>
  <div :class="cardClasses">
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
      </slot>
    </div>

    <div :class="bodyClasses">
      <slot />
    </div>

    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Base Card Component
 *
 * Container component with multiple visual variants
 *
 * @example
 * ```vue
 * <BaseCard title="My Card" variant="elevated">
 *   <p>Card content</p>
 * </BaseCard>
 *
 * <BaseCard variant="glass" hoverable>
 *   <template #header>Custom Header</template>
 *   Content here
 *   <template #footer>Actions</template>
 * </BaseCard>
 * ```
 */
export interface BaseCardProps {
  variant?: 'default' | 'bordered' | 'elevated' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  title?: string
  hoverable?: boolean
  clickable?: boolean
}

const VALID_VARIANTS = ['default', 'bordered', 'elevated', 'glass'] as const
const VALID_PADDINGS = ['none', 'sm', 'md', 'lg', 'xl'] as const

const props = withDefaults(defineProps<BaseCardProps>(), {
  variant: 'default',
  padding: 'md',
  hoverable: false,
  clickable: false
})

// Validate props
if (props.variant && !VALID_VARIANTS.includes(props.variant as any)) {
  console.warn(`[BaseCard] Invalid variant: "${props.variant}". Must be one of: ${VALID_VARIANTS.join(', ')}`)
}

if (props.padding && !VALID_PADDINGS.includes(props.padding as any)) {
  console.warn(`[BaseCard] Invalid padding: "${props.padding}". Must be one of: ${VALID_PADDINGS.join(', ')}`)
}

const cardClasses = computed(() => {
  const classes = ['card', `card-${props.variant}`]

  if (props.hoverable) classes.push('card-hoverable')
  if (props.clickable) classes.push('card-clickable')

  return classes.join(' ')
})

const bodyClasses = computed(() => {
  return ['card-body', `card-body-${props.padding}`].join(' ')
})
</script>

<style scoped>
/* Base Card */
.card {
  @apply rounded-lg transition-all duration-300 bg-white dark:bg-gray-800;
}

/* Variants */
.card-default {
  @apply shadow-sm;
}

.card-bordered {
  @apply border-2 border-gray-200 dark:border-gray-700;
}

.card-elevated {
  @apply shadow-lg;
}

.card-glass {
  @apply backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 border border-gray-200/50 dark:border-gray-700/50;
}

/* States */
.card-hoverable {
  @apply hover:shadow-xl hover:-translate-y-1;
}

.card-clickable {
  @apply cursor-pointer hover:shadow-xl hover:-translate-y-1 active:scale-[0.98];
}

/* Header */
.card-header {
  @apply px-6 py-4 border-b border-gray-200 dark:border-gray-700;
}

.card-title {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

/* Body */
.card-body {
  @apply text-gray-600 dark:text-gray-300;
}

.card-body-none {
  @apply p-0;
}

.card-body-sm {
  @apply p-3;
}

.card-body-md {
  @apply p-6;
}

.card-body-lg {
  @apply p-8;
}

.card-body-xl {
  @apply p-10;
}

/* Footer */
.card-footer {
  @apply px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50;
}
</style>
