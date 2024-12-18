import CustomHandler from '@/core/config/CustomHandler';
import type { AllCatalogsIC } from '@/core/types/services/CatalogsServiceInterface';
import CatalogsDatabase from '@/core/databases/CatalogsDatabase';
import useCatalogStore from '@/core/stores/config/useCatalogsStore';
import CatalogsApi from '@/core/api/CatalogsApi';
/**
 * Clase para el servicio Catalogs
 */
export default class CatalogsService {
  /**
   * Catalogs Database
   */
  private catalogsDatabase: CatalogsDatabase;

  /**
   * Catalogs Api
   */
  private catalogsApi: CatalogsApi;

  /**
   * Contructor de la clase
   */
  constructor() {
    this.catalogsDatabase = new CatalogsDatabase();
    this.catalogsApi = new CatalogsApi();
  }

  /**
   * Metodo para obtener los catalogos desde la base de datos indexada y guardarlos en pinia,
   * en caso de que no existan los catalogos en la base de datos indexada o bien se mande el
   * parametro forceRefresh como true se obtendran los catalogos y se guardaran en
   * la base de datos indexada y posteriormente en pinia
   */
  public async saveCatalogsOnPinia(forceRefresh = false): Promise<void> {
    try {
      const isLoadedCatalogsOnDB = await this.catalogsDatabase.isLoadedCatalogs();
      if (!isLoadedCatalogsOnDB || forceRefresh) await this.saveCatalogsOnIndexedDB(forceRefresh);

      const allCatalogsInDB = await this.catalogsDatabase.getAllCatalogs();
      const { setCatalogs } = useCatalogStore();
      setCatalogs(allCatalogsInDB);
    } catch (error: any) {
      throw new CustomHandler(error);
    }
  }

  /**
   * Metodo para obtener todos los catalogos y guardarlos en la base de datos indexada
   */
  public async saveCatalogsOnIndexedDB(force: boolean = false): Promise<void> {
    try {
      await this.catalogsDatabase.$reset();
      const allCatalogs = await this.getCatalogs(force);
      await this.catalogsDatabase.saveCatalogs(allCatalogs);
    } catch (error: any) {
      throw new CustomHandler(error);
    }
  }

  /**
   * Metodo para obtener todos los catalogos desde el servidor
   */
  public async getCatalogs(force: boolean = false): Promise<AllCatalogsIC> {
    try {
      const { data } = await this.catalogsApi.index(force);
      return data;
    } catch (error: any) {
      console.error(error)
      throw new CustomHandler(error);
    }
  }
}
