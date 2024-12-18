import { axiosInstance } from '@/boot/axios'
import ApiUtils, { type ApiRequestConfig } from '@/core/utils/ApiUtils'
import type { AxiosInstance, AxiosResponse } from 'axios'

/**
 * Utils
 */
const utils = ApiUtils()


/**
 * Base class for all API classes.
 */
export default abstract class Api {
  /**
   * Prefijo de la API
   */
  protected prefixApi: string

  /**
   * Instancia para hacer peticiones
   */
  private axios: AxiosInstance

  /**
   * Constructor de la clase
   */
  constructor(prefixApi: string) {
    this.prefixApi = prefixApi
    this.axios = axiosInstance
  }

  /**
   * Get Request
   */
  protected async $get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: ApiRequestConfig<D>): Promise<R> {
    url = utils.removeLastSlash(url)
    const newConfig = utils.makeNewConfig(config)

    return await this.axios.get<T, R>(`${this.prefixApi}${url}`, newConfig)
  }

  /**
   * Post Request
   */
  protected async $post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: ApiRequestConfig<D>): Promise<R> {
    url = utils.removeLastSlash(url)

    let payload = data || {}
    const newConfig = utils.makeNewConfig(config)
    if (newConfig?.isFormData) payload = utils.objectToFormData(payload, 'POST')

    return await this.axios.post<T, R>(`${this.prefixApi}${url}`, payload, newConfig)
  }

  /**
   * Put Request
   */
  protected async $put<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: ApiRequestConfig<D>): Promise<R> {
    url = utils.removeLastSlash(url)

    let payload = data || {}
    const newConfig = utils.makeNewConfig(config)
    if (newConfig?.isFormData) {
      payload = utils.objectToFormData(payload, 'PUT')
      return await this.axios.post<T, R>(`${this.prefixApi}${url}`, payload, newConfig)
    }

    return await this.axios.put<T, R>(`${this.prefixApi}${url}`, payload, newConfig)
  }

  /**
   * Patch Request
   */
  protected async $patch<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: ApiRequestConfig<D>): Promise<R> {
    url = utils.removeLastSlash(url)

    let payload = data || {}
    const newConfig = utils.makeNewConfig(config)
    if (newConfig?.isFormData) {
      payload = utils.objectToFormData(payload, 'PATCH')
      return await this.axios.post<T, R>(`${this.prefixApi}${url}`, payload, newConfig)
    }

    return await this.axios.patch<T, R>(`${this.prefixApi}${url}`, payload, newConfig)
  }

  /**
   * Delete Request
   */
  protected async $delete<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: ApiRequestConfig<D>): Promise<R> {
    url = utils.removeLastSlash(url)
    const newConfig = utils.makeNewConfig(config)

    return await this.axios.delete<T, R>(`${this.prefixApi}${url}`, newConfig)
  }
}
