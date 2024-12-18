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

// Función recursiva para obtener todos los padres de una ruta
function findAllParentRoutes(childPath: string, routes: RouteRecordRaw[], visitedPaths: string[] = []): RouteRecordRaw[] {
  for (const route of routes) {
    // Evita ciclos infinitos verificando si ya visitamos esta ruta
    if (visitedPaths.includes(route.path)) {
      continue; // Ya hemos visitado esta ruta, la ignoramos
    }

    // Verifica si la ruta actual tiene hijos y si alguno de esos hijos coincide con el childPath
    if (route.children && route.children.some((child) => child.path === childPath)) {
      // Marca la ruta actual como visitada
      visitedPaths.push(route.path);

      // Busca los padres de esta ruta recursivamente
      const parents = findAllParentRoutes(route.path, routes, visitedPaths);

      // Devuelve este padre junto con los padres anteriores
      return [...parents, route];
    }

    // Si hay rutas hijas, busca recursivamente en los hijos
    if (route.children) {
      const foundInChildren = findAllParentRoutes(childPath, route.children, visitedPaths);
      if (foundInChildren.length > 0) {
        return foundInChildren;
      }
    }
  }

  // Si no se encontró la ruta padre, devuelve un array vacío
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

    //por cada padre, si tiene middlewares, los agrega
    parents.forEach((parent) => {
      if (parent.meta?.middlewares && Array.isArray(parent.meta.middlewares) && parent.meta.middlewares.length) {
        allMiddlewares.push(...parent.meta.middlewares);
      }
    });

    if (to.meta?.middlewares && Array.isArray(to.meta.middlewares) && to.meta.middlewares.length) {
      allMiddlewares.push(...to.meta.middlewares);
    }

    //Eliminar middlewares duplicados
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
