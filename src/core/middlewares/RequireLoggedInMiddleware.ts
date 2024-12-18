import type { ContextIC } from '@/core/types/config/GlobalMiddlewareInterface';
import useAuthStore from '@/core/stores/config/useAuthStore';

/**
 * Middleware para verificar que el usuario inició sesión y si no es así lo envía al login
 */
export default async function RequireLoggedInMiddleware({ next }: ContextIC): Promise<any> {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLoggedIn;

  if (!isLoggedIn) {
    return next({ name: 'auth.login' })
  }

  return next();
}
