import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

const useMenuStore = defineStore(
  'core.components.layouts.dashboard.menu',
  () => {
    /**
     * Bandera que indica si el menu lateral debe ser abierto
     */
    const menuFlag = ref<boolean>(false);

    /**
     * Icono del botón para accionar el menu lateral
     */
    const menuIcon = computed<string>(() => (menuFlag.value ? 'mdi-menu-open' : 'mdi-menu'));

    /**
     * Metodo para reiniciar el Store
     */
    const $reset = (): void => {
      menuFlag.value = true;
    };

    /**
     * Metodo para cambiar el valor de la bandera del menu a su valor contrario
     */
    const toggleMenuFlag = (): void => {
      menuFlag.value = !menuFlag.value;
    };

    return {
      $reset,
      menuFlag,
      menuIcon,
      toggleMenuFlag
    };
  },
  {
    persistedState: {
      persist: false
    }
  }
);

export default useMenuStore;
