import type {
  FGModelV2IC,
  FormGeneratorTsVueIC
} from '@/core/types/components/generators/FormsGeneratorInterface';
import type { FormListModelIC } from '@/core/types/components/generators/FormsListGeneratorInterface';
import type { TGModelIC } from '@/core/types/components/generators/TablesGeneratorInterface';
import useFormsStore from '@/core/stores/config/useFormsStore';

/**
 * Composable para el formsGenerator
 */
export default function useGenerators() {
  /**
   * Metodo para crear un formGenerator model
   */
  const makeFormGeneratorModel = <T extends object>(
    formGenerator: FormGeneratorTsVueIC<T>
  ): FormGeneratorTsVueIC<T> => {
    formGenerator.fields.forEach((field) => {
      if (!field.hideOn) field.hideOn = () => false;
      if (!field.disableOn) field.disableOn = () => false;
    });

    return formGenerator;
  };

  /**
   * Metodo para crear un formGenerator model v2
   */
  const makeFormGeneratorModelV2 = <T extends object>(
    formGenerator: FGModelV2IC<T>
  ): FormGeneratorTsVueIC<T> => {
    const formsStore = useFormsStore();
    // @ts-ignore
    formsStore.makeForm<T>(formGenerator.formToUseName, formGenerator.initialValues);

    // @ts-ignore
    delete formGenerator.initialValues;
    return makeFormGeneratorModel(formGenerator);
  };

  /**
   * Metodo para crear un tableGenerator model
   */
  const makeTableGeneratorModel = <T>(tableGenerator: TGModelIC<T>): TGModelIC<T> => {
    /**
     * Añadir un column al principio de las columnas para mostrar el index + 1 de cada fila
     */
    tableGenerator.columns.unshift({
      name: 'index',
      label: '#',
      // @ts-ignore
      field: 'index',
      align: 'left',
      required: true
    });

    tableGenerator.columns.forEach((column) => {
      /**
       * Si no se especifica el nombre de la columna, se usará el field
       */
      if (!column.name && column.field) {
        column.name = column.field as string;
      }

      /**
       * Si no se especifica la alineación, se usará 'center'
       */
      if (!column.align) {
        column.align = 'center';
      }

      /**
       * Si no se especifica la propiedad 'sortable', se usará true
       */
      if (!column.sortable) {
        column.sortable = true;
      }
    });

    /**
     * Usar makeFormGeneratorModel en filtersFGModel
     */
    if (tableGenerator.filtersFGModel) {
      tableGenerator.filtersFGModel = makeFormGeneratorModel(tableGenerator.filtersFGModel);
    }

    return tableGenerator;
  };

  /**
   * Make FormList Model
   */
  const makeFormListModel = <T extends object>(
    formList: FormListModelIC<T>
  ): FormListModelIC<T> => {
    formList.columns.unshift({
      name: 'actions',
      label: 'Acciones',
      field: null,
      align: 'center',
      dontExport: true
    });

    if (formList.showTable === undefined) {
      formList.showTable = false;
    }

    return formList;
  };

  return {
    makeFormGeneratorModel,
    makeFormGeneratorModelV2,
    makeTableGeneratorModel,
    makeFormListModel
  };
}
