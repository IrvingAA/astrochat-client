import Api from '@/api/Api';

import type {
  UploadFilePayload,
  UploadFileResponse,
  UploadMultipleFilesPayload,
  UploadMultipleFilesResponse,
  GetMultipleFilesPayload,
  GetMultipleFilesResponse
} from '@/core/types/api/UtilsApiInterface';

/**
 * Utils API
 */
export default class UtilsApi extends Api {
  /**
   * Constructor
   */
  constructor() {
    super('utils');
  }

  /**
   * Upload file API
   */
  public async uploadFile(payload: UploadFilePayload): Promise<UploadFileResponse> {
    const { data } = await this.$post('/files', payload, {
      isFormData: true,
      sendUncrypted: true
    });
    return data;
  }

  /**
   * Api para guardar multiples archivos
   */
  public async uploadMultipleFiles(
    payload: UploadMultipleFilesPayload
  ): Promise<UploadMultipleFilesResponse> {
    const { data } = await this.$post('/multiple-files', payload, {
      isFormData: true,
      sendUncrypted: true
    });

    return data;
  }

  /**
   * Api para obtener un archivo individual
   *
   * @param fileName
   */
  public async getSingleFile(fileNameHash: string): Promise<Blob> {
    const { data } = await this.$get('/single-file/' + fileNameHash, {
      responseType: 'blob',
      sendUncrypted: true
    });

    return data;
  }

  /**
   * Api para obtener multiples archivos en url
   */
  public async getMultipleFiles(
    payload: GetMultipleFilesPayload
  ): Promise<GetMultipleFilesResponse> {
    const { data } = await this.$get<GetMultipleFilesResponse>('/multiple-files', {
      params: payload,
      sendUncrypted: false
    });

    return data;
  }

  /**
   *
   * @param fileName
   */
  public async getExport(fileName: string, model: string, filters: any): Promise<Blob> {
    const { data } = await this.$get('/get-export', {
      params: {
        fileName: fileName,
        model: model,
        filters: filters
      },
      responseType: 'blob',
      sendUncrypted: true
    });
    return data;
  }
}
