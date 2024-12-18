import useEnv from '@/core/composables/useEnv';
import type { ContextIC } from '@/core/types/config/GlobalMiddlewareInterface';

/**
 * Middleware para verificar que la aplicación esté en modo de depuración
 */
export default async function RequireDebugModeMiddleware({ next }: ContextIC): Promise<any> {
  const env = useEnv();
  const isDebugMode: boolean = env.DEBUG_MODE == 'true';

  if (!isDebugMode) {
    return next('/');
  }

  return next();
}
