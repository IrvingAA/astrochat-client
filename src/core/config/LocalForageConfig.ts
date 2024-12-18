import useEnv from '@/core/composables/useEnv';
import localForage from 'localforage';
import ManualError from '@/core/config/ManualError';

export default class LocalForageConfig {
  /**
   * Driver de localForage
   */
  private driver: string;

  /**
   * Nombre de la base de datos
   */
  private name: string;

  /**
   * Contructor de la clase
   */
  constructor() {
    this.driver = localForage.INDEXEDDB;
    this.name = useEnv().DB_NAME || 'app';
  }

  /**
   * Crea o usa un almacenamiento existente
   */
  //@ts-ignore
  public createOrUseStore(storeName: string, driver?: string, name?: string): LocalForage {
    if (!driver) driver = this.driver;
    if (!name) name = this.name;

    try {
      //create
      const db: LocalForage = localForage.createInstance({
        name: name,
        storeName: storeName,
        driver: driver
      });

      return db;
    } catch (error: any) {
      throw new ManualError(
        `No se logró crear el almacenamiento '${storeName}': \n\n${error?.message}`
      );
    }
  }
}
