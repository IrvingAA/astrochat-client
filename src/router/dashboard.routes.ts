import RequireLoggedInMiddleware from '@/core/middlewares/RequireLoggedInMiddleware';
import type { RouteIC } from '@/core/types/config/RouterInterface';

/**
 * Aqui se definen las rutas de "Dashboard"
 */
const dashboardRoutes: RouteIC[] = [
  {
    path: '/dashboard',
    component: () => import('@/layouts/DashboardLayout.vue'), //Layout

    children: [
      {
        name: 'dashboard.index',
        path: '/dashboard',
        component: () => import('@/pages/dashboard/IndexPage.vue')
      },
      //
    ]
  }
]

export default dashboardRoutes
