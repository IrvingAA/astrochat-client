import { ref } from 'vue';
import { defineStore } from 'pinia';

const useDialogNoticeOfPrivacyStore = defineStore(
  'core.components.ui.dialogs.dialogNoticeOfPrivacyStore',
  () => {
    /**
     * Bandera que indica si el dialogo de aviso de privacidad debe ser accionado
     */
    const showFlagNoticeOfPrivacy = ref<boolean>(false);

    /**
     * Metodo para reiniciar el Store
     */
    const $reset = (): void => {
      showFlagNoticeOfPrivacy.value = false;
    };

    /**
     * Metodo para cambiar el valor de showFlagNoticeOfPrivacy
     */
    const setShowFlagNoticeOfPrivacy = (newValue: boolean): void => {
      showFlagNoticeOfPrivacy.value = newValue;
    };

    return {
      showFlagNoticeOfPrivacy,
      $reset,
      setShowFlagNoticeOfPrivacy
    };
  }
);

export default useDialogNoticeOfPrivacyStore;
