import type { AxiosError } from 'axios'

export interface ErrorInfo {
  message: string
  code?: string
  status?: number
  isNetworkError: boolean
  isTimeout: boolean
  isClientError: boolean
  isServerError: boolean
}

/**
 * Parse and categorize errors
 */
export function useErrorHandler() {
  /**
   * Parse an Axios error into a structured ErrorInfo object
   */
  const parseError = (error: any): ErrorInfo => {
    const axiosError = error as AxiosError

    const info: ErrorInfo = {
      message: 'Ha ocurrido un error inesperado',
      code: axiosError.code,
      status: axiosError.response?.status,
      isNetworkError: false,
      isTimeout: false,
      isClientError: false,
      isServerError: false,
    }

    // Network/Connection errors
    if (!navigator.onLine) {
      info.isNetworkError = true
      info.message = 'Sin conexión a internet. Por favor, verifica tu red.'
      return info
    }

    // Timeout errors
    if (axiosError.code === 'ECONNABORTED' || axiosError.message?.includes('timeout')) {
      info.isTimeout = true
      info.message = 'La solicitud tardó demasiado. Verifica tu conexión e intenta de nuevo.'
      return info
    }

    // HTTP status errors
    if (axiosError.response?.status) {
      const status = axiosError.response.status

      // Client errors (4xx)
      if (status >= 400 && status < 500) {
        info.isClientError = true

        switch (status) {
          case 400:
            info.message = 'Solicitud inválida. Por favor, verifica los datos.'
            break
          case 401:
            info.message = 'No autorizado. Por favor, inicia sesión.'
            break
          case 403:
            info.message = 'Acceso denegado. No tienes permisos para esta acción.'
            break
          case 404:
            info.message = 'No se encontraron los datos solicitados.'
            break
          case 429:
            info.message = 'Demasiadas solicitudes. Por favor, espera un momento.'
            break
          default:
            info.message = 'Error en la solicitud. Por favor, intenta de nuevo.'
        }
        return info
      }

      // Server errors (5xx)
      if (status >= 500) {
        info.isServerError = true
        info.message = 'Error del servidor. Por favor, intenta más tarde.'
        return info
      }
    }

    // Cancelled requests
    if (axiosError.code === 'ERR_CANCELED') {
      info.message = 'Solicitud cancelada'
      return info
    }

    // Generic network error
    if (axiosError.message?.includes('Network Error')) {
      info.isNetworkError = true
      info.message = 'Error de red. Por favor, verifica tu conexión.'
      return info
    }

    return info
  }

  /**
   * Get a user-friendly error message from any error
   */
  const getErrorMessage = (error: any, fallback = 'Ha ocurrido un error inesperado'): string => {
    try {
      const info = parseError(error)
      return info.message || fallback
    } catch {
      return fallback
    }
  }

  /**
   * Check if error is retryable
   */
  const isRetryable = (error: any): boolean => {
    const info = parseError(error)
    return info.isNetworkError || info.isTimeout || info.isServerError
  }

  /**
   * Check if error should be logged
   */
  const shouldLog = (error: any): boolean => {
    const info = parseError(error)
    // Don't log cancelled requests or 404s
    return !(error.code === 'ERR_CANCELED' || info.status === 404)
  }

  return {
    parseError,
    getErrorMessage,
    isRetryable,
    shouldLog,
  }
}
