import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Store para abortar operaciones
 */
const useAbortStore = defineStore(
  'core.config.abort',
  () => {
    /**
     * AbortController
     */
    const abortController = ref<AbortController>(new AbortController());

    /**
     * Reset
     */
    const $reset = () => {
      abortController.value = new AbortController();
    };

    /**
     * Abort signal
     */
    const abort = () => {
      abortController.value.abort();
      $reset();
    };

    /**
     * Get signal
     */
    const getSignal = () => {
      return abortController.value.signal;
    };

    return {
      $reset,
      abortController,
      abort,
      getSignal
    };
  },
  {
    persistedState: {
      persist: false
    }
  }
);

export default useAbortStore;
