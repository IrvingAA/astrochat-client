import type { ContextIC } from '@/core/types/config/GlobalMiddlewareInterface'
import AuthService from '@/core/services/AuthService'
import useAuthStore from '@/core/stores/config/useAuthStore'

/**
 * Middleware para obtener la sesion del usuario
 */
export default async function SessionMiddleware({ next }: ContextIC): Promise<any> {
  const authStore = useAuthStore()
  const authService = new AuthService()

  if (authStore.isLoggedIn) {
    authStore.printSession()
    return next()
  }

  const isAuthOnIndexedDB = await authService.isAuthOnIndexedDB()
  if (!isAuthOnIndexedDB) return next()

  const isAuthOnServer = await authService.isAuthOnServer()
  if (!isAuthOnServer) {
    await authService.forceLogout('Sesión expirada automáticamente (Middleware 401)')
    return next()
  }

  await authService.loadUserOnStore()
  authStore.printSession()

  return next()
}
