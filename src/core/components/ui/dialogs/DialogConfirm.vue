<script setup lang="ts">
import useDialogConfirmStore from '@/core/stores/components/ui/dialogs/useDialogConfirmStore';

const store = useDialogConfirmStore();
</script>

<template>
  <q-dialog v-model="store.showFlagConfirm" persistent>
    <q-card style="width: 100%; max-width: 10cm">
      <q-card-section class="tw-flex" style="background-color: #ededed">
        <q-icon color="info" name="mdi-help-circle" size="2rem" left />
        <span class="tw-text-2xl">¿Deseas continuar?</span>
      </q-card-section>

      <q-card-section class="tw-pt-4" style="font-size: 1rem">
        <p class="tw-text-justify">
          {{ store.textConfirm }}
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          no-caps
          flat
          color="negative"
          label="Cancelar"
          @click="store.resolveConfirm(false)"
        />
        <q-btn no-caps color="positive" label="Aceptar" @click="store.resolveConfirm(true)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
