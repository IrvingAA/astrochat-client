import FilesDatabase from '@/core/databases/FilesDatabase';
import FormsListDatabase from '@/core/databases/FormsListDatabase';
import type { ContextIC } from '@/core/types/config/GlobalMiddlewareInterface';
//import GlobalFormsService from '@/services/GlobalFormsService';
import useAppStoreTemp from '@/core/stores/config/useAppStoreTemp';
import useFormsListsStore from '@/core/stores/config/useFormsListsStore';
import useFormsStore from '@/core/stores/config/useFormsStore';
import FormsUtils from '@/core/utils/FormsUtils';


export default async function LoadFormsMiddleware({ next }: ContextIC): Promise<any> {
  /**
   * Import
   */
  const appStoreTemp = useAppStoreTemp()

  /**
   * Verificar si ya se cargaron los formularios
   */
  if (appStoreTemp.formsLoaded) {
    return next()
  }

  //const globalFormsService = new GlobalFormsService()
  //await globalFormsService.loadForms()

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formStore = useFormsStore()
  const formsListStore = useFormsListsStore()

  const formListDatabase = new FormsListDatabase()
  await formListDatabase.$getItem('fake') //Para que se cargue el store

  const filesDatabase = new FilesDatabase()
  await filesDatabase.$getItem('fake') //Para que se cargue el store

  formsListStore.resetFormsShow()
  const utilsForms = FormsUtils()
  const forms = formStore.forms

  //@ts-ignore
  const keysForms = Object.keys(forms)

  // Crear una lista de promesas para cada formulario
  const formPromises = keysForms.map(async (form) => {
    // Obtener el formulario en formato original
    //@ts-ignore
    const newForm = await formStore.getFormInOriginalFormatAsync(form)

    // Realizar la transformación del formulario
    const lastForm = utilsForms.recursiveObjectKeysValues(newForm)

    // Asignar el formulario transformado al store
    //@ts-ignore
    formStore.forms[form] = lastForm
  })

  // Esperar a que todas las promesas se resuelvan
  await Promise.all(formPromises)

  // Marcar que los formularios ya se cargaron
  appStoreTemp.formsLoaded = true

  return next()
}
