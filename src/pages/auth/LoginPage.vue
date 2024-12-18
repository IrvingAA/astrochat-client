<script setup lang="ts">
import AuthService from '@/core/services/AuthService';
import useDialogLoaderStore from '@/core/stores/components/ui/dialogs/useDialogLoaderStore';
import { useRouter } from 'vue-router';
import useUtils from '@/core/composables/useUtils';
import LoginForm from '@/generators/forms/auth/LoginForm';
import RegisterForm from '@/generators/forms/auth/RegisterForm';
import FormsGeneratorTS from '@/core/components/generators/FormsGeneratorTS.vue';
import useFormsStore from '@/core/stores/config/useFormsStore';
import { ref } from 'vue';
import type { LoginPayloadIC } from '@/core/types/api/AuthApiInterface';
import type { RegisterPayloadIC } from '@/core/types/api/AuthApiInterface';

/**
 * Imported
 */
const loginFormGenerator = LoginForm();
const registerFormGenerator = RegisterForm();
const router = useRouter();
const authService = new AuthService();
const dialogLoaderStore = useDialogLoaderStore();
const utils = useUtils();
const formsStore = useFormsStore();
const isRegisterModalOpen = ref(false);

/**
 * Reactive data
 */
const loginForm = formsStore.getFormInOriginalFormat<LoginPayloadIC>('Auth_Login');
const registerForm = formsStore.getFormInOriginalFormat<RegisterPayloadIC>('Auth_Register');

/**
 * Login handler
 */
const loginHandler = async (): Promise<void> => {
  dialogLoaderStore.enableDialogLoader();

  try {
    loginFormGenerator.clearFormErrors();
    await authService.login(loginForm.value);
    await router.push({ name: 'dashboard.index' });
  } catch (error: any) {
    await utils.catchError(error);
    loginFormGenerator.setFormErrors(error);
  }

  dialogLoaderStore.disableDialogLoader();
};

/**
 * Register handler
 */
const registerHandler = async (): Promise<void> => {
  dialogLoaderStore.enableDialogLoader();

  try {
    registerFormGenerator.clearFormErrors();
    await authService.register(registerForm.value);
    isRegisterModalOpen.value = false;
  } catch (error: any) {
    await utils.catchError(error);
    registerFormGenerator.setFormErrors(error);
  }

  dialogLoaderStore.disableDialogLoader();
};
</script>

<template>
  <!-- Login Form -->
  <q-form @submit="loginHandler" autocomplete="off">
    <FormsGeneratorTS
      v-model="loginFormGenerator.loginFG"
      class="tw-grid tw-grid-cols-1 tw-gap-y-1"
    />

    <div class="tw-flex tw-justify-between tw-mt-4">
      <q-btn
        flat
        no-caps
        label="Recuperar contraseña"
        class="tw-text-blue-700 hover:tw-text-blue-900 tw-font-medium tw-text-sm"
      />
      <q-btn
        flat
        no-caps
        label="Registrarse"
        @click="isRegisterModalOpen = true"
        class="tw-text-red-700 hover:tw-text-red-900 tw-font-medium tw-text-sm"
      />
    </div>

    <div class="tw-mt-4">
      <q-btn
        unelevated
        no-caps
        color="primary"
        label="Iniciar sesión"
        type="submit"
        class="tw-w-full tw-rounded-lg tw-font-medium tw-text-white tw-bg-blue-600 hover:tw-bg-blue-700"
      />
    </div>

    <div class="tw-mt-2">
      <q-btn
        unelevated
        no-caps
        color="dark"
        label="Entrar como invitado"
        class="tw-w-full tw-rounded-lg tw-font-medium tw-text-white tw-bg-gray-800 hover:tw-bg-gray-900"
      />
    </div>
  </q-form>

  <!-- Register Modal -->
  <q-dialog v-model="isRegisterModalOpen" persistent>
    <q-card class="tw-w-full sm:tw-w-96">
      <q-card-section class="bg-blue-600 text-white">
        <div class="text-h6">Registrarse</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="registerHandler" autocomplete="off">
          <FormsGeneratorTS
            v-model="registerFormGenerator.registerFG"
            class="tw-grid tw-grid-cols-1 tw-gap-y-1"
          />

          <div class="tw-mt-4 tw-flex tw-justify-end tw-gap-2">
            <q-btn flat label="Cancelar" color="negative" @click="isRegisterModalOpen = false" />
            <q-btn unelevated color="positive" label="Registrarse" type="submit" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
