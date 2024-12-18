import { ref, watch, type Ref, type WatchOptions, type WatchStopHandle, computed, type ComputedRef } from 'vue'
import { defineStore } from 'pinia'
import type { AllFormErrorsIC, AllFormsIC, MakeFormOptionsIC } from '@/core/types/services/FormsServiceInterface'
import type FormsEnum from '@/enums/FormsEnum'
import FormsUtils from '@/core/utils/FormsUtils'
import type { Flatten, MakePropertiesNullable, MakePropertiesOptional } from '@/core/types/GlobalTypes'
import FormsDatabase from '@/core/databases/FormsDatabase'
import type { FormErrorsIC } from '@/core/types/components/ui/FormsInterface'
import CustomHandler from '@/core/config/CustomHandler'
import HttpStatusEnum from '@/core/enums/HttpStatusEnum'
import FilesDatabase from '@/core/databases/FilesDatabase'

/**
 * Forms Database
 */
const formsDatabase = new FormsDatabase()

/**
 * Forms Utils
 */
const { recursiveObjectKeysValues, restoreObjectFromKeysValues } = FormsUtils()

/**
 * Store para el manejo de los Formularios
 */
const useFormsStore = defineStore('config.formsStore', () => {

  /**
   * Objeto que almacena todos los Formularios
   */
  // @ts-ignore
  const forms = ref<AllFormsIC>({})

  /**
   * Indica si ya se cargaron los archivos de los formularios
   */
  const formsFilesLoaded = ref<boolean>(false)

  /**
   * Objeto que almacena todos los errores de los Formularios
   */
  // @ts-ignore
  const formsErrors = ref<AllFormErrorsIC>({})

  /**
   * Metodo que lanza un error si el formulario no existe
   */
  const checkForm = (formName: (keyof typeof FormsEnum)): void => {
    if (!forms.value[formName]) {
      //@ts-ignore
      forms.value[formName] = {}
    }

    //@ts-ignore
    if (!formsErrors.value[formName]) {
      //@ts-ignore
      formsErrors.value[formName] = {}
    }
  }

  /**
   * Metodo para crear un Formulario
   */
  const makeForm = <T>(formName: (keyof typeof FormsEnum), defaultFormValues: MakePropertiesOptional<MakePropertiesNullable<T>>, options?: MakeFormOptionsIC): Ref<Flatten<T>> => {
    // @ts-ignore
    if (forms.value[formName]) return getForm<T>(formName)

    const lastDefaultValues = recursiveObjectKeysValues(defaultFormValues)
    formsDatabase.saveForm(formName, lastDefaultValues)

    //@ts-ignore
    forms.value[formName] = lastDefaultValues
    makeFormErrors<T>(formName)

    return getForm<T>(formName)
  }

  /**
   * Metodo para obtener un Formulario reactivo
   * NOTA: Si deseas enviar el formulario a la API, usa el metodo getFormInOriginalFormat
   */
  const getForm = <T>(formName: (keyof typeof FormsEnum)): Ref<Flatten<T>> => {
    checkForm(formName)

    // @ts-ignore
    return ref(forms.value[formName])
  }

  /**
   * Metodo para obtener un Formulario en su formato original, este es ideal para enviarlo a la API
   * NOTA: ES DE SOLO LECTURA
   */
  const getFormInOriginalFormat = <T>(formName: (keyof typeof FormsEnum)): ComputedRef<T> => {
    // @ts-ignore
    return computed(() => {
      const form = getForm<T>(formName).value
      const newForm =  restoreObjectFromKeysValues(form)

      return newForm
    })
  }

  /**
   * Metodo para obtener un Formulario en su formato original, este es ideal para enviarlo a la API
   * NOTA: ES DE SOLO LECTURA
   * (Este metodo es igual al anterior, pero es una promesa)
   */
  const getFormInOriginalFormatAsync = async <T>(formName: (keyof typeof FormsEnum)): Promise<T> => {
    // @ts-ignore
    const form = {
      ...getForm<T>(formName).value
    }

    const filesDB = new FilesDatabase()

    const keysforms = Object.keys(form)
    for (const key of keysforms) {
      const tempKey = formName + '_' + key
      const getFile = await filesDB.getFiles(tempKey)

      if (getFile) {
        // @ts-ignore
        form[key] = getFile
      }
    }

    const lastForm = restoreObjectFromKeysValues(form)

    // @ts-ignore
    return lastForm
  }

  /**
   * Watcher para un Formulario
   */
  const watchForm = <T>(formName: (keyof typeof FormsEnum), callback: (form: Flatten<T>) => void, options?: WatchOptions<any>): WatchStopHandle => {
    checkForm(formName)

    if (!options) options = { deep: true }

    // @ts-ignore
    const formUse = getForm<T>(formName)
    return watch(formUse, (form) => {
      callback(form)
    }, options)
  }

  /**
   * Metodo para reiniciar un Formulario a su estado inicial
   */
  const resetForm = async (formName: (keyof typeof FormsEnum)): Promise<void> => {
    checkForm(formName)
    const form = await formsDatabase.getForm(formName)
    resetFormErrors(formName)

    // @ts-ignore
    forms.value[formName] = form
  }

  /**
   * Metodo para setear uno o mas campos de un Formulario
   */
  const setFields = <T>(formName: (keyof typeof FormsEnum), fields: MakePropertiesOptional<Flatten<T>>): void => {
    checkForm(formName)

    Object.keys(fields).forEach((field) => {
      // @ts-ignore
      forms.value[formName][field] = fields[field]
    })
  }

  /**
   * Metodo para reiniciar uno o mas campos de un Formulario a su estado inicial
   */
  const resetFields = async <T>(formName: (keyof typeof FormsEnum), fields: (keyof Flatten<T>)[]): Promise<void> => {
    checkForm(formName)
    const form = await formsDatabase.getForm(formName)

    fields.forEach((field) => {
      // @ts-ignore
      forms.value[formName][field] = form[field]
    })
  }

  /**
   * ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   *
   * Metodos para el manejo de los errores de los Formularios
   *
   * ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   */

  /**

  /**
 * Metodo para crear un objeto con los errores de un formulario
 */
  const makeFormErrors = <T>(formName: (keyof typeof FormsEnum)): Ref<Flatten<FormErrorsIC<T>>> => {
    // @ts-ignore
    if (formsErrors.value[formName]) return getFormErrors<T>(formName)
    checkForm(formName)

    // @ts-ignore
    Object.keys(forms.value[formName]).forEach((field) => {
      // @ts-ignore
      formsErrors.value[formName][field] = []
    })

    // @ts-ignore
    return getFormErrors<T>(formName)
  }

  /**
   * Metodo para obtener los errores de un formulario
   */
  const getFormErrors = <T>(formName: (keyof typeof FormsEnum)): Ref<FormErrorsIC<T>> => {
    checkForm(formName)

    //@ts-ignore
    if (!formsErrors.value[formName]) {
      //@ts-ignore
      formsErrors.value[formName] = {}
    }

    // @ts-ignore
    return ref(formsErrors.value[formName])
  }

  /**
   * Setea los errores de uno o mas campos de un formulario
   */
  const setFieldsErrors = <T>(formName: (keyof typeof FormsEnum), fields: MakePropertiesOptional<Flatten<FormErrorsIC<T>>>): void => {
    checkForm(formName)

    // @ts-ignore
    Object.keys(fields).forEach((field) => {
      // @ts-ignore
      formsErrors.value[formName][field] = fields[field]
    })
  }

  /**
   * Setear los errores de un formulario a partir de un error CustomHandler
   */
  const setFormErrorsWithCH = (formName: (keyof typeof FormsEnum), error: Error): void => {
    checkForm(formName)

    if (!(error instanceof CustomHandler)) return;
    const { data } = error
    if (data.httpCode !== HttpStatusEnum.UNPROCESSABLE_ENTITY) return;

    const errorsData = data.data;
    if (!errorsData) return;

    // @ts-ignore
    Object.keys(errorsData).forEach((field) => {
      // @ts-ignore
      formsErrors.value[formName][field] = errorsData[field]
    })
  }

  /**
   * Reiniciar los errores de un formulario
   */
  const resetFormErrors = (formName: (keyof typeof FormsEnum)): void => {
    checkForm(formName)

    // @ts-ignore
    Object.keys(formsErrors.value[formName]).forEach((field) => {
      // @ts-ignore
      formsErrors.value[formName][field] = []
    })
  }

  /**
   * Reiniciar los errores de un campo de un formulario
   */
  const resetFieldsErrors = <T>(formName: (keyof typeof FormsEnum), fields: MakePropertiesOptional<Flatten<FormErrorsIC<T>>>): void => {
    checkForm(formName)

    // @ts-ignore
    Object.keys(fields).forEach((field) => {
      // @ts-ignore
      formsErrors.value[formName][field] = []
    })
  }

  /**
   * Reinicia todos los errores de todos los formularios
   */
  const resetAllFormsErrors = () => {
    for (const formName in formsErrors.value) {
      // @ts-ignore
      resetFormErrors(formName)
    }
  }

  /**
   * Metodo para guardar el estado de los roles seleccionados
   */
  const rolesDisabled:Ref<any> = ref([]);
  const setRolesDisabled = (roles: any) => {
    rolesDisabled.value = roles
  }

  /**
   * Reset
   */
  const $reset = () => {
    forms.value = {}
    formsErrors.value = {}
  }

  return {
    $reset,
    formsFilesLoaded,
    forms,
    formsErrors,
    checkForm,
    makeForm,
    getForm,
    getFormInOriginalFormat,
    getFormInOriginalFormatAsync,
    watchForm,
    resetForm,
    setFields,
    resetFields,
    makeFormErrors,
    getFormErrors,
    setFormErrorsWithCH,
    setFieldsErrors,
    resetFormErrors,
    resetFieldsErrors,
    resetAllFormsErrors,
    rolesDisabled,
    setRolesDisabled
  }
}, {
  persistedState: {
    persist: true,
  }
})

export default useFormsStore
