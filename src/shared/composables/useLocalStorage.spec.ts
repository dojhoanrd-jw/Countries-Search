import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import {
  useLocalStorage,
  useLocalStorageString,
  useLocalStorageBoolean,
  useLocalStorageNumber,
} from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should initialize with default value when localStorage is empty', () => {
    const { data, isLoading } = useLocalStorage('test-key', 'default')

    expect(data.value).toBe('default')
    expect(isLoading.value).toBe(false)
  })

  it('should read existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'))

    const { data } = useLocalStorage('test-key', 'default')

    expect(data.value).toBe('stored-value')
  })

  it('should save to localStorage when value changes', async () => {
    const { data } = useLocalStorage('test-key', 'initial')

    data.value = 'updated'
    await nextTick()

    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'))
  })

  it('should handle complex objects', async () => {
    interface TestData {
      name: string
      age: number
      active: boolean
    }

    const defaultValue: TestData = { name: 'John', age: 30, active: true }
    const { data } = useLocalStorage<TestData>('test-key', defaultValue)

    data.value = { name: 'Jane', age: 25, active: false }
    await nextTick()

    const stored = localStorage.getItem('test-key')
    expect(stored).toBe(JSON.stringify({ name: 'Jane', age: 25, active: false }))
  })

  it('should clear value and reset to default', async () => {
    const { data, clear } = useLocalStorage('test-key', 'default')

    data.value = 'updated'
    await nextTick()

    clear()

    expect(data.value).toBe('default')
    expect(localStorage.getItem('test-key')).toBeNull()
  })

  it('should refresh value from localStorage', () => {
    const { data, refresh } = useLocalStorage('test-key', 'default')

    // Manually change localStorage
    localStorage.setItem('test-key', JSON.stringify('external-change'))

    refresh()

    expect(data.value).toBe('external-change')
  })

  it('should handle errors with custom error handler', () => {
    const onError = vi.fn()

    // Simulate invalid JSON in localStorage
    localStorage.setItem('test-key', 'invalid-json{')

    const { data, error } = useLocalStorage('test-key', 'default', { onError })

    expect(data.value).toBe('default')
    expect(error.value).toBeInstanceOf(Error)
    expect(onError).toHaveBeenCalled()
  })

  it('should use custom serializer', async () => {
    const customSerializer = {
      read: (value: string) => `read:${value}`,
      write: (value: string) => `write:${value}`,
    }

    const { data } = useLocalStorage('test-key', 'default', {
      serializer: customSerializer,
    })

    data.value = 'test'
    await nextTick()

    expect(localStorage.getItem('test-key')).toBe('write:test')
  })

  it('should handle deep changes in objects', async () => {
    interface NestedData {
      user: {
        name: string
        settings: {
          theme: string
        }
      }
    }

    const defaultValue: NestedData = {
      user: {
        name: 'John',
        settings: { theme: 'light' },
      },
    }

    const { data } = useLocalStorage<NestedData>('test-key', defaultValue)

    data.value.user.settings.theme = 'dark'
    await nextTick()

    const stored = JSON.parse(localStorage.getItem('test-key')!)
    expect(stored.user.settings.theme).toBe('dark')
  })
})

describe('useLocalStorageString', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should store and retrieve string without JSON serialization', async () => {
    const { data } = useLocalStorageString('test-key', 'default')

    data.value = 'plain-string'
    await nextTick()

    // Should not be JSON stringified
    expect(localStorage.getItem('test-key')).toBe('plain-string')
  })
})

describe('useLocalStorageBoolean', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should store and retrieve boolean values', async () => {
    const { data } = useLocalStorageBoolean('test-key', false)

    expect(data.value).toBe(false)

    data.value = true
    await nextTick()

    expect(localStorage.getItem('test-key')).toBe('true')

    // Refresh to verify reading
    const { data: data2 } = useLocalStorageBoolean('test-key', false)
    expect(data2.value).toBe(true)
  })
})

describe('useLocalStorageNumber', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should store and retrieve number values', async () => {
    const { data } = useLocalStorageNumber('test-key', 0)

    expect(data.value).toBe(0)

    data.value = 42
    await nextTick()

    expect(localStorage.getItem('test-key')).toBe('42')

    // Refresh to verify reading
    const { data: data2 } = useLocalStorageNumber('test-key', 0)
    expect(data2.value).toBe(42)
  })

  it('should handle decimal numbers', async () => {
    const { data } = useLocalStorageNumber('test-key', 0)

    data.value = 3.14159
    await nextTick()

    const { data: data2 } = useLocalStorageNumber('test-key', 0)
    expect(data2.value).toBe(3.14159)
  })
})
