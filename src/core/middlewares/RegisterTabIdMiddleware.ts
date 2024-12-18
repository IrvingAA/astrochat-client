import type { ContextIC } from '@/core/types/config/GlobalMiddlewareInterface';
import AppService from '@/core/services/AppService';

/**
 * Middleware para garantizar que solo se pueda abrir una pestaña de la aplicación
 */
export default async function RegisterTabIdMiddleware({ next }: ContextIC) {
  const service = new AppService();
  await service.registerTabId();
  return next();
}
