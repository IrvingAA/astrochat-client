import ManualError from '@/core/config/ManualError';
import type { ExtendedPinia } from '@/core/types/services/GlobalStoreInterface';
import { getActivePinia, type Store } from 'pinia';
import useUtils from '../composables/useUtils';

/**
 * Clase para el servicio del Global Store
 */
export default class GlobalStoreService {
  /**
   * Get of useUtils
   */
  public get utils() {
    return useUtils();
  }

  /**
   * Metodo para inicializar todos los Stores
   */
  public $init = async (): Promise<void> => {
    // Obtenemos los archivos de los Stores de la carpeta /src/stores y /src/core/stores
    const modulesCore = import.meta.glob('@/core/stores/**/*.ts');
    const modulesApp = import.meta.glob('@/stores/**/*.ts');

    const allModules = {
      ...modulesCore,
      ...modulesApp,
    };

    const pathsIgnores = ['/index.ts', '/store-flag.d.ts', '/example-store.ts'];

    // Crear un array de promesas para inicializar los stores
    const initPromises = Object.keys(allModules).map((path) => {
      if (pathsIgnores.some((pathIgnore) => path.includes(pathIgnore))) return Promise.resolve();

      const store = allModules[path];
      return store()
        .then((storeModule) => {
          try {
            // @ts-ignore
            const { default: makeStore } = storeModule;
            return makeStore();
          } catch (error) {
            console.error('Error al inicializar el Store [$init()]', {
              store: path,
              error,
            });
          }
        });
    });

    // Esperamos a que todas las promesas de inicialización se completen
    await Promise.all(initPromises);
  };

  /**
   * Metodo para reiniciar todos los Stores
   */
  public $reset = async (exceptions: string[] = []): Promise<void> => {
    this.utils.debugLog('log', 'Reiniciando todos los Stores');

    const pinia = getActivePinia() as ExtendedPinia;
    if (!pinia) throw new ManualError('No hay Stores');

    // Ignoramos algunos Stores
    exceptions.push(
      'core.components.ui.dialogs.dialogLoader',
      'config.appStoreTemp'
    );

    // Array para almacenar las promesas
    const resetPromises: Promise<void>[] = [];

    for (const originalStore of pinia._s) {
      // @ts-ignore
      const storeId = originalStore[0] as string;
      // @ts-ignore
      const store = originalStore[1] as Store;

      if (exceptions.includes(storeId)) {
        this.utils.debugLog('log', `Ignorando la limpieza del Store "${storeId}"`);
        continue;
      }

      // Agregamos la operación de reinicio como una promesa al array
      resetPromises.push(
        new Promise<void>((resolve) => {
          try {
            store.$reset();
            this.utils.debugLog('log', `Store "${storeId}" reiniciado`);
            resolve();
          } catch (error: any) {
            this.utils.debugLog('error', 'Error al reiniciar el Store [$reset()]', {
              store: storeId,
              error
            });
            resolve(); // Resolver incluso en caso de error
          }
        })
      );
    }

    // Esperamos a que todas las promesas se completen
    await Promise.all(resetPromises);
  };
}
