<script setup lang="ts">
import { ref } from 'vue';
import '@/assets/css/layouts/auth.css';
import { useQuasar } from 'quasar';
import LoginPage from '@/pages/auth/LoginPage.vue';

const $q = useQuasar();
const username = ref('');
const password = ref('');
const loading = ref(false);

const login = () => {
  loading.value = true;
  setTimeout(() => {
    $q.notify({
      type: 'positive',
      message: 'Login exitoso, bienvenido!'
    });
    loading.value = false;
  }, 1500);
};

const recoverPassword = () => {
  $q.notify({
    type: 'info',
    message: 'Recuperación de contraseña seleccionada.'
  });
};

const register = () => {
  $q.notify({
    type: 'info',
    message: 'Registro de usuario seleccionado.'
  });
};

const guestLogin = () => {
  $q.notify({
    type: 'positive',
    message: 'Entraste como invitado.'
  });
};
</script>

<template>
  <body>
    <div class="astrochat-container">
      <h1 class="astrochat-title">AstroChat</h1>

      <q-card class="astrochat-card tw-shadow-2xl tw-rounded-xl tw-bg-white">
        <q-card-section class="tw-text-center tw-py-5">
          <q-icon
            name="account_circle"
            size="xl"
            class="tw-text-indigo-600 tw-bg-blue-100 tw-rounded-full"
          />
          <div class="tw-text-lg tw-font-semibold tw-mt-3 tw-text-gray-800">Iniciar sesión</div>
        </q-card-section>

        <q-card-section>
          <LoginPage />
        </q-card-section>

        <q-card-section class="tw-text-center tw-text-gray-500 tw-text-xs tw-mt-4">
          © 2024 AstroChat. Todos los derechos reservados.
        </q-card-section>
      </q-card>
    </div>
  </body>
</template>

<style scoped>
.astrochat-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  animation: fadeIn 1.5s ease-out;
}

.astrochat-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #3b82f6, #93c5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  animation: slideIn 1.5s ease-out;
}

.astrochat-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  max-width: 400px;
  width: 100%;
}

.astrochat-link {
  font-size: 0.8rem;
  transition: color 0.3s ease;
  text-decoration: none;
}

.astrochat-link:hover {
  color: #1d4ed8;
}

.astrochat-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.astrochat-btn:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-2px);
}

.astrochat-guest-btn {
  background-color: #1e293b;
  color: #f1f5f9;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.astrochat-guest-btn:hover {
  background-color: #0f172a;
  transform: translateY(-2px);
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
