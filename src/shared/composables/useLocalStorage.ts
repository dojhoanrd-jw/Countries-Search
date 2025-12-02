import { ref, watch, type Ref } from 'vue'

export interface UseLocalStorageOptions<T> {
  serializer?: {
    read: (value: string) => T
    write: (value: T) => string
  }
  onError?: (error: Error) => void
  initOnMounted?: boolean
}

const defaultSerializer = {
  read: <T>(value: string): T => JSON.parse(value),
  write: <T>(value: T): string => JSON.stringify(value),
}

/**
 * Reactive localStorage composable
 * Automatically syncs reactive state with localStorage
 *
 * @example
 * ```ts
 * const { data, isLoading, error, clear } = useLocalStorage('theme', 'light')
 *
 * // Change value - automatically saves to localStorage
 * data.value = 'dark'
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: UseLocalStorageOptions<T> = {}
): {
  data: Ref<T>
  isLoading: Ref<boolean>
  error: Ref<Error | null>
  clear: () => void
  refresh: () => void
} {
  const {
    serializer = defaultSerializer,
    onError = (error) => console.error(`[useLocalStorage] Error with key "${key}":`, error),
  } = options

  const data = ref<T>(defaultValue) as Ref<T>
  const isLoading = ref(true)
  const error = ref<Error | null>(null)

  /**
   * Read value from localStorage
   */
  const read = (): T => {
    try {
      const stored = localStorage.getItem(key)

      if (stored === null) {
        return defaultValue
      }

      return serializer.read(stored)
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      error.value = err
      onError(err)
      return defaultValue
    }
  }

  /**
   * Write value to localStorage
   */
  const write = (value: T): void => {
    try {
      const serialized = serializer.write(value)
      localStorage.setItem(key, serialized)
      error.value = null
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      error.value = err
      onError(err)
    }
  }

  /**
   * Clear value from localStorage
   */
  const clear = (): void => {
    try {
      localStorage.removeItem(key)
      data.value = defaultValue
      error.value = null
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      error.value = err
      onError(err)
    }
  }

  /**
   * Refresh value from localStorage
   */
  const refresh = (): void => {
    data.value = read()
  }

  // Initialize
  data.value = read()
  isLoading.value = false

  // Watch for changes and auto-save
  watch(
    data,
    (newValue) => {
      write(newValue)
    },
    { deep: true }
  )

  // Listen for storage events from other tabs/windows
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === key && e.newValue !== serializer.write(data.value)) {
      refresh()
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageChange)
  }

  return {
    data,
    isLoading,
    error,
    clear,
    refresh,
  }
}

/**
 * Simple string storage (no serialization)
 */
export function useLocalStorageString(key: string, defaultValue: string) {
  return useLocalStorage(key, defaultValue, {
    serializer: {
      read: (value) => value,
      write: (value) => value,
    },
  })
}

/**
 * Boolean storage
 */
export function useLocalStorageBoolean(key: string, defaultValue: boolean) {
  return useLocalStorage(key, defaultValue, {
    serializer: {
      read: (value) => value === 'true',
      write: (value) => String(value),
    },
  })
}

/**
 * Number storage
 */
export function useLocalStorageNumber(key: string, defaultValue: number) {
  return useLocalStorage(key, defaultValue, {
    serializer: {
      read: (value) => Number(value),
      write: (value) => String(value),
    },
  })
}
