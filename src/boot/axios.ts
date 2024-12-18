import { boot } from 'quasar/wrappers';
import axios, { type AxiosInstance } from 'axios';
import { ref } from 'vue';
import useEnv from '@/core/composables/useEnv';
import useAxiosConfigUtils from '@/core/composables/useAxiosConfigUtils';
import type { ApiRequestConfig } from '@/core/utils/ApiUtils';
import useUtils from '@/core/composables/useUtils';
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

/**
 * Import
 */
const env = useEnv();
const utils = useUtils();
const utilsConfig = useAxiosConfigUtils();

/**
 * Vars
 */
const encryptFlag = env.ENCRYPT === 'true';
const encryptKey = env.ENCRYPT_AES_KEY as string;
const axiosIsLoading = ref<boolean>(false);

/**
 * Axios instance
 */
const axiosInstance = axios.create({
  baseURL: `${env.API_URL}/`,
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'pragma': 'no-cache',
    'cache-control': 'no-cache="Set-Cookie", no-store, must-revalidate',
    'no-cache': 'Set-Cookie, Set-Directive Cookie2',
    'X-Frame-Options': 'deny',
    'X-XSS-Protection': '1; mode=block',
    'Content-Security-Policy': 'default-src "self"'
  },
});


/**
 * Interceptor for requests
 */
//@ts-ignore
axiosInstance.interceptors.request.use(async (config: ApiRequestConfig) => {
  axiosIsLoading.value = true;

  config = await utilsConfig.addAccessToken(config);

  if (encryptFlag && config.sendUncrypted !== true) {
    config = utilsConfig.encryptRequestData(config, encryptKey);
  } else {
    /**
     * Set header flag for decrypted response
     */
    //@ts-ignore
    config.headers['Accept-DR'] = true;
  }


  return config;
}, (error: any) => {
  axiosIsLoading.value = false
  return Promise.reject(error)
})


/**
 * Interceptor for responses
*/
//@ts-ignore
axiosInstance.interceptors.response.use(async (response) => {
  try {
    response = utilsConfig.decryptResponseData(response, encryptKey);
  } catch (error: any) {
    let isThrowable: boolean = true;
    const newErr = await utils.catchSimpleError(error);

    if (newErr?.message === 'Decrypt Response failed') {
      isThrowable = false;
      console.info('Info: No se logró desencriptar la respuesta del servidor.');
      // En caso de que la respuesta SI esté encriptada y no se haya logrado
      // realizar esta acción puede que la respuesta no sea válida o requiera
      // de una clave de desencriptación diferente (.env > ENCRYPT_AES_KEY)
    }

    if (isThrowable) {
      throw error;
    }
  }

  axiosIsLoading.value = false
  return response
}, async (error: any) => {
  axiosIsLoading.value = false

  await utilsConfig.closeSessionIfTokenExpired(error);
  return Promise.reject(error)
})


/**
 * Boot function
 */
export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = axiosInstance;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { axiosInstance, axiosIsLoading };
