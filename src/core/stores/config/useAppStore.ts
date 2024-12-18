import { ref } from 'vue'
import { defineStore } from 'pinia'

/**
 * Store para almacenar datos de la aplicación
 */
const useAppStore = defineStore('core.config.appStore', () => {
  /**
   * Almacena una bandera para saber si se recargo la pagina en el login
   */
  const reloadPageLogin = ref<boolean>(false)

  /**
   * Reinicia el Store
   */
  const $reset = (): void => {
    reloadPageLogin.value = false
  }

  return {
    $reset,
    reloadPageLogin
  }
})

export default useAppStore
