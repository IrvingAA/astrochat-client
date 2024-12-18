<script setup lang="ts">
import useDialogAlertStore from '@/core/stores/components/ui/dialogs/useDialogAlertStore';
import { useFocus } from '@vueuse/core';
import { ref } from 'vue';

const store = useDialogAlertStore();
const okBtnAlert = ref(null);
useFocus(okBtnAlert, {
  initialValue: true
});
</script>

<template>
  <q-dialog v-model="store.showFlagAlert" persistent>
    <q-card style="width: 100%; max-width: 10cm">
      <q-card-section :class="store.styleAlert">
        <q-icon color="white" :name="store.iconAlert" size="2rem" left />
        <span class="tw-text-2xl text-white">{{ store.titleAlert }}</span>
      </q-card-section>

      <q-card-section class="tw-pt-4" style="font-size: 1rem">
        <p class="tw-text-center tw-text-black" v-html="store.textAlert"></p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          no-caps
          ref="okBtnAlert"
          flat
          label="OK"
          color="info"
          @click="store.resolveAlert()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
