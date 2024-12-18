/**
 * Composable para manejar la ventana
 */
export default function useTab() {
  /**
   * Función para recargar la ventana
   */
  const reloadWindow = (): void => {
    window.location.reload();
  }

  /**
   * Función para cerrar la ventana
   */
  const closeWindow = (): void => {
    window.close();
  }

  return {
    reloadWindow,
    closeWindow
  }
}
