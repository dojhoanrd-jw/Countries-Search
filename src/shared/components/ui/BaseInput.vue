<template>
  <div class="input-wrapper" :class="{ 'input-full': fullWidth }">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="input-container" :class="containerClasses">
      <div v-if="$slots['icon-left']" class="input-icon input-icon-left">
        <slot name="icon-left" />
      </div>

      <input
        :id="inputId"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <div v-if="$slots['icon-right'] || clearable && modelValue" class="input-icon input-icon-right">
        <button
          v-if="clearable && modelValue"
          type="button"
          @click="handleClear"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <slot v-else name="icon-right" />
      </div>
    </div>

    <p v-if="error" class="input-error">{{ error }}</p>
    <p v-else-if="hint" class="input-hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * Base Input Component
 *
 * A flexible input component with validation, icons, and multiple variants
 *
 * @example
 * ```vue
 * <BaseInput
 *   v-model="email"
 *   type="email"
 *   label="Email"
 *   placeholder="Enter your email"
 *   :error="emailError"
 * />
 * ```
 */
export interface BaseInputProps {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  clearable?: boolean
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'flushed'
}

const VALID_TYPES = ['text', 'email', 'password', 'number', 'tel', 'url', 'search'] as const
const VALID_SIZES = ['sm', 'md', 'lg'] as const
const VALID_VARIANTS = ['default', 'filled', 'flushed'] as const

const props = withDefaults(defineProps<BaseInputProps>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
  fullWidth: true,
  size: 'md',
  variant: 'default'
})

// Validate props
if (props.type && !VALID_TYPES.includes(props.type as any)) {
  console.warn(`[BaseInput] Invalid type: "${props.type}". Must be one of: ${VALID_TYPES.join(', ')}`)
}

if (props.size && !VALID_SIZES.includes(props.size as any)) {
  console.warn(`[BaseInput] Invalid size: "${props.size}". Must be one of: ${VALID_SIZES.join(', ')}`)
}

if (props.variant && !VALID_VARIANTS.includes(props.variant as any)) {
  console.warn(`[BaseInput] Invalid variant: "${props.variant}". Must be one of: ${VALID_VARIANTS.join(', ')}`)
}

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement>()
const isFocused = ref(false)
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleClear = () => {
  emit('update:modelValue', '')
  inputRef.value?.focus()
}

const containerClasses = computed(() => {
  const classes = [`input-container-${props.variant}`, `input-container-${props.size}`]

  if (props.error) classes.push('input-container-error')
  if (props.disabled) classes.push('input-container-disabled')
  if (isFocused.value) classes.push('input-container-focused')

  return classes.join(' ')
})

const inputClasses = computed(() => {
  const classes = ['input', `input-${props.size}`]

  if (props.disabled) classes.push('input-disabled')

  return classes.join(' ')
})
</script>

<style scoped>
/* Wrapper */
.input-wrapper {
  @apply flex flex-col gap-1.5;
}

.input-full {
  @apply w-full;
}

/* Label */
.input-label {
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
}

/* Container */
.input-container {
  @apply relative flex items-center transition-all duration-200;
}

.input-container-default {
  @apply border-2 rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600;
}

.input-container-filled {
  @apply border-2 border-transparent rounded-lg bg-gray-100 dark:bg-gray-800;
}

.input-container-flushed {
  @apply border-b-2 border-gray-300 dark:border-gray-600 bg-transparent;
}

.input-container-focused {
  @apply ring-2 ring-primary-500 border-primary-500;
}

.input-container-error {
  @apply border-red-500 dark:border-red-400;
}

.input-container-focused.input-container-error {
  @apply ring-red-500;
}

.input-container-disabled {
  @apply opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900;
}

/* Sizes */
.input-container-sm {
  @apply h-9;
}

.input-container-md {
  @apply h-10;
}

.input-container-lg {
  @apply h-12;
}

/* Input */
.input {
  @apply flex-1 w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500;
}

.input-sm {
  @apply px-3 text-sm;
}

.input-md {
  @apply px-4 text-sm;
}

.input-lg {
  @apply px-4 text-base;
}

.input-disabled {
  @apply cursor-not-allowed;
}

/* Icons */
.input-icon {
  @apply flex items-center justify-center text-gray-400 dark:text-gray-500;
}

.input-icon-left {
  @apply pl-3;
}

.input-icon-right {
  @apply pr-3;
}

/* Messages */
.input-error {
  @apply text-xs text-red-600 dark:text-red-400;
}

.input-hint {
  @apply text-xs text-gray-500 dark:text-gray-400;
}
</style>
