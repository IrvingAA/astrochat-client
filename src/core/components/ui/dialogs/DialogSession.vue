<script setup lang="ts">
import useEnv from '@/core/composables/useEnv';
import useUtils from '@/core/composables/useUtils';
import useDialogSessionStore from '@/core/stores/components/ui/dialogs/useDialogSessionStore';
import { onMounted, watch } from 'vue';

/**
 * Imported
 */
const env = useEnv();
const store = useDialogSessionStore();
const utils = useUtils();

/**
 * Data
 */
const publicPath =
  env.PUBLIC_PATH && env.PUBLIC_PATH.startsWith('/') ? env.PUBLIC_PATH : `/${env.PUBLIC_PATH}`;
const audioPath = utils.cleanSlashes(`${publicPath}/audio/audio-sesion-por-expirar.mp3`);
const audio = new Audio(audioPath);

/**
 * On mounted
 */
onMounted(async () => {
  await store.loadDateTimeExpire();
});

/**
 * Watch para reproducir audio
 */
watch(
  () => store.isShowed,
  async (isShowed) => {
    if (!isShowed) {
      //stop audio
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    audio.play();
  }
);
</script>

<template>
  <template v-if="store.dateTimeExpire">
    <q-dialog v-model="store.isShowed" persistent>
      <q-card style="width: 100%; max-width: 14cm">
        <q-card-section class="tw-flex" style="background-color: #ededed">
          <q-icon color="info" name="mdi-clock-alert-outline" size="2rem" left />
          <span class="tw-text-2xl"> ¿Deseas extender tu sesión? </span>
        </q-card-section>

        <q-card-section class="tw-pt-4" style="font-size: 1rem">
          <p class="tw-text-justify">
            Queda poco tiempo para que tu sesión expire, si no la renuevas, se cerrará
            automáticamente y perderás los cambios no guardados.

            <br /><br />

            <span>
              Tiempo restante de la sesión: <strong>{{ store.timeLeftString }} hrs.</strong>
            </span>

            <br /><br />

            <strong class="tw-text-negative tw-text-sm tw-italic">
              Si no contestas en {{ store.secondsToShowLeft }}
              {{ store.secondsToShowLeft === 1 ? 'segundo' : 'segundos' }}, tu sesión se cerrará
              automáticamente.
            </strong>
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            no-caps
            ref="okBtnAlert"
            label="Extender"
            color="blue-14"
            @click="store.accept()"
          />
          <q-btn
            no-caps
            ref="cancelBtnAlert"
            flat
            label="Ignorar"
            color="negative"
            @click="store.cancel()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>
</template>
