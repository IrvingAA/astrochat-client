<script setup lang="ts">
import { useSlots, computed, ref } from 'vue';

/**
 * Props type
 */
type Props = {
  show: boolean;
};

/**
 * Props
 */
const props = withDefaults(defineProps<Props>(), {
  show: true
});

/**
 * Slots
 */
const slots = useSlots();
const defaultSlot = computed<string | null>(() => {
  const slot = slots.default ? slots.default() : undefined;
  if (!slot) return null;
  if (!slot[0]) return null;
  if (!slot[0].children) return null;

  return slot[0].children as string;
});

/**
 * Model for popup
 */
const isShowing = ref<boolean>(false);
</script>

<template>
  <template v-if="props.show">
    <q-icon
      name="mdi-help-circle"
      class="tw-text-blue tw-ml-2 tw-cursor-help"
      size="6mm"
      @mouseover="isShowing = true"
    >
      <q-popup-proxy
        v-model="isShowing"
        no-parent-event
        style="width: 14cm; height: auto"
        @mouseleave="isShowing = false"
        class="tw-drop-shadow-2xl tw-rounded-md"
      >
        <div class="tw-sticky tw-top-0">
          <div class="tw-p-4 tw-flex tw-justify-between tw-bg-dark tw-text-white">
            <div class="tw-text-2xl tw-flex tw-items-center">
              <q-icon
                name="mdi-help"
                class="tw-rounded-full tw-bg-blue tw-text-white tw-p-1 tw-mr-3"
              />
              <span class="tw-font-bold"> Ayuda </span>
            </div>

            <q-btn dense icon="mdi-close" @click="isShowing = false" color="negative">
              <q-tooltip>Cerrar</q-tooltip>
            </q-btn>
          </div>
        </div>

        <q-banner class="tw-bg-dark-page tw-text-white" style="max-height: 6cm; overflow-y: auto">
          <div class="tw-p-5 tw-text-justify tw-break-words">
            <span v-html="defaultSlot" style="font-size: 1rem" />
          </div>
        </q-banner>
      </q-popup-proxy>

      <!--
      <q-tooltip :offset="[10, 10]" style="font-size: 0.9rem; width: 15cm;">
        <div class="tw-text-justify">
          <span v-html="defaultSlot" />
        </div>
      </q-tooltip>
    -->
    </q-icon>
  </template>
</template>
