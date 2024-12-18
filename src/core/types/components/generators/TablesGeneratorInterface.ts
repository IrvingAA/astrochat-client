import type { ArrayOfObjects, ObjectOfIC } from '@/core/types/GlobalTypes';
import type { FormGeneratorTsVueIC } from './FormsGeneratorInterface';
import type TablesEnum from '@/enums/TablesEnum';
/**
 * Tipado para un table
 */
export type TableTG<T extends ArrayOfObjects> = T extends ArrayOfObjects ? TGRowIC<T>[] : [];

/**
 * Tipado para un item de una fila del TablesGeneratorTS
 */
export type TGRowIC<T extends ArrayOfObjects> = ObjectOfIC<T> & {
  index: number;
};

/**
 * Tipado para los props del TableGeneratorTS
 */
export type TGPropsIC = {
  beforeGetData?: <F, P extends PaginationIC | undefined>(
    filters: F,
    pagination: P
  ) => Promise<boolean>;
  afterGetData?: <T extends any[]>(data: T) => Promise<void>;
};

/**
 * Tipado para PaginationIC
 */
type PaginationIC = {
  page: number;
  perPage: number;
};

/**
 * Tipado para el VModel de un TableSGeneratorTS
 */
export type TGModelIC<T> = {
  /**
   * Nombre de la tabla
   */
  tableName: keyof typeof TablesEnum;

  /**
   * Espera una promesa que regrese un arreglo de datos.
   *
   * Si "serverPagination" es true, se espera un objeto con la siguiente estructura:
   *
   * {
   *
   *  pagination: {xxx},
   *
   *  items: [],
   *
   * }
   */
  service: (payload: any, pagination: PaginationIC) => Promise<T>;

  /**
   * Indica el numero por default de items por pagina
   */
  defaultPerPage?: number;

  /**
   * Indica si se debe usar paginacion del lado del servidor, recuerda que el
   * service debe regresar un paginador para que funcione
   */
  serverPagination?: boolean;

  /**
   * Indica si se debe cargar la tabla al inicio
   */
  loadDataAtStart: boolean;

  /**
   * Indica si se debe persistir la data de la tabla
   */
  persistData?: boolean;

  /**
   * Columnas de la tabla
   *
   * @example
   * columns: {
   *   'Etiqueta': 'llave.en.data',
   * }
   */
  columns: {
    /**
     * Identificador de la columna para usarlo como slot <template #name="item"/>
     * (Este key se llenará automáticamente con el valor de 'field' si 'field' no es null y si este key no fue definido)
     */
    name?: string;

    /**
     * Etiqueta de la columna
     */
    label: string;

    /**
     * Campo de 'service' que se va a mostrar en la columna o null
     * (El campo 'name' se llenará automáticamente con el valor de 'field' si 'field' no es null)
     */
    field: string | null;

    /**
     * If we use visible-columns, this col will always be visible
     */
    required?: boolean;

    /**
     * Alineación del texto de la columna
     *
     * @default 'center'
     */
    align?: 'left' | 'right' | 'center';

    /**
     * Tell QTable you want this column sortable
     */
    sortable?: boolean;

    /**
     * Compare function if you have some custom data or want a specific way to compare two rows
     *
     * @param a Value of the first comparison term
     * @param b Value of the second comparison term
     * @param rowA Full Row object in which is contained the first term
     * @param rowB Full Row object in which is contained the second term
     * @returns Comparison result of term 'a' with term 'b'. Less than 0 when 'a' should come first; greater than 0 if 'b' should come first; equal to 0 if their position must not be changed with respect to each other
     */
    sort?: (a: any, b: any, rowA: any, rowB: any) => number;

    /**
     * Set column sort order: 'ad' (ascending-descending) or 'da' (descending-ascending); Overrides the 'column-sort-order' prop
     *
     * Default value: ad
     */
    sortOrder?: 'ad' | 'da';

    /**
     * Function you can apply to format your data
     *
     * @param val Value of the cell
     * @param row Full Row object in which the cell is contained
     * @returns The resulting formatted value
     */
    format?: (val: any, row: any) => any;

    /**
     * Style to apply on normal cells of the column
     *
     * @param row The current row being processed
     */
    style?: string | ((row: any) => string);

    /**
     * Classes to add on normal cells of the column
     *
     * @param row The current row being processed
     */
    classes?: string | ((row: any) => string);
  }[];

  /**
   * Indica si tiene filtros
   */
  hasFilters?: boolean;

  /**
   * Indica si se debe realizar una busqueda al cambiar los filtros
   */
  searchOnFiltersChange?: boolean;

  /**
   * Indica si se debe usar almenos un filtro para poder buscar
   */
  oneFilterRequired?: boolean;

  /**
   * Indica si se muestran los filtros en automático en caso de que el tamaño de la pantalla sea mayor a 'sm'
   */
  showFiltersIfAbove?: boolean;

  /**
   * Indica si se deben reiniciar los filtros al cargar la tabla
   */
  resetFiltersAtStart?: boolean;

  /**
   * Filtros de la tabla (FormsGenerator model)
   */
  filtersFGModel?: FormGeneratorTsVueIC<any>;

  /**
   * Filters class
   */
  filtersClass?: string;
};
