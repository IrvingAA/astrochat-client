<script setup lang="ts">
import useUtils from '@/core/composables/useUtils';
import useDialogImageStore from '@/core/stores/components/ui/dialogs/useDialogImageStore';
import { computed } from 'vue';

/**
 * Imported
 */
const store = useDialogImageStore();
const utils = useUtils();

/**
 * Data
 */
const imageURI = computed<string | null>(() => {
  if (!store.currentImage) return null;
  return URL.createObjectURL(store.currentImage);
});

/**
 * Download blob
 */
const download = () => {
  if (!store.currentImage) return;
  utils.downloadFile(store.currentImage);
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
          <template v-if="store.images.length > 1">
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

          <div class="tw-flex tw-gap-3">
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
          <template v-if="imageURI">
            <img :src="imageURI" fit="contain" class="tw-object-contain" />
          </template>

          <template v-else>
            <div class="tw-flex tw-items-center tw-justify-center tw-text-2xl tw-text-white">
              <q-icon name="mdi-image-off" size="1.5cm" />
            </div>
          </template>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
