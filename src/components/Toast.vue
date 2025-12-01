<template>
  <teleport to="body">
    <div class="toast-container">
      <transition-group name="toast">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="['toast', `toast-${notification.type}`]"
          role="alert"
          :aria-live="notification.type === 'error' ? 'assertive' : 'polite'"
          @click="remove(notification.id)"
        >
          <div class="toast-icon">
            <CheckCircle v-if="notification.type === 'success'" class="w-5 h-5" />
            <XCircle v-else-if="notification.type === 'error'" class="w-5 h-5" />
            <AlertTriangle v-else-if="notification.type === 'warning'" class="w-5 h-5" />
            <Info v-else class="w-5 h-5" />
          </div>
          <p class="toast-message">{{ notification.message }}</p>
          <button
            @click.stop="remove(notification.id)"
            class="toast-close"
            :aria-label="`Cerrar notificación: ${notification.message}`"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useNotificationsStore } from '@/stores/notifications'

const notificationsStore = useNotificationsStore()
const { notifications } = storeToRefs(notificationsStore)
const { remove } = notificationsStore
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 5rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 420px;
  pointer-events: none;
}

@media (max-width: 640px) {
  .toast-container {
    top: 4.5rem;
    right: 0.5rem;
    left: 0.5rem;
    max-width: none;
  }
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2),
              0 8px 10px -6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  pointer-events: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.toast:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.25),
              0 10px 15px -6px rgba(0, 0, 0, 0.15);
}

/* Success Toast */
.toast-success {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(22, 163, 74, 0.9));
  color: white;
  border-left: 4px solid #16a34a;
}

.dark .toast-success {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 0.85));
  border-left: 4px solid #22c55e;
}

/* Error Toast */
.toast-error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.9));
  color: white;
  border-left: 4px solid #dc2626;
}

.dark .toast-error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.85));
  border-left: 4px solid #ef4444;
}

/* Warning Toast */
.toast-warning {
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.95), rgba(234, 88, 12, 0.9));
  color: white;
  border-left: 4px solid #ea580c;
}

.dark .toast-warning {
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.9), rgba(234, 88, 12, 0.85));
  border-left: 4px solid #fb923c;
}

/* Info Toast */
.toast-info {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(37, 99, 235, 0.9));
  color: white;
  border-left: 4px solid #2563eb;
}

.dark .toast-info {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.85));
  border-left: 4px solid #3b82f6;
}

.toast-icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.toast-message {
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
}

.toast-close {
  flex-shrink: 0;
  padding: 0.25rem;
  border-radius: 0.375rem;
  opacity: 0.8;
  transition: all 0.2s ease;
  background: transparent;
  border: none;
  color: currentColor;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.1);
}

.toast-close:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

/* Animations */
.toast-enter-active {
  animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-leave-active {
  animation: slideOut 0.3s cubic-bezier(0.4, 0, 1, 1);
}

@keyframes slideIn {
  from {
    transform: translateX(450px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateX(450px) scale(0.95);
    opacity: 0;
  }
}

@media (max-width: 640px) {
  @keyframes slideIn {
    from {
      transform: translateY(-100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    to {
      transform: translateY(-100px) scale(0.95);
      opacity: 0;
    }
  }
}
</style>
