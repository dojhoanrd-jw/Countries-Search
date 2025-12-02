import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { ROUTES, ROUTE_NAMES } from '@/core/constants/routes.constants'

/**
 * Application Routes
 * Feature-based routing with lazy loading
 */
const routes: RouteRecordRaw[] = [
  {
    path: ROUTES.DASHBOARD,
    name: ROUTE_NAMES.DASHBOARD,
    component: () => import('@/features/countries/views/Dashboard.vue'),
    meta: {
      title: 'Dashboard',
      feature: 'countries',
    },
  },
  {
    path: ROUTES.COUNTRY_DETAIL,
    name: ROUTE_NAMES.COUNTRY_DETAIL,
    component: () => import('@/features/countries/views/CountryDetail.vue'),
    props: true,
    meta: {
      title: 'Country Detail',
      feature: 'countries',
    },
  },
  {
    path: ROUTES.STATISTICS,
    name: ROUTE_NAMES.STATISTICS,
    component: () => import('@/features/statistics/views/Statistics.vue'),
    meta: {
      title: 'Statistics',
      feature: 'statistics',
    },
  },
  {
    path: ROUTES.FAVORITES,
    name: ROUTE_NAMES.FAVORITES,
    component: () => import('@/features/favorites/views/Favorites.vue'),
    meta: {
      title: 'Favorites',
      feature: 'favorites',
    },
  },
  {
    path: ROUTES.COMPARISON,
    name: ROUTE_NAMES.COMPARISON,
    component: () => import('@/features/comparison/views/Compare.vue'),
    meta: {
      title: 'Compare',
      feature: 'comparison',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

// Navigation guards can be added here
router.beforeEach((to, from, next) => {
  // Update document title
  const defaultTitle = 'Countries Search'
  document.title = to.meta.title ? `${to.meta.title} | ${defaultTitle}` : defaultTitle

  next()
})

export default router
