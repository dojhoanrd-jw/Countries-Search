import { defineStore } from 'pinia'
import { ref, onUnmounted } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  duration?: number
}

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  const timeouts = new Map<string, ReturnType<typeof setTimeout>>()

  const show = (
    message: string,
    type: NotificationType = 'info',
    duration = 5000
  ) => {
    // Prevent duplicate notifications
    const exists = notifications.value.some(
      (n) => n.message === message && n.type === type
    )
    if (exists) return

    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    notifications.value.push({ id, message, type, duration })

    if (duration > 0) {
      const timeout = setTimeout(() => remove(id), duration)
      timeouts.set(id, timeout)
    }

    return id
  }

  const remove = (id: string) => {
    // Clear timeout if exists
    const timeout = timeouts.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeouts.delete(id)
    }

    // Remove notification
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const success = (message: string, duration = 4000) => {
    return show(message, 'success', duration)
  }

  const error = (message: string, duration = 7000) => {
    return show(message, 'error', duration)
  }

  const warning = (message: string, duration = 5000) => {
    return show(message, 'warning', duration)
  }

  const info = (message: string, duration = 5000) => {
    return show(message, 'info', duration)
  }

  const clear = () => {
    // Clear all pending timeouts
    timeouts.forEach((timeout) => clearTimeout(timeout))
    timeouts.clear()
    notifications.value = []
  }

  // Cleanup on store disposal
  onUnmounted(() => {
    clear()
  })

  return {
    notifications,
    show,
    remove,
    success,
    error,
    warning,
    info,
    clear,
  }
})
