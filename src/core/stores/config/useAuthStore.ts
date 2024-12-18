import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { UserIc } from '@/core/types/api/AuthApiInterface';
import moment from 'moment';

const useAuthStore = defineStore(
  'core.config.authStore',
  () => {
    /**
     * Almacena la información del usuario que inició sesión
     */
    const user = ref<UserIc | null>(null);

    /**
     * Almacena la fecha y hora actual
     */
    const dateTimeNow = ref<moment.Moment>(moment());

    /**
     * Almacena la fecha de expiración de la sesión
     */
    const dateTimeExpire = ref<moment.Moment | null>(null);

    /**
     * Almacena los segundos que faltan para que la sesión expire
     */
    const secondsToExpire = computed<number>(() => {
      if (!dateTimeExpire.value) return 0;
      return dateTimeExpire.value.diff(dateTimeNow.value, 'seconds');
    });

    /**
     * Almacena el tiempo que falta para que la sesión expire
     * (Formato de secondsToExpire.value en HH:mm:ss)
     */
    const timeLeftString = computed<string>(() => {
      if (secondsToExpire.value <= 0) return '00:00:00';
      return moment.utc(secondsToExpire.value * 1000).format('HH:mm:ss');
    });

    /**
     * Imprime en consola la información de la sesión
     */
    const printSession = (): void => {
      if (!isLoggedIn.value) return;

      console.warn('Información de sesión', {
        fechaHoraActual: dateTimeNow.value.format('YYYY-MM-DD HH:mm:ss'),
        fechaHoraExpiracion: dateTimeExpire.value?.format('YYYY-MM-DD HH:mm:ss') || null,
        tiempoRestante: timeLeftString.value
      });
    };

    /**
     * Modifica el valor de user
     */
    const setUser = (newValue: UserIc, dateTimeExpireMoment: moment.Moment): void => {
      user.value = newValue;
      dateTimeExpire.value = dateTimeExpireMoment;
    };
    /**
     * Actualiza la fecha y hora actual
     */
    setInterval(() => {
      dateTimeNow.value = moment();
    }, 1000);

    /**
     * Bandera para saber si el usuario ha iniciado sesión
     * (Revisa si el usuario existe, si la fecha de expiración existe y si la fecha de expiración es mayor a la fecha y hora actual)
     */
    const isLoggedIn = computed<boolean>(() => {
      if (!user.value) return false;
      if (!dateTimeExpire.value) return false;
      if (secondsToExpire.value <= 0) return false;

      return true;
    });

    /**
     * Reinicia el Store
     */
    const $reset = (): void => {
      user.value = null;
      dateTimeExpire.value = null;
    };

    return {
      $reset,
      user,
      dateTimeNow,
      dateTimeExpire,
      secondsToExpire,
      printSession,
      timeLeftString,
      setUser,
      isLoggedIn
    };
  },
  {
    persistedState: {
      persist: false
    }
  }
);

export default useAuthStore;
