import type { IndexResponseIC } from '@/core/types/api/CatalogsApiInterface';
import Api from '@/api/Api';

/**
 * Clase para las apis de autenticación
 */
export default class CatalogsApi extends Api {
  /**
   * Contructor de la clase
   */
  constructor() {
    super('catalogs');
  }

  /**
   * Realiza la petición Index
   */
  public async index(force: boolean = false): Promise<IndexResponseIC> {
    const { data } = await this.$get<IndexResponseIC>('/', { params: { force } });
    return data;
  }
}
