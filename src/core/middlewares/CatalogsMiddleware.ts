import type { ContextIC } from '@/core/types/config/GlobalMiddlewareInterface';
import CatalogsService from '@/core/services/CatalogsService';

/**
 * Middleware para obtener los catalogos
 */
export default async function CatalogsMiddleware({ next, to }: ContextIC): Promise<any> {
  /**
   * Paths a omitir
   */
  switch (to.name) {
    case 'auth.login':
      return next();

    default:
    //No hacer nada
  }
  try {
    const catalogsService = new CatalogsService();
    await catalogsService.saveCatalogsOnPinia();
  } catch (error) {
    return next();
  }

  return next();
}
