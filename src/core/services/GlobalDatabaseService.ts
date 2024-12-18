import useUtils from '@/core/composables/useUtils';

/**
 * Clase Base de datos global
 */
export default class GlobalDatabaseService {
  /**
   * Contructor de la clase
   */
  constructor() {
    //
  }

  /**
   * Get of useUtils
   */
  public get utils() {
    return useUtils();
  }

  /**
   * Limpia las bases de datos.
   * Puede recibir un arreglo de nombres de clases de base de datos que no se deben limpiar.
   *
   * @param {string[]} exceptions
   * @returns {Promise<void>}
   */
  public async $reset(exceptions: string[] = []): Promise<void> {
    this.utils.debugLog('log', 'Limpiando todas las bases de datos');

    // Instancia todas las clases de base de datos
    const classesDB = {
      ...import.meta.glob('@/databases/*.ts'),
      ...import.meta.glob('@/core/databases/**/*.ts'),
    };

    // Arreglo de clases de base de datos
    const databasesClasses: any[] = [];

    // Obtiene todas las clases de base de datos
    for (const path in classesDB) {
      if (path.includes('/Database.ts')) continue;

      const dbClass = await classesDB[path]();
      // @ts-ignore
      if (!dbClass.default) continue;

      // Validación de path
      const parts = path.split('/');
      const filenameWithExtension = parts[parts.length - 1];
      const nameClass = filenameWithExtension.replace('.ts', '');

      if (exceptions.includes(nameClass)) {
        this.utils.debugLog('log', `Ignorando la limpieza de la base de datos "${nameClass}"`);
        continue;
      }

      // @ts-ignore
      databasesClasses.push(dbClass.default);
    }

    // Array para almacenar las promesas de reinicio
    const resetPromises: Promise<void>[] = databasesClasses.map((dbClass) => {
      return new Promise<void>((resolve) => {
        try {
          const dbInstance = new dbClass();
          dbInstance.$reset().then(() => {
            this.utils.debugLog('log', `Base de datos "${dbInstance.storeName}" limpiada`);
            resolve();
          }).catch((error: any) => {
            this.utils.debugLog('error', `Error al reestablecer la base de datos: ${dbClass.name}`, error);
            resolve(); // Resolver incluso en caso de error
          });
        } catch (error) {
          this.utils.debugLog('error', `Error al crear la instancia de la base de datos: ${dbClass.name}`, error);
          resolve(); // Resolver en caso de error al crear la instancia
        }
      });
    });

    // Espera a que todas las promesas de reinicio se completen
    await Promise.all(resetPromises);
  }
}
