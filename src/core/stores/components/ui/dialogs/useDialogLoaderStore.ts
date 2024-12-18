import { ref } from 'vue';
import { defineStore } from 'pinia';

const useDialogLoaderStore = defineStore(
  'core.components.ui.dialogs.dialogLoader',
  () => {
    /**
     * Bandera que indica si el dialogo de carga debe ser accionado
     */
    const showFlagLoader = ref<boolean>(false);

    /**
     * Label del dialogo de carga
     */
    const label = ref<string>('Cargando');

    /**
     * Metodo que reinicia el store
     */
    const $reset = (): void => {
      showFlagLoader.value = false;
    };

    /**
     * Metodo que activa el dialogo de carga
     */
    const enableDialogLoader = (label?: string): void => {
      showFlagLoader.value = true;
      if (label) setLabel(label);
    };

    /**
     * Metodo que desactiva el dialogo de carga
     */
    const disableDialogLoader = (): void => {
      showFlagLoader.value = false;
      resetLabel();
    };

    /**
     * Método para setear el label del dialogo de carga
     */
    const setLabel = (newLabel: string): void => {
      label.value = newLabel;
    };

    /**
     * Método para reestablecer el label del dialogo de carga
     */
    const resetLabel = (): void => {
      label.value = 'Cargando';
    };
    return {
      $reset,
      showFlagLoader,
      enableDialogLoader,
      disableDialogLoader,
      label,
      setLabel,
      resetLabel
    };
  },
  {
    persistedState: {
      persist: false
    }
  }
);

export default useDialogLoaderStore;
