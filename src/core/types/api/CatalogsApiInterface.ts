import type { AllCatalogsIC } from '@/core/types/services/CatalogsServiceInterface';
import type { ApiResponseIC } from '@/core/types/api/ApiType';

/**
 * Tipado de index response
 */
export type IndexResponseIC = ApiResponseIC<AllCatalogsIC>;
