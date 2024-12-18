<script setup lang="ts">
//import useNewRequests from '@/composables/useNewRequests';
import AppService from '@/core/services/AppService';
import useDialogConfirmStore from '@/core/stores/components/ui/dialogs/useDialogConfirmStore';
import useDialogLoaderStore from '@/core/stores/components/ui/dialogs/useDialogLoaderStore';
import { useRouter } from 'vue-router';

/**
 * Imported
 */
//const newRequests = useNewRequests()
const appService = new AppService()
const loader = useDialogLoaderStore()
const confirm = useDialogConfirmStore()
const router = useRouter()

const handle = async () => {
  const res = await confirm.triggerDialogConfirm('Esta acción reiniciará la aplicación a un estado inicial. Todos los datos no guardados se perderán')
  if (!res) return

  loader.enableDialogLoader('Recargando Datos');

  await appService.resetWithoutAuth()
  await router.push({ name: 'dashboard.index' })

  loader.disableDialogLoader()
}
</script>

<template>
  <q-btn flat round icon="mdi-refresh" @click="handle()">
    <q-tooltip>
      Recargar Aplicación
    </q-tooltip>
  </q-btn>
</template>
