import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { AllCatalogsIC, CatalogIC } from '@/core/types/services/CatalogsServiceInterface';
import CatalogsEnum from '@/enums/CatalogsEnum';
import ManualError from '@/core/config/ManualError';

const useCatalogStore = defineStore(
  'core.config.catalogStore',
  () => {
    /**
     * Objeto que almacena todos los catalogos
     */
    // @ts-ignore
    const catalogs = ref<AllCatalogsIC>({});

    /**
     * Metodo para setear los catalogos
     */
    const setCatalogs = (catalogsList: AllCatalogsIC | {}): void => {
      // @ts-ignore
      catalogs.value = catalogsList;
    };

    /**
     * Metodo para obtener un catalogo, se recomienda usar el enum "CatalogsEnum.ts"
     */
    const getCatalog = (catalogEnum: CatalogsEnum): CatalogIC => {
      // @ts-ignore
      if (!catalogs.value[catalogEnum]) throw new ManualError(`Catalog '${catalogEnum}' not found`);

      // @ts-ignore
      return catalogs.value[catalogEnum];
    };

    const ordeerCatalogBy = (options: any /*, type:number*/): any => {
      options.sort((a: any, b: any) => {
        if (a.label < b.label) {
          return -1;
        }
        if (a.label > b.label) {
          return 1;
        }
        return 0;
      });
      return options;
    };

    /**
     * Reset
     */
    const $reset = () => {
      setCatalogs({});
    };

    return {
      $reset,
      catalogs,
      setCatalogs,
      getCatalog,
      ordeerCatalogBy
    };
  },
  {
    persistedState: {
      persist: false
    }
  }
);

export default useCatalogStore;
