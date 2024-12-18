import FormsDatabase from '@/core/databases/FormsDatabase';
import FormsListDatabase from '@/core/databases/FormsListDatabase';
import PiniaDatabase from '@/core/databases/PiniaDatabase';

/**
 * GlobalFormsService
 */
export default class GlobalFormsService {
  /**
   * FormsDatabase instance
   */
  private formsDatabase: FormsDatabase;

  /**
   * FormlistDatabase Instance
   */
  private formListDatabase: FormsListDatabase;

  /**
   * PiniaDatabase instance
   */
  private piniaDatabase: PiniaDatabase;

  /**
   * Constructor de la clase
   */
  constructor() {
    this.formsDatabase = new FormsDatabase();
    this.formListDatabase = new FormsListDatabase();
    this.piniaDatabase = new PiniaDatabase();
  }

  /**
   * Metodo para cargar todos los forms
   */
  public loadForms = async (): Promise<void> => {
    const formsCore = await import.meta.glob('@/core/generators/forms/**/*.ts');
    const formsApp = await import.meta.glob('@/generators/forms/**/*.ts');
    const tablesFormsCore = await import.meta.glob('@/core/generators/tables/**/*.ts');
    const tablesFormsApp = await import.meta.glob('@/generators/tables/**/*.ts');
    const formsListCore = await import.meta.glob('@/core/generators/formsList/**/*.ts');
    const formsListApp = await import.meta.glob('@/generators/formsList/**/*.ts');

    const finalForms = {
      ...formsCore,
      ...formsApp,
      ...tablesFormsCore,
      ...tablesFormsApp,
      ...formsListCore,
      ...formsListApp,
    };

    Object.keys(finalForms).forEach(async (key) => {
      const form = finalForms[key];
      await form().then(async (form) => {
        try {
          // @ts-ignore
          const { default: exportDefault } = form;
          await exportDefault();
        } catch (error: any) {
          console.error(`El archivo ${key} no se puede cargar`, error);
        }
      });
    });
  };

  /**
   * Metodo para reiniciar todos los forms
   */
  public cleanForms = async (): Promise<void> => {
    await this.piniaDatabase.$removeItem('core.config.formsStore');
    await this.piniaDatabase.$removeItem('core.config.formsLists');
    await this.formsDatabase.$reset();
    await this.formListDatabase.$reset();
    await this.loadForms();
  };
}
