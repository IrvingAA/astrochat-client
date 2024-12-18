import AuthService from '@/core/services/AuthService';
import CatalogsService from '@/core/services/CatalogsService';
import GlobalDatabaseService from '@/core/services/GlobalDatabaseService';
import GlobalFormsService from '@/core/services/GlobalFormsService';
import GlobalStoreService from '@/core/services/GlobalStoreService';
import useAppStore from '../stores/config/useAppStore';
import useAppStoreTemp from '../stores/config/useAppStoreTemp';
import useEnv from '../composables/useEnv';
import useUtils from '../composables/useUtils';

/**
 * Clase para manejar la aplicación
 */
export default class AppService {
  /**
   * Clase GlobalDatabaseService
   *
   * @type {GlobalDatabaseService}
   */
  private globalDatabaseService: GlobalDatabaseService;

  /**
   * Clase GlobalStoreService
   *
   * @type {GlobalStoreService}
   */
  private globalStoreService: GlobalStoreService;

  /**
   * Clase CatalogsService
   *
   * @type {CatalogsService}
   */
  private catalogsService: CatalogsService;

  /**
   * Clase GlobalFormsService
   *
   * @type {GlobalFormsService}
   */
  private globalFormsService: GlobalFormsService;

  /**
   * Clase AuthService
   *
   * @type {AuthService}
   */
  private authService: AuthService;

  /**
   * Constructor de la clase
   */
  constructor() {
    this.globalDatabaseService = new GlobalDatabaseService();
    this.globalStoreService = new GlobalStoreService();
    this.catalogsService = new CatalogsService();
    this.globalFormsService = new GlobalFormsService();
    this.authService = new AuthService();
  }

  /**
 * AppStore (Almacena datos de la aplicación)
 *
 * @type {ReturnType<typeof useAppStore>}
 */
  public get appStore(): ReturnType<typeof useAppStore> {
    return useAppStore();
  }

  /**
   * AppStoreTemp (Almacena datos temporales de la aplicación)
   */
  public get appStoreTemp(): ReturnType<typeof useAppStoreTemp> {
    return useAppStoreTemp();
  }

  /**
  * Get of useUtils
  */
  public get utils() {
    return useUtils();
  }

  /**
   * Inicia la aplicación
   *
   * @param {boolean} force = false
   * @returns {Promise<void>}
   */
  public async init(force: boolean = false): Promise<void> {
    await this.registerTabId();
    await this.globalStoreService.$init();
    await this.catalogsService.saveCatalogsOnPinia(force);
    //await this.globalFormsService.loadForms();
  }

  /**
   * Limpia la aplicación
   *
   * @param {string[]} exceptionsDB = []
   * @returns {Promise<void>}
   */
  public async clean(exceptionsDB: string[] = []): Promise<void> {
    await this.globalDatabaseService.$reset(exceptionsDB);
    await this.globalStoreService.$reset();

    //Clean session and local storage
    window.localStorage.clear();
    window.sessionStorage.clear();

    //clean cache of service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }

    this.utils.debugLog('log', 'Aplicación limpia');
  }

  /**
   * Reinicia la aplicación
   *
   * @param {string[]} exceptionsDB = []
   * @param {boolean} force = true
   * @returns {Promise<void>}
   */
  public async reset(exceptionsDB: string[], force: boolean = true): Promise<void> {
    await this.clean(exceptionsDB);
    await this.init(force);
  }

  /**
   * Reinicia la aplicación sin limpiar la base de datos de autenticación
   *
   * @returns {Promise<void>}
   */
  public async resetWithoutAuth(): Promise<void> {
    await this.reset(['AuthDatabase']);
    await this.authService.loadUserOnStore();
  }

  /**
   * Registra el ID de la pestaña que se esta utilizando
   *
   * @returns {Promise<void>}
   */
  public async registerTabId(): Promise<void> {
    const env = useEnv();
    const tabId = Math.random().toString(36).substring(2, 15);
    this.appStoreTemp.tabId = tabId;
    localStorage.setItem('validTabId_' + env.APP_NAME, tabId);
    this.appStoreTemp.isInvalidTab = false;
  }
}
