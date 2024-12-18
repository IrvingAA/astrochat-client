import CustomHandler from '@/core/config/CustomHandler';
import CatalogsEnum from '@/enums/CatalogsEnum';
import type { AllCatalogsIC, CatalogIC } from '@/core/types/services/CatalogsServiceInterface';
import Database from '@/databases/Database';

/**
 * Base de datos de Catalogos
 */
export default class CatalogsDatabase extends Database {
  /**
   * Contructor de la clase
   */
  constructor() {
    super('catalogs');
  }

  /**
   * Metodo que guarda una bandera para saber si se han cargado los catalogos
   */
  private async saveLoadedCatalogs(): Promise<void> {
    await this.$setItem('loaded', true);
  }

  /**
   * Metodo que obtiene una bandera para saber si se han cargado los catalogos
   */
  public async isLoadedCatalogs(): Promise<boolean> {
    try {
      const loaded = await this.$getItem<boolean>('loaded');
      return loaded ? true : false;
    } catch (error: any) {
      return false;
    }
  }

  /**
   * Guarda multiples catalogos
   */
  public async saveCatalogs(catalogs: AllCatalogsIC): Promise<void> {
    const catalogsKeys = Object.keys(catalogs);
    for (const key of catalogsKeys) {
      // @ts-ignore
      const catalog = catalogs[key];
      // @ts-ignore
      await this.$setItem(key, catalog);
    }

    await this.saveLoadedCatalogs();
  }

  /**
   * Obtiene todos los catalogos
   */
  public async getAllCatalogs(): Promise<AllCatalogsIC> {
    try {
      const catalogsKeys = Object.keys(CatalogsEnum);

      const catalogs: any = {};
      for (const key of catalogsKeys) {
        // @ts-ignore
        catalogs[key] = await this.getCatalog(key);
      }

      return catalogs;
    } catch (error: any) {
      throw new CustomHandler(error);
    }
  }

  /**
   * Obtiene un catalogo
   */
  public async getCatalog(name: string): Promise<CatalogIC | null> {
    try {
      // @ts-ignore
      const catalog = await this.$getItem<CatalogIC>(name);
      return catalog;
    } catch (error: any) {
      return null;
    }
  }
}
