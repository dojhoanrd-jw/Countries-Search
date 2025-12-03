import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useErrorHandler } from './useErrorHandler'
import type { AxiosError } from 'axios'

describe('useErrorHandler', () => {
  beforeEach(() => {
    // Reset navigator.onLine to true before each test
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)
  })

  describe('parseError', () => {
    it('should handle network errors when offline', () => {
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
      const { parseError } = useErrorHandler()

      const error = { code: 'NETWORK_ERROR', message: 'Network Error' } as AxiosError
      const info = parseError(error)

      expect(info.isNetworkError).toBe(true)
      expect(info.message).toContain('Sin conexión a internet')
    })

    it('should handle timeout errors', () => {
      const { parseError } = useErrorHandler()
      const error = { code: 'ECONNABORTED', message: 'timeout of 5000ms exceeded' } as AxiosError
      const info = parseError(error)

      expect(info.isTimeout).toBe(true)
      expect(info.message).toContain('La solicitud tardó demasiado')
    })

    it('should handle 400 bad request', () => {
      const { parseError } = useErrorHandler()
      const error = {
        response: { status: 400 },
        code: 'ERR_BAD_REQUEST',
      } as AxiosError

      const info = parseError(error)

      expect(info.isClientError).toBe(true)
      expect(info.status).toBe(400)
      expect(info.message).toContain('Solicitud inválida')
    })

    it('should handle 401 unauthorized', () => {
      const { parseError } = useErrorHandler()
      const error = {
        response: { status: 401 },
        code: 'ERR_BAD_REQUEST',
      } as AxiosError

      const info = parseError(error)

      expect(info.isClientError).toBe(true)
      expect(info.status).toBe(401)
      expect(info.message).toContain('No autorizado')
    })

    it('should handle 403 forbidden', () => {
      const { parseError } = useErrorHandler()
      const error = {
        response: { status: 403 },
        code: 'ERR_BAD_REQUEST',
      } as AxiosError

      const info = parseError(error)

      expect(info.isClientError).toBe(true)
      expect(info.status).toBe(403)
      expect(info.message).toContain('Acceso denegado')
    })

    it('should handle 404 not found', () => {
      const { parseError } = useErrorHandler()
      const error = {
        response: { status: 404 },
        code: 'ERR_BAD_REQUEST',
      } as AxiosError

      const info = parseError(error)

      expect(info.isClientError).toBe(true)
      expect(info.status).toBe(404)
      expect(info.message).toContain('No se encontraron los datos')
    })

    it('should handle 429 too many requests', () => {
      const { parseError } = useErrorHandler()
      const error = {
        response: { status: 429 },
        code: 'ERR_BAD_REQUEST',
      } as AxiosError

      const info = parseError(error)

      expect(info.isClientError).toBe(true)
      expect(info.status).toBe(429)
      expect(info.message).toContain('Demasiadas solicitudes')
    })

    it('should handle 500 server errors', () => {
      const { parseError } = useErrorHandler()
      const error = {
        response: { status: 500 },
        code: 'ERR_INTERNAL_SERVER_ERROR',
      } as AxiosError

      const info = parseError(error)

      expect(info.isServerError).toBe(true)
      expect(info.status).toBe(500)
      expect(info.message).toContain('Error del servidor')
    })

    it('should handle cancelled requests', () => {
      const { parseError } = useErrorHandler()
      const error = {
        code: 'ERR_CANCELED',
        message: 'Request cancelled',
      } as AxiosError

      const info = parseError(error)

      expect(info.message).toContain('Solicitud cancelada')
    })

    it('should handle generic network errors', () => {
      const { parseError } = useErrorHandler()
      const error = {
        message: 'Network Error',
        code: 'ERR_NETWORK',
      } as AxiosError

      const info = parseError(error)

      expect(info.isNetworkError).toBe(true)
      expect(info.message).toContain('Error de red')
    })

    it('should handle unknown errors with default message', () => {
      const { parseError } = useErrorHandler()
      const error = {
        message: 'Some unknown error',
        code: 'UNKNOWN',
      } as AxiosError

      const info = parseError(error)

      expect(info.message).toContain('Ha ocurrido un error inesperado')
    })
  })

  describe('getErrorMessage', () => {
    it('should return parsed error message', () => {
      const { getErrorMessage } = useErrorHandler()
      const error = {
        response: { status: 404 },
      } as AxiosError

      const message = getErrorMessage(error)

      expect(message).toContain('No se encontraron los datos')
    })

    it('should return fallback message for invalid errors', () => {
      const { getErrorMessage } = useErrorHandler()
      const message = getErrorMessage(null, 'Custom fallback')

      expect(message).toBe('Custom fallback')
    })

    it('should use default fallback when none provided', () => {
      const { getErrorMessage } = useErrorHandler()
      const message = getErrorMessage(null)

      expect(message).toBe('Ha ocurrido un error inesperado')
    })
  })

  describe('isRetryable', () => {
    it('should return true for network errors', () => {
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
      const { isRetryable } = useErrorHandler()

      const error = { code: 'NETWORK_ERROR' } as AxiosError
      expect(isRetryable(error)).toBe(true)
    })

    it('should return true for timeout errors', () => {
      const { isRetryable } = useErrorHandler()
      const error = { code: 'ECONNABORTED' } as AxiosError
      expect(isRetryable(error)).toBe(true)
    })

    it('should return true for server errors', () => {
      const { isRetryable } = useErrorHandler()
      const error = {
        response: { status: 500 },
      } as AxiosError

      expect(isRetryable(error)).toBe(true)
    })

    it('should return false for client errors', () => {
      const { isRetryable } = useErrorHandler()
      const error = {
        response: { status: 404 },
      } as AxiosError

      expect(isRetryable(error)).toBe(false)
    })

    it('should return false for cancelled requests', () => {
      const { isRetryable } = useErrorHandler()
      const error = { code: 'ERR_CANCELED' } as AxiosError
      expect(isRetryable(error)).toBe(false)
    })
  })

  describe('shouldLog', () => {
    it('should return false for cancelled requests', () => {
      const { shouldLog } = useErrorHandler()
      const error = { code: 'ERR_CANCELED' } as AxiosError
      expect(shouldLog(error)).toBe(false)
    })

    it('should return false for 404 errors', () => {
      const { shouldLog } = useErrorHandler()
      const error = {
        response: { status: 404 },
      } as AxiosError

      expect(shouldLog(error)).toBe(false)
    })

    it('should return true for other errors', () => {
      const { shouldLog } = useErrorHandler()
      const error = {
        response: { status: 500 },
      } as AxiosError

      expect(shouldLog(error)).toBe(true)
    })
  })
})
