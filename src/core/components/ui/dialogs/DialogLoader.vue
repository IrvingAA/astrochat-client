<script setup lang="ts">
import useDialogLoaderStore from '@/core/stores/components/ui/dialogs/useDialogLoaderStore';
const store = useDialogLoaderStore();
</script>

<template>
  <q-dialog v-model="store.showFlagLoader" persistent style="z-index: 7 !important" no-focus>
    <q-card>
      <q-card-section
        class="tw-m-0 tw-p-10 tw-bg-primary tw-flex tw-flex-col tw-items-center tw-justify-center"
      >
        <div class="tw-text-center">
          <span class="tw-text-2xl tw-text-white line-clamp-3">{{ store.label }}</span>
        </div>
        <q-spinner-dots color="white" size="50" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
