import type FormsEnum from '@/enums/FormsEnum';
import Database from '@/databases/Database';

export default class FormsDatabase extends Database {
  /**
   * Contructor de la clase
   */
  constructor() {
    super('forms');
  }

  /**
   * Metodo para guardar un Formulario
   */
  public saveForm = async (formName: keyof typeof FormsEnum, form: any): Promise<void> => {
    await this.$setItem(formName, form);
  };

  /**
   * Metodo para obtener un Formulario
   */
  public getForm = async (formName: keyof typeof FormsEnum): Promise<any> => {
    const form = await this.$getItem(formName);
    if (!form) return {};

    return form;
  };
}
