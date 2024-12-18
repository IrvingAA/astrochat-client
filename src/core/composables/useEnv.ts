/**
 * Composable para obtener variables de entorno
 */
import { computed } from 'vue';
const useEnv = () => {
  return {
    DOCKER_APP_NAME: computed(() => process.env.DOCKER_APP_NAME).value,
    DOCKER_TIMEZONE: computed(() => process.env.DOCKER_TIMEZONE).value,
    DOCKER_GID: computed(() => process.env.DOCKER_GID).value,
    DOCKER_UID: computed(() => process.env.DOCKER_UID).value,

    APP_HOST_PORT: computed(() => process.env.APP_HOST_PORT).value,

    APP_NAME: computed(() => process.env.APP_NAME).value,
    SHORT_APP_NAME: computed(() => process.env.SHORT_APP_NAME).value,
    COMPANY_NAME: computed(() => process.env.COMPANY_NAME).value,
    APP_VERSION: computed(() => process.env.APP_VERSION).value,
    DEBUG_MODE: computed(() => process.env.DEBUG_MODE).value,
    ENVIRONMENT_MODE: computed(() => process.env.ENVIRONMENT_MODE).value,
    API_URL: computed(() => process.env.API_URL).value,
    PUBLIC_PATH: computed(() => process.env.PUBLIC_PATH).value,

    ENCRYPT: computed(() => process.env.ENCRYPT).value,
    ENCRYPT_AES_KEY: computed(() => process.env.ENCRYPT_AES_KEY).value,
    GRAPHQL_URL: computed(() => process.env.GRAPHQL_URL).value,
    GRAPHQL_WS_URL: computed(() => process.env.GRAPHQL_WS_URL).value,
    DB_NAME: computed(() => process.env.APP_NAME + '_' + process.env.APP_VERSION).value,
  }
}

export default useEnv;
