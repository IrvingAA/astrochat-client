import type {
  LoginPayloadIC, LoginResponseIC, LogoutResponseIC, MeResponseIC, RefreshResponseIC, SearchLdapUserPayloadIC, SearchLdapUserResponseIC, VerifyResponseIC
} from '@/core/types/api/AuthApiInterface';
import Api from '@/api/Api';
import type { AxiosHeaders, RawAxiosRequestHeaders } from 'axios';

/**
 * Clase para las apis de autenticación
 */
export default class AuthApi extends Api {
  /**
   * Contructor de la clase
   */
  constructor() {
    super('auth');
  }

  /**
   * Realiza la petición para el login
   **/
  public async login(payload: LoginPayloadIC, ip_address?: string): Promise<LoginResponseIC> {
    let headers: RawAxiosRequestHeaders | AxiosHeaders | undefined = undefined;
    if (ip_address) {
      headers = {
        'X-Custom-IP': ip_address
      };
    }

    const { data } = await this.$post('/login', payload, {
      headers
    });
    return data;
  }

  /**
   * Realiza la petición para verificar la sesión
   */
  public async verify(): Promise<VerifyResponseIC> {
    const { data } = await this.$get('/verify');
    return data;
  }

  /**
   * Realiza la petición para obtener el usuario
   */
  public async me(): Promise<MeResponseIC> {
    const { data } = await this.$get('/me');
    return data;
  }

  /**
   * Realiza la petición para refrescar el token
   */
  public async refresh(): Promise<RefreshResponseIC> {
    const { data } = await this.$put('/refresh');
    return data;
  }

  /**
   * Realiza la petición para cerrar la sesión
   */
  public async logout(): Promise<LogoutResponseIC> {
    const { data } = await this.$delete('/logout');
    return data;
  }

  /**
   * Realiza la peticion para buscar un usuario en ldap
   */
  public async searchLdapUser(payload: SearchLdapUserPayloadIC): Promise<SearchLdapUserResponseIC> {
    const { data } = await this.$get('/search-ldap-user', {
      params: payload
    });

    return data;
  }

  /**
   * Realiza la petición para registrar un usuario
   */
  public async register(payload: LoginPayloadIC): Promise<void> {
    await this.$post('/register', payload);
  }
}
