import useGenerators from '@/core/composables/useGenerators'
import FieldTypesEnum from '@/core/enums/FieldTypesEnum'
import useFormsStore from '@/core/stores/config/useFormsStore'

export type Room = {
  name: string | null
  description: string | null
  password: string | null
  isPrivate: boolean
}


const formStore = useFormsStore()
const generators = useGenerators()
export default function RoomsForms() {

  const loginFG = generators.makeFormGeneratorModelV2<Room>({
    formToUseName: 'Auth_Login',
    initialValues: {
      password: null,
      name: null,
      description: null
    },
    fields: [
      {
        label: 'Nombre',
        field_type: FieldTypesEnum.InputText,
        model: 'name',
        required: true,
        meta: {
          prependIcon: 'mdi-account-circle',
          'label-color': 'primary'
        }
      },
      {
        label: 'Descripción',
        field_type: FieldTypesEnum.InputText,
        model: 'password',
        required: true,
        meta: {
          'label-color': 'primary'
        }
      },
      {
        label: 'Es privado',
        field_type: FieldTypesEnum.ToggleButton,
        model: 'isPrivate',
      }
    ]
  })

  const setFormErrors = (error: Error): void => {
    formStore.setFormErrorsWithCH('Auth_Login', error)
  }

  const clearFormErrors = (): void => {
    formStore.resetFormErrors('Auth_Login')
  }

  return {
    setFormErrors,
    clearFormErrors,
    loginFG
  }
}
