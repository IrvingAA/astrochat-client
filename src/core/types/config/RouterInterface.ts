import type { RouteRecordRaw } from 'vue-router';
import type { MiddlewareIC } from '@/core/types/config/GlobalMiddlewareInterface';

/**
 * Tipado de rutas
 */
export type RouteIC = RouteRecordRaw & {
  meta?: RouteMetaIC;
  children?: RouteIC[];
};

/**
 * Tipado de meta de rutas
 */
export type RouteMetaIC = {
  middlewares?: MiddlewareIC[];
};
