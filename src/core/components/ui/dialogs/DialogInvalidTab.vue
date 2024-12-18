<script setup lang="ts">
import useEnv from '@/core/composables/useEnv'
import useTab from '@/core/composables/useTab'
import useAppStoreTemp from '@/core/stores/config/useAppStoreTemp'

/**
 * Import
 */
const appStoreTemp = useAppStoreTemp()
const env = useEnv()
const tab = useTab()

/**
 * Event listener for localStorage
 */
window.addEventListener('storage', async () => {
  await appStoreTemp.checkIfIsValidTab()
})
</script>

<template>
  <q-dialog v-model="appStoreTemp.isInvalidTab" persistent>
    <q-card>
      <q-card-section>
        <div class="tw-flex tw-items-center tw-justify-center tw-p-10">
          <div class="tw-grid tw-col-span-1">
            <div class="tw-text-center tw-mb-5">
              <div class="tw-mb-5">
                <div class="tw-mb-3">
                  <q-icon name="mdi-alert-circle" size="80px" color="negative" />
                </div>

                <strong class="tw-text-2xl tw-ml-3">¡Atención!</strong>
              </div>

              <p>
                <b>{{ env.APP_NAME }}</b> está abierto en otra ventana. Haz clic en "Usar aquí" para
                abrir <b>{{ env.APP_NAME }}</b>
                en esta ventana.
              </p>
            </div>

            <div class="tw-flex tw-justify-end">
              <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-2">
                <q-btn color="negative" no-caps @click="tab.closeWindow()">
                  <span>Cerrar</span>
                </q-btn>

                <q-btn color="blue" no-caps @click="tab.reloadWindow()">
                  <span>Usar aquí</span>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
