import type CatalogsEnum from '@/enums/CatalogsEnum';
import type { QDateProps, QEditorProps, QInputProps, QTableProps, ValidationRule } from 'quasar';

/**
 * Tipado de los formularios
 */
export type FormIC<T> = {
  [K in keyof T]?: T[K] extends object ? FormIC<T[K]> : T[K] | null;
};

/**
 * Tipado para los errores de los formularios
 */
export type FormErrorsIC<T> = {
  [K in keyof T]: T[K] extends object ? FormErrorsIC<T[K]> | undefined : string[];
};

/**
 * Custom QInputProps
 */
type CustomQInputProps = Omit<
  QInputProps,
  'modelValue' | 'onUpdate:modelValue' | 'error' | 'errorMessage' | 'type' | 'rules' | 'lazyRules'
> & {
  modelValue: string | null;
  help?: string;
  errorMessages?: string[];
  required?: boolean;
  dontCleanErrorMessagesOnChange?: boolean;
  onChange?: (val: any) => Promise<void>;
};

/**
 * Tipado del componente InputText
 */
export type InputTextIC = CustomQInputProps & {
  prependIcon?: string;
};

/**
 * Tipado del componente Input Text Double
 */
export type InputTextDouble = Omit<InputTextIC, 'modelValue'> & {
  modelValue: {
    a: string | null;
    b: string | null;
  };
};

/**
 * Tipado del componente Editor
 */
export type EditorIC = Omit<
  QEditorProps,
  'modelValue' | 'onUpdate:modelValue' | 'error' | 'errorMessage' | 'type' | 'rules' | 'lazyRules'
> & {
  modelValue: string | null;
  label?: string;
  help?: string;
  errorMessages?: string[];
  required?: boolean;
  dontCleanErrorMessagesOnChange?: boolean;
  onChange?: (val: any) => Promise<void>;
};

/**
 * Tipado del componente DatePicker
 */
export type DatePickerIC = Omit<
  QDateProps,
  'modelValue' | 'onUpdate:modelValue' | 'error' | 'errorMessage' | 'type' | 'rules' | 'lazyRules'
> & {
  modelValue: string | string[] | null;
  label?: string;
  help?: string;
  errorMessages?: string[];
  required?: boolean;
  dontCleanErrorMessagesOnChange?: boolean;
  onChange?: (val: any) => Promise<void>;
};

/**
 * Tipado del componente InputMoney
 */
export type InputMoneyIC = Omit<CustomQInputProps, 'modelValue'> & {
  modelValue: number | null;
  prependIcon?: string;
  currency?: string;
  locale?: string;
  precision?: number;
  autoDecimalDigits?: boolean;
};

/**
 * Tipado del component InputSearch
 */
export type InputSearchIC = InputTextIC & {
  onSearch?: (val: any) => void;
};

/**
 * Tipado del componente TextArea
 */
export type TextAreaIC = CustomQInputProps;

/**
 * Tipado del componente InputEmail
 */
export type InputEmailIC = CustomQInputProps;

/**
 * Tipado del componente InputEmailConfirm
 */
export type InputEmailConfirmIC = InputEmailIC;

/**
 * Tipado del componente InputNumber
 */
export type InputNumberIC = CustomQInputProps;

/**
 * Tipado del componente InputTel
 */
export type InputTelIC = CustomQInputProps;

/**
 * Tipado del componente InputPassword
 */
export type InputPasswordIC = CustomQInputProps;

/**
 * Tipado del componente PasswordConfirm
 */
export type InputPasswordConfirmIC = InputPasswordIC;

/**
 * Tipado del componente InputDate
 */
export type InputDateIC = CustomQInputProps;

/**
 * Tipado del componente radio group
 */
export type RadioGroupIC = {
  modelValue: string | number | null;
  label?: string;
  help?: string;
  options?: {
    label: string;
    value: string | number;
    disable?: boolean;
    [props: string]: any | undefined;
  }[];
  inline?: boolean;
  errorMessages?: string[];
  required?: boolean;
  dontCleanErrorMessagesOnChange?: boolean;
  onChange?: (val: any) => Promise<void>;
};

/**
 * Tipado del componente check group
 */
export type CheckGroupIC = Omit<RadioGroupIC, 'modelValue'> & {
  modelValue: string[] | number[] | null;
};

/**
 * Tipado del componente InputFile
 */
export type InputFileIC = {
  idFileList: string;
  modelValue: File | File[] | null;
  label?: string;
  help?: string;
  multiple?: boolean;
  maxFiles?: number;
  hideList?: boolean;
  errorMessages?: string[];
  required?: boolean;
  accept?: string;
  dontCleanErrorMessagesOnChange?: boolean;
  onChange?: (val: any) => Promise<void>;
  extraColumns?: QTableProps['columns'];
};

/**
 * Tipado del un item de InputFileDescription
 */
export type FileDescriptionIC = {
  file: File;
  description: string | null;
};

/**
 * Tipado del componente InputFileDescription
 */
export type InputFileDescriptionIC = Omit<InputFileIC, 'modelValue'> & {
  modelValue: FileDescriptionIC | FileDescriptionIC[] | null;
  descriptionsProps?: InputTextIC;
};

/**
 * Tipo del componente Button
 */
export type ButtonIC = {
  label: string;
  type?: string;
  color?: string;
  caps?: boolean;
  style?: {};
};

/**
 * Tipado del componente ToggleButton
 */
export type ToggleButtonIC = {
  modelValue: boolean;
  label?: string;
  help?: string;
  disable?: boolean;
  errorMessages?: string[];
  required?: boolean;
  dontCleanErrorMessagesOnChange?: boolean;
  rules?: (ValidationRule | string)[];
  onChange?: (val: any) => Promise<void>;
};

/**
 * Tipado de los options del componente Select
 */
export type SelectOptionsIC = {
  label: string;
  value: any;
  meta?: {
    [key: string]: any;
  };
};

/**
 * Tipado del componente Select
 */
export type SelectIC = {
  modelValue: string | number | boolean | string[] | number[] | boolean[] | null;
  label?: string;
  help?: string;
  metaHelp?: string;
  multiple?: boolean;
  noDataLabel?: string;
  prependIcon?: string;
  appendIcon?: string;
  appendText?: string;
  options: SelectOptionsIC[];
  required?: boolean;
  errorMessages?: string[];
  dontCleanErrorMessagesOnChange?: boolean;
  onChange?: (val: any) => Promise<void>;
  filter?: (options: SelectOptionsIC[]) => SelectOptionsIC[];
};

/**
 * Tipado del componente Select Child
 */
export type SelectChildIC = SelectIC & {
  modelFather: string | number | boolean | string[] | number[] | boolean[] | null;
  metaFather: string;
};

/**
 * Tipado del componente Select Catalog
 */
export type SelectCatalogIC = Omit<SelectIC, 'options'> & {
  catalogEnum: CatalogsEnum;
};

/**
 * Tipado del componente Select Catalog Child
 */
export type SelectCatalogChildIC = SelectCatalogIC & {
  modelFather: string | number | boolean | string[] | number[] | boolean[] | null;
  metaFather: string;
};
