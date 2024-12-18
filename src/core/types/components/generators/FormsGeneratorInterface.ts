import type FormsEnum from '@/enums/FormsEnum';
import type { ValidationRule } from 'quasar';
import type { HTMLAttributes } from 'vue';
import type {
  Flatten,
  MakePropertiesNullable,
  MakePropertiesOptional
} from '@/core/types/GlobalTypes';
import type FieldTypesEnum from '@/core/enums/FieldTypesEnum';

/**
 * recursiveObjectKeysValues return
 */
export type RecursiveObjectKeysValuesReturn = {
  key: string;
  value: any;
}[];

/**
 * Tipado de los items del generador de formularios
 */
export type FormsGeneratorItem<T> = {
  /**
   * Etiqueta del campo
   */
  label?: string;

  /**
   * Ayuda del campo
   */
  help?: string;

  /**
   * Tipo de campo a generar (input, select, etc)
   */
  field_type?: FieldTypesEnum;

  /**
   * Nombre del campo en caso de ser un campo personalizado
   */
  name?: string;

  /**
   *  Modelo del campo (v-model)
   */
  model: T extends {} ? keyof Flatten<T> : string;

  /**
   * Clases de estilos aplicadas al campo
   */
  class?: HTMLAttributes['class'];

  /**
   * Indica si el campo es requerido
   */
  required?: boolean;

  /**
   * Reglas de validación del campo (Quasar)
   */
  rules?: (ValidationRule | string)[];

  /**
   * Se ejecutará cuando el campo cambie de valor
   *
   * @param val
   */
  onChange?: (val: any) => Promise<void>;

  /**
   * Metodo para ocultar el campo
   */
  hideOn?: () => boolean;

  /**
   * Metodo para deshabilitar el campo
   */
  disableOn?: () => boolean;

  /**
   * Atributos adicionales del campo
   */
  meta?: {
    [key: string]: any;
  };
};

/**
 * Tipado de makeFormGenerator en useFormsStore
 */
export type FormGeneratorTsVueIC<T extends object> = {
  /**
   * Nombre del formulario a usar
   */
  formToUseName: keyof typeof FormsEnum;

  /**
   * Campos del formulario
   */
  fields: FormsGeneratorItem<T>[];
};

/**
 * Tipado de makeFormGeneratorV2 en useFormsStore
 */
export type FGModelV2IC<T extends object> = FormGeneratorTsVueIC<T> & {
  /**
   * Valores iniciales del formulario
   */
  initialValues: MakePropertiesOptional<MakePropertiesNullable<T>>;
};
