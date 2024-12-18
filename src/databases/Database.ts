import useAESCrypt from '@/core/composables/useAESCrypt'
import useEnv from '@/core/composables/useEnv'
import LocalForageConfig from '@/core/config/LocalForageConfig'

/**
 * Base Class for all Databases
 */
export default abstract class Database {
  /**
   * LocalForage Config
   */
  private localForageConfig: LocalForageConfig

  /**
   * Almacenamiento de autenticación
   */
  // @ts-ignore
  private database: LocalForage

  /**
   * Activar o desactivar cifrado
   *
   * @type {boolean}
   */
  private enableCrypt: boolean

  /**
   * Llave de cifrado
   *
   * @type {string}
   */
  private cryptKey: string

  /**
   * Contructor de la clase
   */
  constructor(storeName: string) {
    const env = useEnv()

    this.localForageConfig = new LocalForageConfig()
    this.database = this.localForageConfig.createOrUseStore(storeName)
    this.cryptKey = env.ENCRYPT_AES_KEY as string
    this.enableCrypt = env.ENCRYPT === 'true'
  }

  /**
   * Crypt
   */
  private get crypt() {
    return useAESCrypt()
  }

  /**
   * Save an item
   */
  public async $setItem(key: string, value: any): Promise<void> {
    const realValue = await value
    if (!this.enableCrypt) {
      console.log('No encrypt')
      return await this.database.setItem(key, value)
    }

    const lastValue = JSON.stringify({
      realValue: realValue
    })

    const encrypted = {
      encrypted: this.crypt.encrypt(lastValue, this.cryptKey)
    }


    await this.database.setItem(key, encrypted)
  }

  /**
   * Get an item
   */
  public async $getItem<T>(key: string): Promise<T | null> {
    const item = await this.database.getItem<any | null>(key)
    if (item?.encrypted) {
      const itemDecrypted = this.crypt.decrypt(item.encrypted, this.cryptKey)
      if (!itemDecrypted) {
        return null
      }

      const lastValue = JSON.parse(itemDecrypted)
      return lastValue.realValue
    }

    return item
  }

  /**
   * Delete an item
   */
  public async $removeItem(key: string): Promise<void> {
    await this.database.removeItem(key)
  }

  /**
   * Delete all items
   */
  public async $reset(): Promise<void> {
    await this.database.clear()
  }
}
