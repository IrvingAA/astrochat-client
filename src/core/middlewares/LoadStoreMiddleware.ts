import type { ContextIC } from '@/core/types/config/GlobalMiddlewareInterface';
import GlobalStoreService from '@/core/services/GlobalStoreService';
import useAppStoreTemp from '@/core/stores/config/useAppStoreTemp';

/**
 * Middleware to load stores
 */
export async function LoadStoresMiddleware({ next }: ContextIC): Promise<void> {
  /**
   * Import
   */
  const appStoreTemp = useAppStoreTemp()

  /**
   * Verificar si ya se cargaron los formularios
   */
  if (appStoreTemp.storesLoaded) {
    return next()
  }

  const service = new GlobalStoreService()
  await service.$init()

  appStoreTemp.storesLoaded = true

  return next()
}
