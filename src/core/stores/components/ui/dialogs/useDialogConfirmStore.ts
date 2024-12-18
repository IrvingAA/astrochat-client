import { ref } from 'vue';
import { defineStore } from 'pinia';

const useDialogConfirmStore = defineStore(
  'core.components.ui.dialogs.dialogConfirm',
  () => {
    /**
     * Bandera que indica si el dialogo de confirmación debe ser accionado
     */
    const showFlagConfirm = ref<boolean>(false);

    /**
     * Texto a mostrar
     */
    const textConfirm = ref<string>('');

    /**
     * Resolve
     */
    const resolve = ref<any>(null);

    /**
     * Metodo para reiniciar el Store
     */
    const $reset = (): void => {
      showFlagConfirm.value = false;
      resolve.value = null;
    };

    /**
     * Metodo que cambia el valor de la bandera del dialogo de confirmacion
     */
    const setShow = (status: boolean): void => {
      showFlagConfirm.value = status;
    };

    /**
     * Metodo que cambia el valor de text
     */
    const setText = (newText: string): void => {
      textConfirm.value = newText;
    };

    /**
     * Metodo para accionar el dialogo de confirmación
     */
    const triggerDialogConfirm = async (text: string): Promise<boolean> => {
      setText(text);
      setShow(true);

      return new Promise((resolveP) => {
        resolve.value = resolveP;
      });
    };

    /**
     * Metodo para resolver o no la promesa de confirm
     */
    const resolveConfirm = (status: boolean): void => {
      if (resolve.value) {
        resolve.value(status);
        showFlagConfirm.value = false;
      }
    };

    return {
      $reset,
      showFlagConfirm,
      textConfirm,
      triggerDialogConfirm,
      resolveConfirm
    };
  },
  {
    persistedState: {
      persist: false
    }
  }
);

export default useDialogConfirmStore;
