import type FormsEnum from '@/enums/FormsEnum';
import type { ArrayOfObjects, ObjectOfIC } from '@/core/types/GlobalTypes';
import type { FormGeneratorTsVueIC } from './FormsGeneratorInterface';
import type { ColumnDataTableIC } from '../ui/DataTableInterface';

/**
 * Tipado de los props del componente FormsListGenerator
 */
export type PropsIC = {
  saveFormListMethod?: (formList: any[]) => Promise<void>;

  beforeEveryFormListUpdateMethod?: () => Promise<void>;
  afterEveryFormListUpdateMethod?: () => Promise<void>;

  beforeResetFormListMethod?: (formList: any[]) => Promise<boolean>;
  afterResetFormListMethod?: () => Promise<void>;

  beforeSaveFormMethod?: (form: any) => Promise<boolean>;
  afterSaveFormMethod?: () => Promise<void>;

  beforeResetFormMethod?: (form: any) => Promise<boolean>;
  afterResetFormMethod?: () => Promise<void>;

  beforeEditRowMethod?: (form: any) => Promise<boolean>;
  afterUpdateRowMethod?: () => Promise<void>;

  beforeDeleteRowMethod?: (form: any) => Promise<boolean>;
  afterDeleteRowMethod?: () => Promise<void>;

  onShowForm?: () => void;
  onHideForm?: () => void;

  btnEditarHideOn?: () => boolean;
  btnEliminarHideOn?: () => boolean;
  btnLimpiarListaHideOn?: () => boolean;
};

/**
 * Tipado para el metodo getFormList del store
 *
 * es el mismo array de T pero con el formListId
 */
export type GetFormListItemIC<T extends ArrayOfObjects> = ObjectOfIC<T> & {
  /**
   * Id del item
   */
  formListId: string;
};

/**
 * Tipado del modelo de un formList
 */
export type FormListModelIC<T extends object> = {
  /**
   * Titulo del formulario
   */
  title: string;

  /**
   * Icono del formulario
   */
  icon?: string;

  /**
   * Formulario
   */
  FGModel: FormGeneratorTsVueIC<T>;

  /**
   * Class del formulario
   */
  classFG?: string;

  /**
   * Columnas de la tabla
   */
  columns: ColumnDataTableIC<T[]>[];

  /**
   * Reiniciar la tabla al guardar la lista
   */
  resetTableOnSave?: boolean;

  /**
   * Indica si se debe mostrar el boton para guardar la lista
   */
  hasSaveFormListButton?: boolean;

  /**
   * Limitar el numero de items que se pueden agregar a la lista
   */
  limit?: number;

  /**
   * Permite que la tabla se muestre
   */
  showTable?: boolean;
};

/**
 * Tipado del store formsList
 */
export type FormsListStoreIC = {
  // @ts-ignore
  [key: keyof typeof FormsEnum]: ArrayOfObjects;
};
