import useGenerators from '@/core/composables/useGenerators'
import useFormsStore from '@/core/stores/config/useFormsStore'
import type {
  FormsPayload
} from '@/types/api/TestApiInterface';
import FieldTypesEnum from '@/core/enums/FieldTypesEnum';

const formsStore = useFormsStore()
const generator = useGenerators()

export default function PrisonForm() {
  formsStore.makeForm<FormsPayload>('test_form', {
    hash_id: null,
    name: null,
    email: null,
  })

  const formGeneratorModel = generator.makeFormGeneratorModel<FormsPayload>({
    formToUseName: 'test_form',
    fields: [
      {
        field_type: FieldTypesEnum.InputText,
        label: 'Nombre',
        model: 'name',
        required: true,
      },
      {
        field_type: FieldTypesEnum.InputEmail,
        label: 'Email',
        model: 'email',
        required: false,
      },
    ]
  })



  return {
    formGeneratorModel,
  }
}
