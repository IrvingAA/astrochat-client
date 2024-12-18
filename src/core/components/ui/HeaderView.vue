<script lang="ts" setup>
import { useRouter } from 'vue-router';

type Props = {
  label: string;
  nameRoute: string;
};
const router = useRouter();
const props = withDefaults(defineProps<Props>(), {
  label: '',
  nameRoute: 'dashboard.index.'
});
</script>
<template>
  <div
    class="tw-grid tw-grid-cols-1 tw-gap-3 tw-text-center md:tw-text-left md:tw-flex md:tw-justify-between md:tw-items-center tw-pb-5"
  >
    <div class="tw-bg-secondary tw-rounded-r-xl md:tw-max-w-lg tw-w-full tw-p-3">
      <span class="tw-text-white tw-text-xl tw-font-bold">
        {{ props.label }}
      </span>
    </div>

    <q-btn
      color="secondary"
      no-caps
      icon="mdi-arrow-left"
      flat
      label="Regresar"
      class="tw-font-bold"
      size="4.5mm"
      @click="router.push({ name: props.nameRoute })"
    />
  </div>
</template>
