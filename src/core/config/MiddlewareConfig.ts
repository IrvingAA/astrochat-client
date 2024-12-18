import type { MiddlewareIC, NextFactoryContextIC } from '@/core/types/config/GlobalMiddlewareInterface';
import GlobalMiddlewares from '@/middlewares/GlobalMiddlewares';
import type { Router, RouteRecordRaw } from 'vue-router';

/**
 * Crea una función que ejecuta los middlewares
 */
async function nextFactory(context: NextFactoryContextIC, middlewares: MiddlewareIC[], index: number): Promise<any> {
  const middleware = middlewares[index];
  if (!middleware) return context.next;

  return async () => {
    const nextMiddleware = await nextFactory(context, middlewares, index + 1);
    return await middleware({ ...context, next: nextMiddleware });
  };
}


function findAllParentRoutes(childPath: string, routes: RouteRecordRaw[], visitedPaths: string[] = []): RouteRecordRaw[] {
  for (const route of routes) {

    if (visitedPaths.includes(route.path)) {
      continue;
    }


    if (route.children && route.children.some((child) => child.path === childPath)) {

      visitedPaths.push(route.path);


      const parents = findAllParentRoutes(route.path, routes, visitedPaths);


      return [...parents, route];
    }


    if (route.children) {
      const foundInChildren = findAllParentRoutes(childPath, route.children, visitedPaths);
      if (foundInChildren.length > 0) {
        return foundInChildren;
      }
    }
  }


  return [];
}

/**
 * Implementa los middlewares en el router
 */
async function implementsMiddlewareOnRouter(router: Router): Promise<void> {
  router.beforeEach(async (to, from, next) => {
    /**
     * Combina los middlewares globales con los de la ruta
     */
    const allMiddlewares: MiddlewareIC[] = [];
    if (GlobalMiddlewares.length) allMiddlewares.push(...GlobalMiddlewares);

    const parents = findAllParentRoutes(to.path, router.getRoutes());


    parents.forEach((parent) => {
      if (parent.meta?.middlewares && Array.isArray(parent.meta.middlewares) && parent.meta.middlewares.length) {
        allMiddlewares.push(...parent.meta.middlewares);
      }
    });

    if (to.meta?.middlewares && Array.isArray(to.meta.middlewares) && to.meta.middlewares.length) {
      allMiddlewares.push(...to.meta.middlewares);
    }


    const uniqueMiddlewares = allMiddlewares.filter((middleware, index) => allMiddlewares.indexOf(middleware) === index);

    /**
     * Si no hay middlewares, termina la ejecución
     */
    if (!allMiddlewares.length) {
      return next();
    }

    /**
     * Si hay middlewares, los ejecuta
     */
    const context = { from, to, next, router };
    const nextMiddleware = await nextFactory(context, uniqueMiddlewares, 1);
    return allMiddlewares[0]({ ...context, next: nextMiddleware });
  });
}

export {
  implementsMiddlewareOnRouter
}
