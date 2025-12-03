<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <span v-if="loading" class="btn-loader"></span>
    <slot v-if="!loading" name="icon-left" />
    <span v-if="!loading || loadingText" class="btn-content">
      <slot>{{ loading && loadingText ? loadingText : '' }}</slot>
    </span>
    <slot v-if="!loading" name="icon-right" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Base Button Component
 *
 * A versatile button component with multiple variants and sizes
 *
 * @example
 * ```vue
 * <BaseButton variant="primary" size="md" @click="handleClick">
 *   Click me
 * </BaseButton>
 *
 * <BaseButton variant="danger" :loading="isLoading" loading-text="Saving...">
 *   Save
 * </BaseButton>
 * ```
 */
export interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  fullWidth?: boolean
  rounded?: boolean
}

const VALID_VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success'] as const
const VALID_SIZES = ['sm', 'md', 'lg', 'xl'] as const
const VALID_TYPES = ['button', 'submit', 'reset'] as const

const props = withDefaults(defineProps<BaseButtonProps>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
  rounded: false
})

// Validate props
if (props.variant && !VALID_VARIANTS.includes(props.variant as any)) {
  console.warn(`[BaseButton] Invalid variant: "${props.variant}". Must be one of: ${VALID_VARIANTS.join(', ')}`)
}

if (props.size && !VALID_SIZES.includes(props.size as any)) {
  console.warn(`[BaseButton] Invalid size: "${props.size}". Must be one of: ${VALID_SIZES.join(', ')}`)
}

if (props.type && !VALID_TYPES.includes(props.type as any)) {
  console.warn(`[BaseButton] Invalid type: "${props.type}". Must be one of: ${VALID_TYPES.join(', ')}`)
}

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const buttonClasses = computed(() => {
  const classes = ['btn', `btn-${props.variant}`, `btn-${props.size}`]

  if (props.disabled) classes.push('btn-disabled')
  if (props.loading) classes.push('btn-loading')
  if (props.fullWidth) classes.push('btn-full')
  if (props.rounded) classes.push('btn-rounded')

  return classes.join(' ')
})
</script>

<style scoped>
/* Base Button Styles */
.btn {
  @apply inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed;
}

/* Size Variants */
.btn-sm {
  @apply px-3 py-1.5 text-sm rounded-md;
}

.btn-md {
  @apply px-4 py-2 text-sm rounded-lg;
}

.btn-lg {
  @apply px-6 py-3 text-base rounded-lg;
}

.btn-xl {
  @apply px-8 py-4 text-lg rounded-xl;
}

/* Color Variants */
.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600;
}

.btn-secondary {
  @apply bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 dark:bg-gray-500 dark:hover:bg-gray-600;
}

.btn-outline {
  @apply border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20;
}

.btn-ghost {
  @apply text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600;
}

.btn-success {
  @apply bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600;
}

/* States */
.btn-disabled {
  @apply opacity-50 cursor-not-allowed;
}

.btn-loading {
  @apply relative cursor-wait;
}

/* Modifiers */
.btn-full {
  @apply w-full;
}

.btn-rounded {
  @apply rounded-full;
}

/* Loading Spinner */
.btn-loader {
  @apply inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin;
}

.btn-content {
  @apply inline-flex items-center gap-2;
}
</style>
