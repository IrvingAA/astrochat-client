<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import RegisterForm from '@/generators/forms/auth/RegisterForm';
import FormsGeneratorTS from '@/core/components/generators/FormsGeneratorTS.vue';
import AuthService from '@/core/services/AuthService';
import useDialogLoaderStore from '@/core/stores/components/ui/dialogs/useDialogLoaderStore';
import useUtils from '@/core/composables/useUtils';

const router = useRouter();
const registerFormGenerator = RegisterForm();
const authService = new AuthService();
const dialogLoaderStore = useDialogLoaderStore();
const utils = useUtils();

const registerHandler = async (): Promise<void> => {
  dialogLoaderStore.enableDialogLoader();
  try {
    registerFormGenerator.clearFormErrors();
    await authService.register(registerFormGenerator.registerFG.value);
    await router.push({ name: 'login.index' });
  } catch (error: any) {
    await utils.catchError(error);
    registerFormGenerator.setFormErrors(error);
  }
  dialogLoaderStore.disableDialogLoader();
};
</script>

<template>
  <q-form @submit="registerHandler" autocomplete="off">
    <FormsGeneratorTS
      v-model="registerFormGenerator.registerFG"
      class="tw-grid tw-grid-cols-1 tw-gap-y-1"
    />

    <div class="tw-mt-4">
      <q-btn
        unelevated
        no-caps
        color="primary"
        label="Registrarse"
        type="submit"
        class="tw-w-full tw-rounded-lg tw-font-medium tw-text-white tw-bg-blue-600 hover:tw-bg-blue-700"
      />
    </div>

    <div class="tw-mt-2">
      <q-btn
        flat
        no-caps
        color="primary"
        label="Iniciar sesión"
        @click="router.push({ name: 'login.index' })"
        class="tw-w-full tw-rounded-lg tw-font-medium tw-text-blue-700 hover:tw-text-blue-900"
      />
    </div>
  </q-form>
</template>
