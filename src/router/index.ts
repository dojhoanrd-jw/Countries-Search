import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('@/views/Statistics.vue'),
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/Favorites.vue'),
    },
    {
      path: '/compare',
      name: 'compare',
      component: () => import('@/views/Compare.vue'),
    },
    {
      path: '/country/:code',
      name: 'country-detail',
      component: () => import('@/views/CountryDetail.vue'),
      props: true,
    },
  ],
})

export default router
