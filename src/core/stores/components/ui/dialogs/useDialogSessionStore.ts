import AuthService from '@/core/services/AuthService';
import moment from 'moment';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

/**
 * Store para el dialogo que indica que la sesión esta por expirar, se activa cuando existe dateTimeExpire
 */
const useDialogSessionStore = defineStore(
  'core.ui.dialogs.dialogSession',
  () => {
    /**
     * Importar
     */
    const authService = new AuthService();

    /**
     * Bandera que indica cuando debe ser activado este store
     */
    const active: boolean = true;

    /**
     * Fecha y hora actual
     */
    const dateTimeNow = ref<moment.Moment>(moment());

    /**
     * Fecha y hora en la cual expira la sesión
     */
    const dateTimeExpire = ref<moment.Moment | null>(null);

    /**
     * Bandera para mostrar el dialogo
     */
    const isShowed = ref<boolean>(false);

    /**
     * Segundos que se debe mostrar el dialogo antes de cerrar la sesión manualmente
     */
    const secondsToShow: number = 30;

    /**
     * Tiempo que se ha mostrado el dialogo en segundos
     */
    const showedTimeInSeconds = ref<number>(0);

    /**
     * Bandera para bloquear las modificaciones en showedTimeInSeconds
     */
    const showedTimeInSecondsBlocked = ref<boolean>(false);

    /**
     * Veces en las que se ha mostrado el dialogo
     */
    const showedTimes = ref<number>(0);

    /**
     * Bandera para controlar el step del dialogo
     */
    const flagStep = ref<number>(0);

    /**
     * Metodo para reiniciar el Store
     */
    const $reset = (): void => {
      dateTimeExpire.value = null;
      showedTimeInSeconds.value = 0;
      showedTimeInSecondsBlocked.value = false;
      showedTimes.value = 0;
      isShowed.value = false;
      flagStep.value = 0;
    };

    /**
     * Cargar la fecha y hora en la cual expira el token
     */
    const loadDateTimeExpire = async (): Promise<void> => {
      if (!active) return;

      try {
        const { accessToken } = await authService.getAccessTokenFromIndexedDB();
        dateTimeExpire.value = moment(
          accessToken.expires_at_timestamp,
          'YYYY-MM-DDTHH:mm:ss.SSSSZ'
        );
      } catch (error: any) {
        //console.error('Error al obtener la fecha y hora de expiración del token', error);
      }
    };

    /**
     * Intervalo para actualizar la fecha y hora actual cada segundo
     */
    setInterval(() => {
      dateTimeNow.value = moment();

      if (isShowed.value) {
        showedTimeInSeconds.value++;
      }
    }, 1000);

    /**
     * Tiempo restante en segundos para que expire la sesión automáticamente
     */
    const timeLeftInSeconds = computed<number | null>(() => {
      if (!dateTimeExpire.value) return null;

      if (!moment.isMoment(dateTimeExpire.value) || !moment.isMoment(dateTimeNow.value)) {
        return null;
      }

      return dateTimeExpire.value.diff(dateTimeNow.value, 'seconds');
    });

    /**
     * Indica si la sesión ya expiró
     */
    const sessionIsExpired = computed<boolean>(() => {
      if (!timeLeftInSeconds.value) return false;

      return timeLeftInSeconds.value <= 0;
    });

    /**
     * Metodo para saber si se puede mostrar el dialogo
     */
    const canShow = computed<boolean>(() => {
      if (isShowed.value) return false;
      if (!dateTimeExpire.value) return false;
      if (!timeLeftInSeconds.value) return false;

      return true;
    });

    /**
     * Cadena de texto con el tiempo restante para que expire la sesión automáticamente
     *
     * Formato: HH:mm:ss
     */
    const timeLeftString = computed<string>(() => {
      if (!timeLeftInSeconds.value) return '00:00:00';
      if (timeLeftInSeconds.value <= 0) return '00:00:00';

      return moment.utc(timeLeftInSeconds.value * 1000).format('HH:mm:ss');
    });

    /**
     * Segundos restantes para cerrar la sesión manualmente
     */
    const secondsToShowLeft = computed<number>(() => {
      if (showedTimeInSeconds.value >= secondsToShow) {
        return 0;
      }

      const secondsLeft = timeLeftInSeconds.value;
      if (!secondsLeft) return 0;

      // Si el tiempo restante es mayor a los segundos que se debe mostrar el dialogo
      if (secondsLeft > secondsToShow) {
        showedTimeInSecondsBlocked.value = true;
      }

      // Si el tiempo restante es menor o igual a los segundos que se debe mostrar el dialogo
      if (secondsLeft <= secondsToShow && !showedTimeInSecondsBlocked.value) {
        showedTimeInSeconds.value = secondsToShow - secondsLeft;
      }

      return secondsToShow - showedTimeInSeconds.value;
    });

    /**
     * Metodo para mostrar el dialogo
     */
    const show = async (): Promise<void> => {
      if (!canShow.value) return;

      isShowed.value = true;
      showedTimes.value++;
    };

    /**
     * Metodo para aceptar el dialogo
     */
    const accept = async (): Promise<void> => {
      if (!isShowed.value) return;

      isShowed.value = false;
      showedTimeInSeconds.value = 0;
      flagStep.value = 0;
      dateTimeExpire.value = null;

      await authService.refreshToken();
      await loadDateTimeExpire();
    };

    /**
     * Metodo para cancelar el dialogo
     */
    const cancel = (): void => {
      isShowed.value = false;
    };

    /**
     * Metodo para cerrar la sesión
     */
    const logout = async (): Promise<void> => {
      console.warn('Cerrando sesión automáticamente', {
        sessionIsExpired: sessionIsExpired.value,
        secondsToShowLeft: secondsToShowLeft.value,
        dateTimeNow: dateTimeNow.value.format('YYYY-MM-DD HH:mm:ss'),
        dateTimeExpire: dateTimeExpire.value?.format('YYYY-MM-DD HH:mm:ss')
      });

      isShowed.value = false;
      dateTimeExpire.value = null;
      await authService.forceLogout('Sesión expirada automáticamente (useDialogSessionStore)');
    };

    /**
     * Watch para mostrar el dialogo de acuerdo al tiempo restante
     */
    watch(timeLeftInSeconds, async (value): Promise<void> => {
      // Si no hay tiempo restante
      if (!value) return;

      // Si el dialogo esta abierto
      if (isShowed.value) return;

      const hoursLeft = Math.floor(value / 3600);
      const minutesLeft = Math.floor((value % 3600) / 60);
      const secondsLeft = value % 60;

      // Si el tiempo restante es menor o igual a 4 minutos con 59 segundos
      if (flagStep.value < 1 && hoursLeft === 0 && minutesLeft <= 4 && secondsLeft <= 59) {
        flagStep.value = 1;
        await show();
      }
    });

    /**
     * Watch para cerrar la sesión
     */
    watch([secondsToShowLeft, sessionIsExpired], async (value): Promise<void> => {
      if (!active) return;

      // Si el dialogo esta abierto y el tiempo restante es menor o igual a 0
      if (value[0] <= 0 && isShowed.value) {
        await logout();
        return;
      }

      // Si la sesión ya expiró
      if (value[1]) {
        await logout();
        return;
      }
    });

    return {
      dateTimeNow,
      dateTimeExpire,
      showedTimeInSeconds,
      showedTimes,
      isShowed,
      secondsToShow,
      $reset,
      timeLeftInSeconds,
      sessionIsExpired,
      canShow,
      timeLeftString,
      secondsToShowLeft,
      show,
      accept,
      cancel,
      loadDateTimeExpire
    };
  },
  {
    persistedState: {
      persist: false
    }
  }
);

export default useDialogSessionStore;
