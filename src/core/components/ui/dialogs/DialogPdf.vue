<script setup lang="ts">
import useUtils from '@/core/composables/useUtils';
import useDialogPdfStore from '@/core/stores/components/ui/dialogs/useDialogPdfStore';
import { computed } from 'vue';

/**
 * Imported
 */
const store = useDialogPdfStore();
const utils = useUtils();

/**
 * PDF URI
 */
const pdfURI = computed<string | null>(() => {
  if (!store.currentPdf) return null;
  return URL.createObjectURL(store.currentPdf);
});

/**
 * Download blob
 */
const download = () => {
  if (!store.currentPdf) return;
  utils.downloadFile(store.currentPdf);
};
</script>

<template>
  <q-dialog
    v-model="store.showFlag"
    full-width
    transition-show="fade"
    transition-hide="fade"
    persistent
  >
    <q-card class="tw-bg-bluegrey">
      <q-card-section>
        <div class="tw-flex tw-justify-between tw-mb-2">
          <template v-if="store.pdfs.length > 1">
            <div class="tw-flex tw-gap-3">
              <q-btn
                no-caps
                color="primary"
                icon="mdi-arrow-left"
                class="tw-rounded-md"
                @click="store.previous()"
                :disable="!store.hasPrevious"
              />
              <q-btn
                no-caps
                color="primary"
                icon="mdi-arrow-right"
                class="tw-rounded-md"
                @click="store.next()"
                :disable="!store.hasNext"
              />
            </div>
          </template>

          <template v-else>
            <div />
          </template>

          <div class="tw-flex tw-items-center tw-gap-3">
            <div class="tw-flex tw-flex-grow tw-items-center tw-px-3">
              <p class="tw-text-black tw-text-sm tw-font-bold">
                Para visualizar documentos, presione la tecla Ctrl y haga Clic en el nombre del
                documento
                <q-item-label caption class="tw-text-xs tw-text-grey-8">
                  Por motivos de seguridad, el enlace asociado al documento tendrá una vigencia de 5
                  visualizaciones. Pasado este tiempo, deberá generar nuevamente la Cédula Única
                </q-item-label>
              </p>
            </div>
            <q-btn no-caps color="teal" icon="mdi-download" round @click="download" />
            <q-btn
              no-caps
              color="negative"
              icon="mdi-close"
              label="Cerrar"
              class="tw-rounded-md"
              @click="store.hide()"
            />
          </div>
        </div>

        <div class="tw-flex tw-justify-center tw-bg-dark-page" style="height: 79vh">
          <template v-if="pdfURI">
            <q-pdfviewer type="html5" :src="pdfURI" />
          </template>

          <template v-else>
            <div class="tw-flex tw-items-center tw-justify-center tw-text-2xl tw-text-white">
              <q-icon name="file-pdf-box" size="1.5cm" />
            </div>
          </template>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
