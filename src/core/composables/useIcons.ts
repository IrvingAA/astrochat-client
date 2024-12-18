import type { TypeAlertIC } from '@/core/types/stores/components/ui/dialogs/useDialogAlertStoreInterface';

/**
 * Composable para el manejo de iconos
 */
export default function useIcons() {
  /**
   * Config
   */
  const positiveIcon = 'mdi-check-circle';
  const infoIcon = 'mdi-information';
  const warningIcon = 'mdi-alert';
  const negativeIcon = 'mdi-alert-circle';

  /**
   * Metodo para obtener el icono de un tipo de alerta
   */
  const getIconByType = (type: TypeAlertIC): string => {
    switch (type) {
      case 'positive':
        return positiveIcon;

      case 'info':
        return infoIcon;

      case 'warning':
        return warningIcon;

      case 'negative':
        return negativeIcon;
    }
  };

  return {
    positiveIcon,
    infoIcon,
    warningIcon,
    negativeIcon,
    getIconByType
  };
}
