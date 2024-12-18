import useGenerators from '@/core/composables/useGenerators'
import FieldTypesEnum from '@/core/enums/FieldTypesEnum'
import type { LoginPayloadIC } from '@/core/types/api/AuthApiInterface'
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
 * Formulario de inicio de sesion
 */
export default function LoginForm() {
  /**
   * Formulario
   */
  const loginFG = generators.makeFormGeneratorModelV2<LoginPayloadIC>({
    formToUseName: 'Auth_Login',
    initialValues: {
      password: null,
      username: null
    },
    fields: [
      {
        label: 'Usuario',
        field_type: FieldTypesEnum.InputText,
        model: 'username',
        required: true,
        meta: {
          prependIcon: 'mdi-account-circle',
          'label-color': 'primary'
        }
      },
      {
        label: 'Contraseña',
        field_type: FieldTypesEnum.InputPassword,
        model: 'password',
        required: true,
        meta: {
          'label-color': 'primary'
        }
      }
    ]
  })


  /**
   * Metodo para setear los errores del formulario a partir de un CustomHandler
   */
  const setFormErrors = (error: Error): void => {
    formStore.setFormErrorsWithCH('Auth_Login', error)
  }

  /**
   * Metodo para limpiar los errores del formulario
   */
  const clearFormErrors = (): void => {
    formStore.resetFormErrors('Auth_Login')
  }

  return {
    setFormErrors,
    clearFormErrors,
    loginFG
  }
}
