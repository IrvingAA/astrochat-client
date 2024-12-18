/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;

    DOCKER_APP_NAME: string | undefined;
    DOCKER_TIMEZONE: string | undefined;
    DOCKER_GID: string | undefined;
    DOCKER_UID: string | undefined;

    APP_HOST_PORT: string | undefined;

    APP_NAME: string | undefined;
    SHORT_APP_NAME: string | undefined;
    COMPANY_NAME: string | undefined;
    APP_VERSION: string | undefined;
    DEBUG_MODE: 'true' | 'false' | undefined;
    ENVIRONMENT_MODE: 'dev' | 'qa' | 'stg' | 'prod' | undefined;
    API_URL: string | undefined;
    PUBLIC_PATH: string | undefined;

    ENCRYPT: 'true' | 'false' | undefined;
    ENCRYPT_AES_KEY: string | undefined;

    JWT_SECRET: string | undefined;
    GRAPHQL_URL: string | undefined;
    GRAPHQL_WS_URL: string | undefined;
    MONGO_URI_DOCKER: string | undefined;
    MONGO_URI_LOCAL: string | undefined;
  }
}
