import type FormsEnum from '@/enums/FormsEnum';
import type { FormErrorsIC, FormIC } from '@/core/types/components/ui/FormsInterface';

/**
 * Tipado para AllFormsIC
 */
export type AllFormsIC = {
  [key in keyof typeof FormsEnum]?: FormIC<any>;
};

/**
 * Tipado para los errores de los formularios
 */
export type AllFormErrorsIC = {
  [key in keyof typeof FormsEnum]?: FormErrorsIC<any>;
};

/**
 * Tipado para un objeto con los nombres de los formularios como llaves y el valor es un boolean
 */
export type EnumListBooleanIC = {
  [key in keyof typeof FormsEnum]?: boolean;
};

/**
 * Tipado de opciones de makeForm
 */
export type MakeFormOptionsIC = {
  persist: boolean;
};
