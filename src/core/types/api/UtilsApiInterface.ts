import type { ApiPayloadIC, ApiResponseIC } from '@/core/types/api/ApiType';

/**
 * Tipado para el payload de la API "uploadFile"
 */
export type UploadFilePayload = ApiPayloadIC<{
  idFile?: number | null;
  file: File | null;
  description: string | null;
  saveFolder?: string; //Si se envia un nombre, se creara una carpeta con ese nombre y se guardara el archivo dentro de esa carpeta
}>;

/**
 * Tipado para la respuesta de la API "uploadFile"
 */
export type UploadFileResponse = ApiResponseIC<{
  hash_id: string;
  fileName: string;
  fileNameHash: string;
  description: string;
  updated_at: string;
  created_at: string;
  id: number;
}>;

/**
 * Tipado para el payload de la API "uploadMultipleFiles"
 */
export type UploadMultipleFilesPayload = ApiPayloadIC<{
  filesArray: {
    file: File;
    flag?: string | null;
    description?: string | null;
    saveFolder?: string;
  }[];
}>;

/**
 * Tipado para la respuesta de la API "uploadMultipleFiles"
 */
export type UploadMultipleFilesResponse = ApiResponseIC<
  {
    originalName: string;
    flag: string | null;
    status: 'ok' | 'error';
    id: number | null;
    error: string | null;
  }[]
>;

/**
 * Tipado para el payload de la API "getMultipleFiles"
 */
export type GetMultipleFilesPayload = ApiPayloadIC<{
  filesArray: {
    id: number;
    flag?: string | null;
  }[];
}>;

/**
 * Tipado para la respuesta de la API "getMultipleFiles"
 */
export type GetMultipleFilesResponse = ApiResponseIC<
  {
    id: number;
    flag: string | null;
    status: 'ok' | 'error';
    originalName: string | null;
    hashName: string | null;
    url: string | null;
    error: string | null;
  }[]
>;
