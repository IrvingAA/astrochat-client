import type { ApiErrorResponseIC } from '@/core/types/api/ApiType';

/**
 * Tipado para la normalizacion de datos
 */
export type NormalizeDataIC = ApiErrorResponseIC & {
  from: 'manual' | 'axios' | 'unknown';
  title: string;
  message: string;
  data: any;
};

/**
 * Tipado de AxiosReturnData
 */
export type AxiosReturnDataIC = Omit<NormalizeDataIC, 'from'>;
