import useAbortStore from '@/core/stores/config/useAbortStore';
import type { AxiosRequestConfig } from 'axios';

/**
 * Tipado para la configuración de la petición
 */
export type ApiRequestConfig<D> = AxiosRequestConfig<D> & {
  isFormData?: boolean;
  sendUncrypted?: boolean;
};

/**
 * Utilidades API
 */
export default function ApiUtils() {
  /**
   * Transforma un objeto en un FormData
   */
  function objectToFormData(
    obj: Record<string, any>,
    method: 'POST' | 'PUT' | 'PATCH',
    formData: FormData = new FormData(),
    parentKey = ''
  ): FormData {
    //if _method is set on the form data no need to set it again
    if (!formData.has('_method')) {
      formData.append('_method', method);
    }

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const keyName = parentKey ? `${parentKey}[${key}]` : key;

        if (Array.isArray(obj[key])) {
          obj[key].forEach((item: any, index: number) => {
            if (typeof item === 'object' && !(item instanceof File)) {
              objectToFormData(item, method, formData, `${keyName}[${index}]`);
            } else {
              formData.append(`${keyName}[${index}]`, item);
            }
          });
        } else if (typeof obj[key] === 'object' && !(obj[key] instanceof File)) {
          objectToFormData(obj[key], method, formData, keyName);
        } else {
          formData.append(keyName, obj[key]);
        }
      }
    }

    return formData;
  }

  /**
   * Remove last slash from string (if exists)
   */
  function removeLastSlash(str: string): string {
    return str.replace(/\/$/, '');
  }

  /**
   * Make new config
   */
  function makeNewConfig(config?: ApiRequestConfig<any>): ApiRequestConfig<any> {
    const newConfig: ApiRequestConfig<any> = config ? { ...config } : {};

    /**
     * If sendUncrypted is true, add header to config
     */
    if (newConfig?.sendUncrypted)
      newConfig.headers = {
        ...newConfig.headers,
        'Accept-C': false
      };

    /**
     * Add abort signal to config
     */
    if (!newConfig?.signal) {
      const abortStore = useAbortStore();
      newConfig.signal = abortStore.getSignal();
    }

    return newConfig;
  }

  return {
    removeLastSlash,
    objectToFormData,
    makeNewConfig
  };
}
