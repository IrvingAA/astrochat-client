<script setup lang="ts">
import useUtils from '@/core/composables/useUtils';
import AuthService from '@/core/services/AuthService'
import useDialogConfirmStore from '@/core/stores/components/ui/dialogs/useDialogConfirmStore'
import useDialogLoaderStore from '@/core/stores/components/ui/dialogs/useDialogLoaderStore';
import useAuthStore from '@/core/stores/config/useAuthStore'
import { useRouter } from 'vue-router';

const authService = new AuthService()
const { triggerDialogConfirm } = useDialogConfirmStore()
const authStore = useAuthStore()
const { catchError } = useUtils()
const { enableDialogLoader, disableDialogLoader } = useDialogLoaderStore()
const router = useRouter()

const logoutHandler = async (): Promise<void> => {
  const resConfirm = await triggerDialogConfirm('Se cerrará tu sesión')
  if (!resConfirm) return

  enableDialogLoader()
  try {
    await authService.logout();
    await router.replace({ name: 'auth.login' })
  } catch (error: any) {
    catchError(error)
  }
  disableDialogLoader()
}
</script>

<template>
  <q-avatar size="50px" class="tw-cursor-pointer" icon="mdi-account-circle">
    <q-menu class="tw-font-bold">
      <q-list dense>
        <q-item header>
          <q-item-section>
            <q-item-label caption class="tw-font-semibold tw-text-sm tw-py-2">
              {{ `${authStore.user?.full_name}` }}
            </q-item-label>
            <q-separator />
            <q-item-label style="font-size: 8pt;"  caption class="tw-font-semibold tw-text-xs">
              <small class="tw-font-light block">Usuario:</small>
              {{ `${authStore.user?.username}` }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup @click="logoutHandler">
          <q-item-section class="tw-text-info tw-text-sm">
            Cerrar Sesión
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-avatar>
</template>
