import useGenerators from '@/core/composables/useGenerators';
import FieldTypesEnum from '@/core/enums/FieldTypesEnum';

/**
 * Type for test form
 */
export type FormTest = {
  name: string | null;
  secondName: string | null;
  birthDay: string | null;
}

/**
 * FormsList Test
 */
export default function TestFormList() {
  /**
   * Import
   */
  const generators = useGenerators()

  /**
   * Make Form
   */
  const formModel = generators.makeFormGeneratorModelV2<FormTest>({
    formToUseName: 'test_form_list',
    initialValues: {
      name: null,
      secondName: null,
      birthDay: null
    },
    fields: [
      {
        model: 'name',
        label: 'Nombre',
        field_type: FieldTypesEnum.InputText,
        required: true,
      },
      {
        model: 'secondName',
        label: 'Apellido',
        field_type: FieldTypesEnum.InputText,
        required: true,
      },
      {
        model: 'birthDay',
        label: 'Fecha de nacimiento',
        field_type: FieldTypesEnum.InputDate,
        required: true
      }
    ]
  })

  /**
   * Make FormList
   */
  const formListModel = generators.makeFormListModel({
    FGModel: formModel,
    icon: 'mdi-account',
    title: 'Personas',
    classFG: 'tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4',
    columns: [
      {
        field: 'name',
        label: 'Nombre',
      },
      {
        field: 'secondName',
        label: 'Apellido',
      },
      {
        field: 'birthDay',
        label: 'Fecha de nacimiento'
      }
    ]
  })

  return {
    formListModel
  };
}
