import useEnv from '@/core/composables/useEnv';
import type { ContextIC } from '@/core/types/config/GlobalMiddlewareInterface';

/**
 * Metodo para redirigir al dashboard
 */
export async function CleanDatabaseMiddleware({ next }: ContextIC): Promise<void> {
  const app_name = useEnv().APP_NAME
  const app_db_name = useEnv().DB_NAME

  try {
    const databasesList = await indexedDB.databases()
    const databasesListFiltered = databasesList.filter((db) => {
      if (!db.name) return false
      //@ts-ignore
      if (!db.name.includes(app_name)) return false
      return true;
    });

    for (const db of databasesListFiltered) {
      if (!db.name || db.name === app_db_name) continue

      console.log('Eliminando la base de datos: ', db.name)
      indexedDB.deleteDatabase(db.name)
    }
  } catch (error: any) {
    console.error('No se pueden limpiar las bases de datos: ', error.message)
  }

  return next()
}

