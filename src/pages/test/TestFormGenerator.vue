<script setup lang="ts">
import FormsGeneratorTS from '@/core/components/generators/FormsGeneratorTS.vue';
import useTestForm from '@/generators/forms/test/testForm';
import {useRouter} from 'vue-router';
import HeaderComponent from '@/core/components/ui/HeaderComponent.vue';

const testForm = useTestForm();
const { push } = useRouter()



</script>
<template>
  <q-card>
    <HeaderComponent label="Test Form"  >
      <template #buttons>
        <q-btn flat to="/test" icon="mdi-arrow-left">
          {{ !$q.screen.lt.md ? "Regresar" : "Reg." }}
        </q-btn>
      </template>
    </HeaderComponent>
    <q-card-section>
      <FormsGeneratorTS v-model="testForm.formGeneratorModel" class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-3 tw-pt-3" />
    </q-card-section>
    <div class="btn-container">
      <q-btn fab-mini dense size="sm" icon="mdi-close" color="negative" :to="{ path: '/users' }" class="q-mr-sm">
        <q-tooltip anchor="top middle" self="center middle">
          Cancelar
        </q-tooltip>
      </q-btn>
      <q-btn fab-mini size="sm" icon="mdi-content-save" color="primary" type="sumbit">
        <q-tooltip anchor="top middle" self="center middle">
          Guardar
        </q-tooltip>
      </q-btn>
    </div>
  </q-card>
</template>
