import type { ContextIC } from '@/core/types/config/GlobalMiddlewareInterface';
import useAuthStore from '@/core/stores/config/useAuthStore';

/**
 * Middleware para verificar que el usuario sea un invitado (no inició sesión) y si no es asi lo envia al dashboard
 */
export default async function RequireGuestMiddleware({ next }: ContextIC): Promise<any> {
  const authStore = useAuthStore();
  if (authStore.isLoggedIn) return next({ name: 'dashboard.index' });

  return next();
}
