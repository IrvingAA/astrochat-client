import useGenerators from '@/core/composables/useGenerators'
import FieldTypesEnum from '@/core/enums/FieldTypesEnum'
import type { RegisterPayloadIC } from '@/core/types/api/AuthApiInterface'
import useFormsStore from '@/core/stores/config/useFormsStore'

/**
 * useFormsStore
 */
const formStore = useFormsStore()

/**
 * Form Generator
 */
const generators = useGenerators()

/**
 * Formulario de registro de usuario
 */
export default function RegisterForm() {
  /**
   * Formulario
   */
  const registerFG = generators.makeFormGeneratorModelV2<RegisterPayloadIC>({
    formToUseName: 'Auth_Register',
    initialValues: {
      username: null,
      name: null,
      lastName: null,
      password: null,
      email: null
    },
    fields: [
      {
        label: 'Nombre de Usuario',
        field_type: FieldTypesEnum.InputText,
        model: 'username',
        required: true,
        meta: {
          prependIcon: 'mdi-account-circle',
          'label-color': 'primary'
        }
      },
      {
        label: 'Nombre',
        field_type: FieldTypesEnum.InputText,
        model: 'name',
        required: true,
        meta: {
          prependIcon: 'mdi-card-account-details',
          'label-color': 'primary'
        }
      },
      {
        label: 'Apellido',
        field_type: FieldTypesEnum.InputText,
        model: 'lastName',
        required: true,
        meta: {
          prependIcon: 'mdi-card-account-details-outline',
          'label-color': 'primary'
        }
      },
      {
        label: 'Correo Electrónico',
        field_type: FieldTypesEnum.InputEmail,
        model: 'email',
        required: true,
        meta: {
          prependIcon: 'mdi-email',
          'label-color': 'primary'
        }
      },
      {
        label: 'Contraseña',
        field_type: FieldTypesEnum.InputPassword,
        model: 'password',
        required: true,
        meta: {
          prependIcon: 'mdi-lock',
          'label-color': 'primary'
        }
      }
    ]
  })

  /**
   * Metodo para setear los errores del formulario a partir de un CustomHandler
   */
  const setFormErrors = (error: Error): void => {
    formStore.setFormErrorsWithCH('Auth_Register', error)
  }

  /**
   * Metodo para limpiar los errores del formulario
   */
  const clearFormErrors = (): void => {
    formStore.resetFormErrors('Auth_Register')
  }

  return {
    setFormErrors,
    clearFormErrors,
    registerFG
  }
}
