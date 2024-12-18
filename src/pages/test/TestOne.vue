<script setup lang="ts">
import useUtils from '@/core/composables/useUtils';
import useDialogPdfStore from '@/core/stores/components/ui/dialogs/useDialogPdfStore';

  const pdfStore = useDialogPdfStore();
  const utils = useUtils();

  const showPdf = async () => {
    const file = await utils.getLocalFile('dummy.pdf', 'PDF');
    pdfStore.show(file)
  }
</script>

<template>
  <div>
    <h1>TestOne</h1>
  </div>

  <q-btn color="primary" label="PDF" @click="showPdf"/>
</template>
