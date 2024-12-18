<script setup lang="ts">
import FormsListGeneratorTS from '@/core/components/generators/FormsListGeneratorTS.vue';
import useDialogAlertStore from '@/core/stores/components/ui/dialogs/useDialogAlertStore';
import useFormsListsStore from '@/core/stores/config/useFormsListsStore';
import TestFormList, { type FormTest } from '@/generators/formslist/TestFormList';
import { useRouter } from 'vue-router';

/**
 * Import
 */
const fl = TestFormList();
const formListStore = useFormsListsStore();
const alertStore = useDialogAlertStore();
const router = useRouter();

/**
 * Enviar informacion
 */
const send = async () => {
  const formList = await formListStore.getFormListInOriginalFormat<FormTest>('test_form_list');
  console.log({
    form: formList
  });

  await alertStore.triggerDialogAlert(
    'positive',
    'Enviado',
    'Se ha impreso la informacion en la consola.'
  );
};
</script>

<template>
  <div class="tw-flex tw-items-center">
    <q-btn
      icon="mdi-arrow-left"
      color="primary"
      round
      class="tw-mr-3"
      @click="router.push({ name: 'test.index' })"
    />
    <span class="tw-text-2xl tw-font-bold"> Test de FormList Generator </span>
  </div>

  <hr class="tw-my-4" />

  <FormsListGeneratorTS v-model="fl.formListModel" />

  <div class="tw-flex tw-justify-end tw-mt-4">
    <q-btn label="Enviar" color="primary" icon="mdi-check" @click="send()" />
  </div>
</template>
