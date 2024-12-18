import type { MeResponseIC, TokenIC, UserIc } from '@/core/types/api/AuthApiInterface';

/**
 * Tipado de los items de la base de datos
 */
export type ItemsIC = {
  accessToken: string;
  user: string;
};

/**
 * Tipado de saveSession
 */
export type SaveSessionIC = MeResponseIC['data'];

/**
 * Tipado de getSession
 */
export type getSessionIC = {
  accessToken: TokenIC | null;
  user: UserIc | null;
};
