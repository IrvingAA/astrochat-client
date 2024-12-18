import type { ApiResponseIC } from '@/types/api/ApiInterface'

/**
 * Tipado para la respuesta de la API de form-items
 */
export type IndexFormsResponseIC = ApiResponseIC<{
  app_name: string,
  module_name: string,
  title: string,
  formName: string,

  //isList: boolean
  //listName: string | null
  //listMaxSize: number | null

  defaultData: {
    [key: string]: any
  },
  formGenerator: {
    cat_field_type_id: number, //Ajustar
    model: string,
    label: string,
    class: string,
    required: boolean,
    on_hide: boolean,
    on_disabled: boolean,
    on_search: boolean,
    metas: {
      [key: string]: any
    } | null,
    rules: number[] //Ajustar
  }[]
}[]>
