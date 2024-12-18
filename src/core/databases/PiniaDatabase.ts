import Database from '@/databases/Database';

export default class PiniaDatabase extends Database {
  /**
   * Contructor de la clase
   */
  constructor() {
    super('pinia');
  }
}
