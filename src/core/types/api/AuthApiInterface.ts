import type { ApiPayloadIC, ApiResponseIC } from '@/core/types/api/ApiType';

/**
 * Tipado del payload de login
 */
export type LoginPayloadIC = ApiPayloadIC<{
  username: string;
  password: string;
  name?: string;
  lastName?: string;
  email?: string;
}>;

/**
 * Tipado del response de login
 */
export type LoginResponseIC = MeResponseIC;

/**
 * Tipado del usuario
 */
export type UserIc = {
  id: number;
  hash_id: string;
  username: string;
  email: string;
  full_name: string;
  name: string;
  lasName: string;
  isActive: boolean;
  profile?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};


/**
 * Tipado del Token
 */
export type TokenIC = {
  type: string;
  token: string;
  expires_at_timestamp: string;
};

/**
 * Tipado del response de verify
 */
export type VerifyResponseIC = ApiResponseIC<TokenIC>;

/**
 * Tipado del response de me
 */
export type MeResponseIC = ApiResponseIC<{
  accessToken: TokenIC;
  user: UserIc;
}>;

/**
 * Tipado del response de refresh
 */
export type RefreshResponseIC = MeResponseIC;

/**
 * Tipado del response de logout
 */
export type LogoutResponseIC = ApiResponseIC<null>;

/**
 * Tipado para el payload de searchLdapUser
 */
export type SearchLdapUserPayloadIC = ApiPayloadIC<{
  search: string;
}>;

/**
 * Tipado para el response de searchLdapUser
 */
export type SearchLdapUserResponseIC = ApiResponseIC<{
  username: string;
  email: string;
  name: string;
  familyName: string;
  motherFamilyName: string;
}>;
