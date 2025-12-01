<template>
  <div v-if="error" class="error-boundary">
    <div class="error-content">
      <div class="error-icon">
        <AlertTriangle class="w-16 h-16 text-red-500" />
      </div>

      <h1 class="error-title">Algo salió mal</h1>

      <p class="error-message">
        {{ errorMessage }}
      </p>

      <div v-if="showDetails && errorDetails" class="error-details">
        <button
          @click="detailsExpanded = !detailsExpanded"
          class="details-toggle"
        >
          {{ detailsExpanded ? 'Ocultar detalles' : 'Ver detalles técnicos' }}
          <ChevronDown
            class="w-4 h-4 transition-transform"
            :class="{ 'rotate-180': detailsExpanded }"
          />
        </button>

        <div v-if="detailsExpanded" class="details-content">
          <pre>{{ errorDetails }}</pre>
        </div>
      </div>

      <div class="error-actions">
        <button @click="handleRetry" class="btn-primary">
          <RotateCcw class="w-5 h-5" />
          Reintentar
        </button>

        <button @click="handleGoHome" class="btn-secondary">
          <Home class="w-5 h-5" />
          Ir al inicio
        </button>
      </div>

      <p class="error-footer">
        Si el problema persiste, intenta recargar la página
      </p>
    </div>
  </div>

  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { AlertTriangle, RotateCcw, Home, ChevronDown } from 'lucide-vue-next'

interface Props {
  /**
   * Custom error message to show to users
   */
  fallbackMessage?: string

  /**
   * Show technical error details (only in development)
   */
  showDetails?: boolean

  /**
   * Callback when error is caught
   */
  onError?: (error: Error) => void
}

const props = withDefaults(defineProps<Props>(), {
  fallbackMessage: 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.',
  showDetails: import.meta.env.DEV, // Only show in development
})

const router = useRouter()
const error = ref<Error | null>(null)
const errorDetails = ref<string>('')
const detailsExpanded = ref(false)

const errorMessage = ref<string>(props.fallbackMessage)

// Capture errors from child components
onErrorCaptured((err: Error, instance, info) => {
  console.error('Error captured by ErrorBoundary:', err)
  console.error('Component:', instance)
  console.error('Error info:', info)

  error.value = err
  errorMessage.value = getErrorMessage(err)

  if (props.showDetails) {
    errorDetails.value = `
Error: ${err.message}
Stack: ${err.stack || 'No stack trace available'}
Component: ${instance?.$options?.name || 'Unknown'}
Info: ${info}
    `.trim()
  }

  // Call custom error handler if provided
  props.onError?.(err)

  // Prevent error from propagating up
  return false
})

function getErrorMessage(err: Error): string {
  // Customize error messages based on error type
  if (err.message.includes('fetch') || err.message.includes('network')) {
    return 'Error de conexión. Por favor, verifica tu internet e intenta de nuevo.'
  }

  if (err.message.includes('timeout')) {
    return 'La operación tardó demasiado. Por favor, intenta de nuevo.'
  }

  if (err.message.includes('undefined') || err.message.includes('null')) {
    return 'No se pudieron cargar algunos datos. Por favor, intenta de nuevo.'
  }

  return props.fallbackMessage
}

function handleRetry() {
  error.value = null
  errorDetails.value = ''
  detailsExpanded.value = false
}

function handleGoHome() {
  error.value = null
  errorDetails.value = ''
  detailsExpanded.value = false
  router.push('/')
}
</script>

<style scoped>
.error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.dark .error-boundary {
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
}

.error-content {
  max-width: 600px;
  width: 100%;
  text-align: center;
  background: white;
  padding: 3rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.dark .error-content {
  background: #1f1f1f;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.error-icon {
  margin-bottom: 1.5rem;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.error-title {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
}

.dark .error-title {
  color: #f9fafb;
}

.error-message {
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.dark .error-message {
  color: #9ca3af;
}

.error-details {
  margin-bottom: 2rem;
}

.details-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  background: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .details-toggle {
  background: #374151;
  color: #9ca3af;
}

.details-toggle:hover {
  background: #e5e7eb;
}

.dark .details-toggle:hover {
  background: #4b5563;
}

.details-content {
  margin-top: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  text-align: left;
  max-height: 300px;
  overflow-y: auto;
}

.dark .details-content {
  background: #111827;
  border-color: #374151;
}

.details-content pre {
  margin: 0;
  font-size: 0.75rem;
  color: #374151;
  white-space: pre-wrap;
  word-break: break-word;
}

.dark .details-content pre {
  color: #d1d5db;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.btn-primary {
  background: #004aad;
  color: white;
}

.btn-primary:hover {
  background: #003d8f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 74, 173, 0.3);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.dark .btn-secondary {
  background: #374151;
  color: #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}

.dark .btn-secondary:hover {
  background: #4b5563;
}

.error-footer {
  font-size: 0.875rem;
  color: #9ca3af;
}

.dark .error-footer {
  color: #6b7280;
}

@media (max-width: 640px) {
  .error-content {
    padding: 2rem 1.5rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-message {
    font-size: 1rem;
  }

  .error-actions {
    flex-direction: column;
  }
}
</style>
