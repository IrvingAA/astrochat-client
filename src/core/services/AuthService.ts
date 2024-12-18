import type { GetTokensIC } from '@/core/types/services/AuthServiceInterface';
import AuthDatabase from '@/core/databases/AuthDatabase';
import ManualError from '@/core/config/ManualError';
import CustomHandler from '@/core/config/CustomHandler';
import GlobalStoreService from '@/core/services/GlobalStoreService';
import useAuthStore from '@/core/stores/config/useAuthStore';
import AuthApi from '@/core/api/AuthApi';
import GlobalDatabaseService from '@/core/services/GlobalDatabaseService';
import type {
  LoginPayloadIC,
  UserIc,
  MeResponseIC,
  RefreshResponseIC,
  SearchLdapUserPayloadIC,
  SearchLdapUserResponseIC,
} from '@/core/types/api/AuthApiInterface';
import GlobalFormsService from './GlobalFormsService';
import moment from 'moment';
import ExternalsApi from '@/core/api/ExternalsApi';
import type { GetIpDataResponseIC } from '@/core/types/api/ExternalsApiInterface';
import useDialogAlertStore from '../stores/components/ui/dialogs/useDialogAlertStore';

/**
 * Clase para el servicio de autenticación
 */
export default class AuthService {
  /**
   * Base de datos de autenticación
   */
  private authDatabase: AuthDatabase;

  /**
   * Servicio del Global Database
   */
  private globalDatabaseService: GlobalDatabaseService;

  /**
   * Servicio del Global Store
   */
  private globalStoreService: GlobalStoreService;

  /**
   * Servicio del Global Forms
   */
  private globalFormsService: GlobalFormsService;

  /**
   * Api de autenticación
   */
  private authApi: AuthApi;

  /**
   * Apis externas
   */
  private externalsApi: ExternalsApi;

  /**
   * Contructor de la clase
   */
  constructor() {
    this.authDatabase = new AuthDatabase();
    this.globalDatabaseService = new GlobalDatabaseService();
    this.globalStoreService = new GlobalStoreService();
    this.globalFormsService = new GlobalFormsService();
    this.authApi = new AuthApi();
    this.externalsApi = new ExternalsApi();
  }

  /**
   * AuthStore
   */
  public authStore() {
    return useAuthStore();
  }

  /**
   * Metodo para iniciar sesión con un MeResponseIC
   */
  public async loginWithMeResponseData(meResponseData: MeResponseIC['data']): Promise<void> {
    await this.authDatabase.saveSession(meResponseData);
    await this.loadUserOnStore();
  }

  /**
   * Metodo para cargar el usuario en el store desde la base de datos indexada
   *
   * @returns {Promise<void>}
   */
  public async loadUserOnStore(): Promise<void> {
    const user = await this.getUserFromIndexedDB();
    const token = await this.getAccessTokenFromIndexedDB();
    const authStore = this.authStore();
    const dateTimeExpire = moment(
      token.accessToken.expires_at_timestamp,
      'YYYY-MM-DDTHH:mm:ss.SSSSZ'
    );

    authStore.setUser(user, dateTimeExpire);
  }

  /**
   * Metodo para iniciar sesión
   */
  public async login(payload: LoginPayloadIC): Promise<void> {
    try {
      /**
       * IP WS section
       */
      let ipData: null | GetIpDataResponseIC = null;
      try {
        ipData = await this.externalsApi.getIpData();
      } catch (error: any) {
        console.error(error);
      }

      /**
       * WS Auth
       */
      const response = await this.authApi.login(payload, ipData?.ip);
      await this.loginWithMeResponseData(response.data);
    } catch (error: any) {
      throw new CustomHandler(error);
    }
  }

  /**
   * Metodo para cerrar la sesión
   */
  public async logout(): Promise<void> {
    try {
      await this.authApi.logout();
    } catch (error: any) {
      //No pasa nada\
    }

    this.globalStoreService.$reset();
    await this.globalDatabaseService.$reset();
    await this.globalFormsService.cleanForms();
  }

  /**
   * Metodo para cerrar la sesión y lanzar un dialogo de alerta
   */
  public async forceLogout(reason?: string): Promise<void> {
    if (reason) console.error('Se ha forzado el cierre de sesión:', reason)

    const dialogAlertStore = useDialogAlertStore();
    await this.logout();
    await dialogAlertStore.triggerDialogAlert('warning', 'Atención', 'Debes iniciar sesión nuevamente');
  }

  /**
   * Metodo para obtener el usuario desde IndexedDB
   */
  public async getUserFromIndexedDB(): Promise<UserIc> {
    try {
      const getSession = await this.authDatabase.getSession();
      if (!getSession?.user) {
        throw new ManualError('No hay un usuario en sesión');
      }

      return getSession.user;
    } catch (error: any) {
      throw new CustomHandler(error);
    }
  }

  /**
   * Metodo para obtener el token de acceso desde IndexedDB
   */
  public async getAccessTokenFromIndexedDB(): Promise<GetTokensIC> {
    try {
      const getSession = await this.authDatabase.getSession();
      if (!getSession?.accessToken) throw new ManualError('No hay token de sesión');

      return {
        accessToken: getSession.accessToken
      };
    } catch (error: any) {
      throw new CustomHandler(error);
    }
  }

  /**
   * Verify if the access token is expired
   */
  public async accessTokenIsExpired(): Promise<boolean> {
    try {
      const { accessToken } = await this.getAccessTokenFromIndexedDB();
      const dateTimeNow = moment();
      const tokenExpiration = moment(accessToken.expires_at_timestamp);

      const timeLeftInSeconds = tokenExpiration.diff(dateTimeNow, 'seconds');
      const hoursLeft = Math.floor(timeLeftInSeconds / 3600)
        .toString()
        .padStart(2, '0');
      const minutesLeft = Math.floor((timeLeftInSeconds % 3600) / 60)
        .toString()
        .padStart(2, '0');
      const secondsLeft = (timeLeftInSeconds % 60).toString().padStart(2, '0');

      console.warn('Información de sesión', {
        fechaActual: dateTimeNow.format('YYYY-MM-DD HH:mm:ss'),
        fechaExpiracion: tokenExpiration.format('YYYY-MM-DD HH:mm:ss'),
        tiempoRestante: `${hoursLeft}:${minutesLeft}:${secondsLeft}`
      });

      return timeLeftInSeconds <= 0;
    } catch (error: any) {
      return false;
    }
  }

  /**
   * Metodo que retorna un bool indicando si el usuario esta autenticado en IndexedDB
   */
  public async isAuthOnIndexedDB(): Promise<boolean> {
    try {
      await this.getUserFromIndexedDB();
      await this.getAccessTokenFromIndexedDB();
      return true;
    } catch (error: any) {
      return false;
    }
  }

  /**
   * Metodo que retorna un bool indicando si el usuario esta autenticado en el servidor
   */
  public async isAuthOnServer(): Promise<boolean> {
    try {
      const { data } = await this.authApi.verify();
      await this.authDatabase.saveToken(data);
      return true;
    } catch (error: any) {
      console.error(error);
      return false;
    }
  }

  /**
   * Metodo que retorna tu información de usuario
   */
  public async me(): Promise<MeResponseIC['data']> {
    try {
      const response = await this.authApi.me();
      return response.data;
    } catch (error: any) {
      throw new CustomHandler(error);
    }
  }

  /**
   * Metodo para refrescar el token
   */
  public async refresh(): Promise<RefreshResponseIC['data']> {
    try {
      const response = await this.authApi.refresh();
      return response.data;
    } catch (error: any) {
      throw new CustomHandler(error);
    }
  }
  /**
   * Metodo para buscar usuario ldap
   */
  public async searchLdapUser(
    payload: SearchLdapUserPayloadIC
  ): Promise<SearchLdapUserResponseIC['data']> {
    try {
      const res = await this.authApi.searchLdapUser(payload);
      return res.data;
    } catch (error: any) {
      throw new CustomHandler(error);
    }
  }

  /**
 * Metodo para refrescar el token de acceso
 */
  public async refreshToken(): Promise<void> {
    const response = await this.authApi.refresh()
    await this.authDatabase.saveSession(response.data)
  }

  /**
   * Metodo para registrar un usuario
   */
  public async register(payload: LoginPayloadIC): Promise<void> {
    try {
      await this.authApi.register(payload);
    } catch (error: any) {
      throw new CustomHandler(error);
    }
  }
}
