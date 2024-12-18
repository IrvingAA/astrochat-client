import type { ContextIC } from '@/core/types/config/GlobalMiddlewareInterface';
import useAppStoreTemp from '@/core/stores/config/useAppStoreTemp';
import useEnv from '@/core/composables/useEnv';
import useUtils from '@/core/composables/useUtils';

/**
 * Middleware to load stores
 */
export async function PrintEnvDebugMiddleware({ next }: ContextIC): Promise<void> {
  /**
   * Import
   */
  const env = useEnv()
  if (env.DEBUG_MODE === 'false') return next();

  const utils = useUtils()
  const appStoreTemp = useAppStoreTemp()

  /**
   * Verificar si ya se cargaron los formularios
   */
  if (appStoreTemp.isShowedEnv) {
    return next()
  }

  utils.debugLog('log', 'Configuración de la aplicación:', env)

  appStoreTemp.isShowedEnv = true

  return next()
}
