import type { TypeAlertIC } from '@/core/types/stores/components/ui/dialogs/useDialogAlertStoreInterface';
//@ts-ignore
import { Notify } from 'quasar';
import useIcons from './useIcons';

/**
 * Composables for notify
 */
export default function useNotify() {
  /**
   * Config
   */
  const POSITION = 'bottom';
  const DURATION = 2500;

  /**
   * Metodo para mostrar un mensaje de notificacion estandar
   */
  const simpleNotify = (
    typeNotify: TypeAlertIC,
    customMessage: string,
    customIcon?: string,
    customPosition?: string,
    customTimeout?: number
  ): void => {
    if (!customIcon) customIcon = useIcons().getIconByType(typeNotify);
    if (!customPosition) customPosition = POSITION;
    if (!customTimeout) customTimeout = DURATION;

    Notify.create({
      type: typeNotify,
      icon: customIcon,
      message: customMessage,
      position: POSITION,
      timeout: DURATION
    });
  };

  /**
   * Metodo para mostrar un mensaje de notificacion positivo
   */
  const positiveNotify = (customMessage: string): void => {
    simpleNotify('positive', customMessage);
  };

  /**
   * Metodo para mostrar un mensaje de notificacion informativo
   */
  const infoNotify = (customMessage: string): void => {
    simpleNotify('info', customMessage);
  };

  /**
   * Metodo para mostrar un mensaje de notificacion de advertencia
   */
  const warningNotify = (customMessage: string): void => {
    simpleNotify('warning', customMessage);
  };

  /**
   * Metodo para mostrar un mensaje de notificacion negativo
   */
  const negativeNotify = (customMessage: string): void => {
    simpleNotify('negative', customMessage);
  };

  return {
    simpleNotify,
    positiveNotify,
    infoNotify,
    warningNotify,
    negativeNotify
  };
}
