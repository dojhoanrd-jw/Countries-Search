/**
 * Route Constants
 * Centralized route paths
 */

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
  COUNTRY_DETAIL: '/country/:code',
  STATISTICS: '/statistics',
  FAVORITES: '/favorites',
  COMPARISON: '/compare',
} as const

export const ROUTE_NAMES = {
  DASHBOARD: 'dashboard',
  COUNTRY_DETAIL: 'country-detail',
  STATISTICS: 'statistics',
  FAVORITES: 'favorites',
  COMPARISON: 'compare',
} as const
