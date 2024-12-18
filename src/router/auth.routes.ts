import RequireGuestMiddleware from '@/core/middlewares/RequireGuestMiddleware';
import type { RouteIC } from '@/core/types/config/RouterInterface';

/**
 * Aqui se definen las rutas de "Auth"
 */
const authRoutes: RouteIC[] = [
  {
    // AuthLayout
    path: '/',
    component: () => import('@/layouts/AuthLayout.vue'), //Layout
    redirect: { name: 'auth.login' },
    children: [
      {
        path: '/auth',
        redirect: { name: 'auth.login' }
      },
      {
        path: '/auth/login',
        name: 'auth.login',
        component: () => import('@/pages/auth/LoginPage.vue'),
        meta: {
          middlewares: [RequireGuestMiddleware]
        }
      }
    ]
  }
]

export default authRoutes
