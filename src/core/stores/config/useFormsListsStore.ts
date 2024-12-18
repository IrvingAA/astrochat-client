import FormsListDatabase, { type FormListObjectIC } from '@/core/databases/FormsListDatabase';
import type FormsEnum from '@/enums/FormsEnum';
import { defineStore } from 'pinia';
import { computed, ref, type ComputedRef } from 'vue';

/**
 * Store for forms lists
 */
const useFormsListsStore = defineStore('core.config.formsLists', () => {
  /**
   * FormsListDatabase
   */
  const database = new FormsListDatabase();

  /**
   * Show forms state
   */
  const formsShow = ref<{
    [key in keyof typeof FormsEnum]?: boolean;
  }>({});

  /**
   * Index showed forms
   */
  const indexShowedForms = ref<{
    [key in keyof typeof FormsEnum]?: number | null;
  }>({});

  /**
   * Forms list
   */
  const formsList = ref<{
    [key in keyof typeof FormsEnum]?: FormListObjectIC<any>[];
  }>({});

  /**
   * Reset
   */
  const $reset = () => {
    formsShow.value = {};
    indexShowedForms.value = {};
    formsList.value = {};
  };

  /**
   * Obtiene el indice de un form si esta mostrado o no
   */
  const getIndexShowedForm = (formName: keyof typeof FormsEnum): number | null => {
    // @ts-ignore
    return indexShowedForms.value?.[formName] || null;
  };

  /**
   * Setea el estado de un form si esta mostrado o no
   */
  const setFormShow = (
    formName: keyof typeof FormsEnum,
    value: boolean,
    index: number | null = null
  ): void => {
    // @ts-ignore
    formsShow.value[formName] = value;

    if (value === true) {
      // @ts-ignore
      indexShowedForms.value[formName] = index;
    }
  };

  /**
   * Togglea el estado de un form si esta mostrado o no
   */
  const toggleFormShow = (formName: keyof typeof FormsEnum): void => {
    // @ts-ignore
    formsShow.value[formName] = !formsShow.value[formName];

    if (!formsShow.value[formName]) {
      // @ts-ignore
      indexShowedForms.value[formName] = null;
    }
  };

  /**
   * Reinicia todos los estados de los forms si estan mostrados o no
   */
  const resetFormsShow = (): void => {
    formsShow.value = {};
  };

  /**
   * Obtiene el estado de un form si esta mostrado o no
   */
  const isFormShow = (formName: keyof typeof FormsEnum): ComputedRef<boolean> => {
    // @ts-ignore
    return computed(() => {
      if (!formsShow.value[formName]) {
        setFormShow(formName, false);
      }

      return formsShow.value[formName];
    });
  };

  /**
   * Metodo para obtener un form list
   */
  const getFormList = <T extends object>(
    formName: keyof typeof FormsEnum
  ): FormListObjectIC<T>[] => {
    if (!formsList.value[formName]) {
      // @ts-ignore
      formsList.value[formName] = [];
    }

    // @ts-ignore
    return formsList.value[formName];
  };

  /**
   * Get form list computed
   */
  const getFormListComputed = <T extends object>(
    formName: keyof typeof FormsEnum
  ): ComputedRef<FormListObjectIC<T>[]> => {
    // @ts-ignore
    return computed(() => {
      if (!formsList.value[formName]) {
        // @ts-ignore
        formsList.value[formName] = [];
      }

      // @ts-ignore
      const data = formsList.value[formName];
      return data;
    });
  };

  /**
   * Metodo para obtener el formulario en su formato original (No es reactivo)
   */
  const getFormListInOriginalFormat = async <T extends object>(
    formName: keyof typeof FormsEnum
  ): Promise<T[]> => {
    return await database.getFormListOriginal(formName);
  };

  /**
   * Metodo para setear un form list (No es reactivo)
   */
  const setFormList = async <T extends object>(formName: keyof typeof FormsEnum, data: T[]) => {
    await database.setFormList(formName, data);

    // @ts-ignore
    formsList.value[formName] = data;
  };

  /**
   * Metodo para reiniciar un form list (No es reactivo)
   */
  const resetFormList = async (formName: keyof typeof FormsEnum) => {
    // @ts-ignore
    formsList.value[formName] = [];

    await database.clearFormList(formName);
  };

  return {
    $reset,
    formsList,
    indexShowedForms,
    getIndexShowedForm,
    getFormListInOriginalFormat,
    getFormList,
    getFormListComputed,
    setFormList,
    resetFormList,
    formsShow,
    resetFormsShow,
    isFormShow,
    setFormShow,
    toggleFormShow
  };
});

export default useFormsListsStore;
