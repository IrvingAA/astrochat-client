import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

/**
 * Store que maneja el dialogo visualizador de pdfs
 */
const useDialogPdfStore = defineStore(
  'core.components.ui.dialogs.dialogPdf',
  () => {
    /**
     * Indice del pdf actual
     */
    const index = ref<number>(0);

    /**
     * Pdfs a mostrar en el dialogo
     */
    const pdfs = ref<File[]>([]);

    /**
     * Bandera que indica si el dialogo de pdfs debe ser accionado
     */
    const showFlag = ref<boolean>(false);

    /**
     * Metodo que reinicia el store
     */
    const $reset = (): void => {
      showFlag.value = false;
      index.value = 0;
      pdfs.value = [];
    };

    /**
     * Metodo que activa el dialogo
     */
    const show = (pdf: File[] | File, status: boolean = true): void => {
      if (Array.isArray(pdf)) {
        pdfs.value = pdf;
      } else {
        pdfs.value = [pdf];
      }

      showFlag.value = status;
    };

    /**
     * Pdf actual
     */
    const currentPdf = computed<File | null>(() => {
      if (pdfs.value.length > 0) {
        return pdfs.value[index.value];
      }

      return null;
    });

    /**
     * Metodo que desactiva el dialogo
     */
    const hide = (): void => {
      showFlag.value = false;
      pdfs.value = [];
      index.value = 0;
    };

    /**
     * Indica si existe un pdf siguiente
     */
    const hasNext = computed<boolean>(() => {
      return index.value < pdfs.value.length - 1;
    });

    /**
     * Indica si existe un pdf anterior
     */
    const hasPrevious = computed<boolean>(() => {
      return index.value > 0;
    });

    /**
     * Siguiente pdf
     */
    const next = (): void => {
      if (hasNext.value) {
        index.value++;
      }
    };

    /**
     * Anterior pdf
     */
    const previous = (): void => {
      if (hasPrevious.value) {
        index.value--;
      }
    };

    return {
      $reset,
      showFlag,
      pdfs,
      index,
      currentPdf,
      show,
      hide,
      hasNext,
      hasPrevious,
      next,
      previous
    };
  },
  {
    persistedState: {
      persist: false
    }
  }
);

export default useDialogPdfStore;
