import useEnv from '@/core/composables/useEnv';
import RequireDebugModeMiddleware from '@/core/middlewares/RequireDebugModeMiddleware';
import type { RouteIC } from '@/core/types/config/RouterInterface';

/**
 * Environment
 */
const env = useEnv();

/**
 * Aqui se definen las rutas de "Test"
 */
let testRoutes: RouteIC[] = [
  {
    path: '/test',
    component: () => import('@/layouts/SimpleLayout.vue'), //Layout,
    meta: {
      middlewares: [
        RequireDebugModeMiddleware
      ]
    },
    children: [
      {
        path: '/test/',
        name: 'test.index',
        component: () => import('@/pages/test/TestIndexPage.vue') //Page
      },
      {
        path: '/test/fg',
        name: 'test.fg',
        component: () => import('@/pages/test/TestFormGenerator.vue') //Page
      },
      {
        path: '/test/tg',
        name: 'test.tg',
        component: () => import('@/pages/test/TestTableGenerator.vue') //Page
      },
      {
        path: '/test/flg',
        name: 'test.flg',
        component: () => import('@/pages/test/TestFormListGenerator.vue') //Page
      },
      {
        path: '/test/one',
        name: 'test.one',
        component: () => import('@/pages/test/TestOne.vue') //Page
      }
    ]
  }
]

if (env.DEBUG_MODE !== 'true') testRoutes = []
export default testRoutes
