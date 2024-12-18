import { AxiosError, type AxiosResponse } from 'axios';
import useAESCrypt from './useAESCrypt';
import AuthService from '../services/AuthService';
import useAuthStore from '../stores/config/useAuthStore';
import { useRouter } from 'vue-router';
import type { ApiRequestConfig } from '../utils/ApiUtils';
import ManualError from '@/core/config/ManualError';
import HttpStatusEnum from '@/core/enums/HttpStatusEnum';

/**
 * Composable that provides utility functions for axios config
 */
export default function useAxiosConfigUtils() {
  /**
   * Close session if token is expired
   */
  const closeSessionIfTokenExpired = async (responseError: any): Promise<void | never> => {
    if (!(responseError instanceof AxiosError)) return
    if (!responseError.response?.status || responseError.response.status !== 401) return

    const authStore = useAuthStore();
    if (!authStore.isLoggedIn) return

    const authService = new AuthService();
    const router = useRouter();

    await authService.forceLogout('Sesión expirada automáticamente (Axios 401)');
    await router.push({ name: 'auth.login' });
  }

  /**
   * Add accessToken
  */
  const addAccessToken = async <T extends ApiRequestConfig<any>>(config: T): Promise<T> => {
    try {
      const authService = new AuthService();
      const { accessToken } = await authService.getAccessTokenFromIndexedDB();
      //@ts-ignore
      config.headers['Authorization'] = `Bearer ${accessToken.token}`;
    } catch (error) {
      // Don't do anything
    }

    return config;
  }

  /**
   * Encrypt request data
   */
  const encryptRequestData = <T extends ApiRequestConfig<any>>(config: T, encryptKey: string): T => {
    const aesCrypt = useAESCrypt();

    //@ts-ignore
    if (config.responseType === 'blob' || config.headers['Content-Type'] === 'multipart/form-data') {
      return config;
    }

    /**
     * Encrypt params
     */
    const params = config.params;
    if (params) {
      const paramsJson = JSON.stringify(params);
      config.params = {
        encryptParams: aesCrypt.encrypt(paramsJson, encryptKey)
      };
    }

    /**
     * Encrypt data
     */
    const data = config.data;
    if (data) {
      const dataJson = JSON.stringify(data);
      config.data = {
        encrypt: aesCrypt.encrypt(dataJson, encryptKey)
      };
    }

    return config;
  }

  /**
   * Decrypt response data
   */
  const decryptResponseData = <T extends AxiosResponse<any>>(response: T, encryptKey: string): T => {
    if (response.config.responseType === 'blob' || !response.data) {
      return response;
    }

    try {
      const aesCrypt = useAESCrypt();
      const decrypted = aesCrypt.decrypt(response.data.toString(), encryptKey);
      response.data = JSON.parse(decrypted);
    } catch (error: any) {
      throw new ManualError('Decrypt Response failed', 'Error', HttpStatusEnum.BAD_REQUEST, 'negative', error)
    }

    return response;
  }

  return {
    addAccessToken,
    closeSessionIfTokenExpired,
    encryptRequestData,
    decryptResponseData
  }
}
