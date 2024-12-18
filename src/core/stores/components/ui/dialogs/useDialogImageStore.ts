import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

/**
 * Store que maneja el dialogo visualizador de imagenes
 */
const useDialogImageStore = defineStore(
  'core.components.ui.dialogs.dialogImage',
  () => {
    /**
     * Indice de la imagen actual
     */
    const index = ref<number>(0);

    /**
     * Imagenes a mostrar en el dialogo
     */
    const images = ref<File[]>([]);

    /**
     * Bandera que indica si el dialogo de imagen debe ser accionado
     */
    const showFlag = ref<boolean>(false);

    /**
     * Metodo que reinicia el store
     */
    const $reset = (): void => {
      showFlag.value = false;
      index.value = 0;
      images.value = [];
    };

    /**
     * Metodo que activa el dialogo
     */
    const show = (image: File[] | File, status: boolean = true): void => {
      if (Array.isArray(image)) {
        images.value = image;
      } else {
        images.value = [image];
      }

      showFlag.value = status;
    };

    /**
     * Imagen actual
     */
    const currentImage = computed<File | null>(() => {
      if (images.value.length > 0) {
        return images.value[index.value];
      }

      return null;
    });

    /**
     * Metodo que desactiva el dialogo
     */
    const hide = (): void => {
      showFlag.value = false;
      images.value = [];
      index.value = 0;
    };

    /**
     * Indica si existe una imagen siguiente
     */
    const hasNext = computed<boolean>(() => {
      return index.value < images.value.length - 1;
    });

    /**
     * Indica si existe una imagen anterior
     */
    const hasPrevious = computed<boolean>(() => {
      return index.value > 0;
    });

    /**
     * Siguiente imagen
     */
    const next = (): void => {
      if (hasNext.value) {
        index.value++;
      }
    };

    /**
     * Anterior imagen
     */
    const previous = (): void => {
      if (hasPrevious.value) {
        index.value--;
      }
    };

    return {
      $reset,
      showFlag,
      images,
      index,
      currentImage,
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

export default useDialogImageStore;
