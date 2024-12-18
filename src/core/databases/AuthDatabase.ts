import type {
  ItemsIC,
  SaveSessionIC,
  getSessionIC
} from '@/core/types/databases/AuthDatabaseInterface';
import Database from '@/databases/Database';
import type { TokenIC, UserIc } from '@/core/types/api/AuthApiInterface';

/**
 * Base de datos de autenticación
 *
 * @class AuthDatabase
 */
export default class AuthDatabase extends Database {
  /**
   * Nombre de los items
   */
  private items: ItemsIC = {
    accessToken: 'access_token',
    user: 'user'
  };

  /**
   * Contructor de la clase
   */
  constructor() {
    super('auth');
  }

  /**
   * Guarda la sesión
   */
  public async saveSession(args: SaveSessionIC): Promise<void> {
    await this.$reset();
    await this.$setItem(this.items.user, args.user);
    await this.$setItem(this.items.accessToken, args.accessToken);
  }

  /**
   * Obtiene la sesión
   */
  public async getSession(): Promise<getSessionIC> {
    const user = await this.$getItem<UserIc>(this.items.user);
    const accessToken = await this.$getItem<TokenIC>(this.items.accessToken);

    console.log('user', user);
    console.log('accessToken', accessToken);

    return {
      user: user ?? null,
      accessToken: accessToken ?? null
    };
  }

  /**
   * Guarda el token
   */
  public async saveToken(token: TokenIC): Promise<void> {
    await this.$setItem(this.items.accessToken, token);
  }
}
