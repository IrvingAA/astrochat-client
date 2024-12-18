import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { TypeAlertIC } from '@/core/types/stores/components/ui/dialogs/useDialogAlertStoreInterface';
import useIcons from '@/core/composables/useIcons';

const useDialogAlertStore = defineStore(
  'core.components.ui.dialogs.dialogAlert',
  () => {
    /**
     * Bandera que indica si el dialogo de alerta debe ser accionado
     */
    const showFlagAlert = ref<boolean>(false);

    /**
     * Resolve
     */
    const resolve = ref<any>(null);

    /**
     * Tipo de la alerta
     */
    const typeAlert = ref<TypeAlertIC>('positive');

    const styleAlert = ref<string>('');

    /**
     * Icono de la alerta
     */
    const iconAlert = computed<string>(() => {
      return useIcons().getIconByType(typeAlert.value);
    });

    /**
     * Titulo de la alerta
     */
    const titleAlert = ref<string>('Titulo alerta');

    /**
     * Texto de la alerta
     */
    const textAlert = ref<string | null>(null);

    /**
     * Metodo para reiniciar el Store
     */
    const $reset = (): void => {
      showFlagAlert.value = false;
      typeAlert.value = 'positive';
      titleAlert.value = 'Titulo alerta';
      textAlert.value = null;
      styleAlert.value = 'tw-flex bg-info';
    };

    /**
     * Metodo para cambiar el valor de showFlagAlert
     */
    const setShowFlagAlert = (newValue: boolean): void => {
      showFlagAlert.value = newValue;
    };

    /**
     * Metodo para cambiar el valor de typeAlert
     */
    const setTypeAlert = (newValue: TypeAlertIC): void => {
      typeAlert.value = newValue;
      if (typeAlert.value !== undefined) styleAlert.value = `tw-flex bg-${typeAlert.value}`;
      else styleAlert.value = 'tw-flex bg-info';
    };

    /**
     * Metodo para cambiar el valor de titleAlert
     */
    const setTitleAlert = (newValue: string): void => {
      titleAlert.value = newValue;
    };

    /**
     * Metodo para cambiar el valor de textAlert
     */
    const setTextAlert = (newValue: string): void => {
      textAlert.value = newValue;
    };

    /**
     * Metodo para activar el dialogo de alerta
     */
    const triggerDialogAlert = async (
      type: TypeAlertIC,
      title: string,
      text: string,
      autoHide = false,
      timeHide = 1700
    ): Promise<boolean> => {
      setTypeAlert(type);
      setTitleAlert(title);
      setTextAlert(text);
      setShowFlagAlert(true);

      if (autoHide) {
        setTimeout(() => {
          resolveAlert();
        }, timeHide);
      }

      return new Promise((resolveP) => {
        resolve.value = resolveP;
      });
    };

    /**
     * Metodo para resolver o no la promesa
     */
    const resolveAlert = (): void => {
      if (resolve.value) {
        resolve.value(true);
        setShowFlagAlert(false);
      }
    };

    return {
      $reset,
      showFlagAlert,
      typeAlert,
      titleAlert,
      iconAlert,
      textAlert,
      styleAlert,
      triggerDialogAlert,
      resolveAlert
    };
  },
  {
    persistedState: {
      persist: false
    }
  }
);

export default useDialogAlertStore;
