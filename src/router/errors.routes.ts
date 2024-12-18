import type { RouteIC } from '@/core/types/config/RouterInterface';

/**
 * Aqui se definen las rutas de "Errores"
 */
const errorRoutes: RouteIC[] = [
  {
    path: '/:catchAll(.*)',
    component: () => import('@/layouts/ErrorsLayout.vue'),
    children: [
      {
        path: '/:catchAll(.*)',
        name: 'errors.404',
        component: () => import('@/pages/errors/ErrorPage404.vue')
      },
    ],
  },
  {
    path: '/error',
    component: () => import('@/layouts/ErrorsLayout.vue'),
    children: [
      {
        path: '/error/unauthorized',
        name: 'errors.401',
        component: () => import('@/pages/errors/ErrorPage401.vue')
      },
    ]
  }
]

export default errorRoutes
