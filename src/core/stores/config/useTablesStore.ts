import type TablesEnum from '@/enums/TablesEnum';
import type { ArrayOfObjects, FlattenArray } from '@/core/types/GlobalTypes';
import type { StandardPaginationIC } from '@/core/types/api/ApiType';
import type { TGRowIC, TableTG } from '@/core/types/components/generators/TablesGeneratorInterface';
import FormsUtils from '@/core/utils/FormsUtils';
import { defineStore } from 'pinia';
import { computed, ref, type ComputedRef, type WritableComputedRef } from 'vue';

/**
 * Forms Utils
 */
const { restoreObjectFromKeysValues } = FormsUtils();

/**
 * Store para el manejo de los Formularios
 */
const useTablesStore = defineStore('core.config.tablesStore', () => {
  /**
   * Tables
   */
  const tables = ref<{
    [key in keyof typeof TablesEnum]?: ArrayOfObjects;
  }>({});

  /**
   * Paginación
   */
  const pagination = ref<{
    [key in keyof typeof TablesEnum]?: StandardPaginationIC<any>['pagination'] | null;
  }>({});

  /**
   * Page
   */
  const page = ref<{
    [key in keyof typeof TablesEnum]?: number;
  }>({});

  /**
   * Default Per Page
   */
  const defaultPerPage = 10;

  /**
   * Per Page
   */
  const perPage = ref<{
    [key in keyof typeof TablesEnum]?: number;
  }>({});

  /**
   * Resetear el store
   */
  function $reset() {
    tables.value = {};
    pagination.value = {};
    page.value = {};
    perPage.value = {};
  }

  /**
   * Agregar una tabla
   */
  function setTable(tableName: keyof typeof TablesEnum, table: ArrayOfObjects) {
    // @ts-ignore
    tables.value[tableName] = table;
  }

  /**
   * Obtener una tabla
   */
  function getTable<T extends ArrayOfObjects>(
    tableName: keyof typeof TablesEnum
  ): TableTG<FlattenArray<T>> {
    // @ts-ignore
    if (!tables.value[tableName]) return [];

    // @ts-ignore
    return tables.value[tableName];
  }

  /**
   * Obtener una tabla en formato original con el index de cada fila
   */
  function getTableInOriginalFormat<T extends ArrayOfObjects>(
    tableName: keyof typeof TablesEnum
  ): WritableComputedRef<TableTG<T>> {
    // @ts-ignore
    return computed({
      get: () => {
        const form = getTable<T>(tableName);
        const newForm = form.map((row) => {
          return restoreObjectFromKeysValues(row);
        });

        return newForm;
      },
      set: (value) => {
        // @ts-ignore
        tables.value[tableName] = value;
      }
    });
  }

  /**
   * Obtener una fila de una tabla en formato original con el index la fila
   */
  function getRowInOriginalFormat<T extends ArrayOfObjects>(
    tableName: keyof typeof TablesEnum,
    index: number
  ): ComputedRef<TGRowIC<T>> {
    // @ts-ignore
    return computed(() => {
      const form = getTable<T>(tableName);
      const row = form.find((row) => row.index === index);
      const newRow = restoreObjectFromKeysValues(row);

      return newRow;
    });
  }

  /**
   * Elimitar una tabla
   */
  function removeTable(tableName: keyof typeof TablesEnum) {
    // @ts-ignore
    delete tables.value[tableName];
  }

  /**
   * Set pagination
   */
  function setPagination(
    tableName: keyof typeof TablesEnum,
    paginationData: StandardPaginationIC<any>['pagination'] | null
  ) {
    //@ts-ignore
    pagination.value[tableName] = paginationData;
  }

  /**
   * Set page
   */
  function setPage(tableName: keyof typeof TablesEnum, pageData: number) {
    //@ts-ignore
    page.value[tableName] = pageData;
  }

  /**
   * Set per page
   */
  function setPerPage(tableName: keyof typeof TablesEnum, perPageData: number) {
    //@ts-ignore
    perPage.value[tableName] = perPageData;
  }

  /**
   * Get pagination
   */
  function getPagination(
    tableName: keyof typeof TablesEnum
  ): StandardPaginationIC<any>['pagination'] | null {
    if (!pagination.value[tableName]) return null;

    //@ts-ignore
    return pagination.value[tableName];
  }

  /**
   * Get page
   */
  function getPage(tableName: keyof typeof TablesEnum): number {
    if (!page.value[tableName]) return 1;

    //@ts-ignore
    return page.value[tableName];
  }

  /**
   * Get per page
   */
  function getPerPage(tableName: keyof typeof TablesEnum): number {
    if (!perPage.value[tableName]) return defaultPerPage;

    //@ts-ignore
    return perPage.value[tableName];
  }

  return {
    $reset,
    tables,
    pagination,
    page,
    perPage,
    defaultPerPage,
    setTable,
    getTable,
    getTableInOriginalFormat,
    getRowInOriginalFormat,
    removeTable,
    setPagination,
    setPage,
    setPerPage,
    getPagination,
    getPage,
    getPerPage
  };
});

export default useTablesStore;
