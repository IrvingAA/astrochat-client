import { ref } from 'vue'
import { defineStore } from 'pinia'
import useEnv from '@/core/composables/useEnv'

/**
 * Store para almacenar datos temporales de la aplicación
 */
const useAppStoreTemp = defineStore('config.appStoreTemp', () => {
  /**
   * Almacena el ID de la pestaña
   */
  const tabId = ref<string | null>(null)

  /**
   * Bandera que indica que esta pestaña no es valida
   */
  const isInvalidTab = ref<boolean>(false)

  /**
   * Bandera que indica que ya se mostro el env
   */
  const isShowedEnv = ref<boolean>(false)

  /**
   *  Bandera que indica que ya se mostro la información de la sesión
   */
  const isShowedSession = ref<boolean>(false)

  /**
   * Función para verificar que el tabId sea valido
   */
  const checkIfIsValidTab = async (): Promise<boolean> => {
    const env = useEnv()
    let validTabId = localStorage.getItem('validTabId_' + env.APP_NAME);
    validTabId = validTabId ? validTabId : null;

    if (validTabId === tabId.value) {
      isInvalidTab.value = false
    } else {
      isInvalidTab.value = true
    }

    return isInvalidTab.value
  }

  /**
   * Ref para verificar que ya cargaron los formularios
   */
  const formsLoaded = ref<boolean>(false)

  /**
   * Ref para verificar que ya cargaron los Stores
   */
  const storesLoaded = ref<boolean>(false)

  /**
   * Reinicia el Store
   */
  const $reset = (): void => {
    tabId.value = null
    isInvalidTab.value = false
  }

  return {
    $reset,
    tabId,
    isInvalidTab,
    isShowedEnv,
    isShowedSession,
    checkIfIsValidTab,
    formsLoaded,
    storesLoaded
  }
}, {
  persistedState: {
    persist: false
  }
})

export default useAppStoreTemp
