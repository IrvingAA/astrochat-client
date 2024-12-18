import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router';

/**
 * Tipado de context en nextFactory
 */
export type NextFactoryContextIC = {
  from: RouteLocationNormalized;
  to: RouteLocationNormalized;
  next: NavigationGuardNext;
  router: Router;
};

/**
 * Tipado para el objeto que reciben los middlewares
 */
export type ContextIC = NextFactoryContextIC;

/**
 * Tipado de funcion middlware
 */
export type MiddlewareIC = (context: ContextIC) => any | Promise<any>;
