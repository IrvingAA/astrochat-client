import type HttpStatusEnum from '@/core/enums/HttpStatusEnum';
import type { TypeAlertIC } from '@/core/types/stores/components/ui/dialogs/useDialogAlertStoreInterface';

/**
 * Tipado para los payloads de las APIs
 */
export type ApiPayloadIC<T> = T;

/**
 * Tipado de respuesta de las APIs
 */
export type ApiResponseIC<T> = {
  dateTime: string;
  httpCode: HttpStatusEnum;
  alert: TypeAlertIC;
  title: string;
  message: string | null;
  data: T;
};

/**
 * Tipado de respuesta de las APIs con paginación
 */
export type ApiResponseWithPaginationIC<T> = ApiResponseIC<StandardPaginationIC<T>>;

/**
 * Tipado para la paginacion estandarizada
 */
export type StandardPaginationIC<T> = {
  pagination: {
    limit?: number;
    currentPage: number;
    perPage: number;
    lastPage: number;
    totalPages?: number;
    total: number;
    from: number;
    to: number;
    itemsOnPage: number;
  };
  items: T;
};

/**
 * Tipado de respuesta incorrecta de las APIs
 */
export type ApiErrorResponseIC = Omit<ApiResponseIC<any>, 'title' | 'message'> & {
  alert: Exclude<TypeAlertIC, 'positive'>;
  title: string;
  message: string;
};
