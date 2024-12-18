<script setup lang="ts">
import useDialogImageStore from '@/core/stores/components/ui/dialogs/useDialogImageStore';

/**
 * Imported
 */
const imageStore = useDialogImageStore();

/**
 * Types
 */
type Props = {
  icon?: string;
  label?: string;
  helpImages?: File[] | File | null;
};

/**
 * Props
 */
const props = withDefaults(defineProps<Props>(), {
  label: 'Title'
});
</script>

<template>
  <div class="card">
    <div class="tw-grid tw-gap-4 md:tw-flex md:tw-justify-between">
      <div class="tw-flex tw-items-center tw-justify-center">
        <template v-if="props.icon">
          <q-icon :name="props.icon" size="md" />
        </template>

        <span class="card-title">
          {{ props.label }}
        </span>
      </div>

      <div class="tw-text-right md:tw-mr-2">
        <slot name="buttons" />

        <template v-if="props.helpImages">
          <!-- @vue-ignore -->
          <q-btn
            class="md:tw-ml-2"
            flat
            dense
            icon="mdi-help"
            @click="imageStore.show(props.helpImages)"
          >
            <q-tooltip>Ayuda</q-tooltip>
          </q-btn>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  padding: 0.75rem;
  margin-bottom: 1rem;
  position: relative;
  border-radius: 0 10px 10px 0;
  background: linear-gradient(to bottom, #235b4e, #032612);
  color: white;
}

.card:after {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  width: 0;
  height: 0;
  border-width: 9px 0 0 20px;
  border-top-color: #235b4e;
}

.card-title {
  @apply tw-text-xl tw-font-sans tw-font-semibold tw-tracking-wide md:tw-ml-5 tw-select-none;
}
</style>
