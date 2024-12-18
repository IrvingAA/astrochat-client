<script setup lang="ts">
type cardIC = {
  label: string | null;
  color: string | null;
  textColor: string | null;
};
/**
 * Props
 */
const props = withDefaults(defineProps<cardIC>(), {
  label: 'Texto',
  color: '#235B4E',
  textColor: '#ffffff'
});
</script>

<template>
  <q-card flat :style="'background-color:' + props.color + ';'">
    <q-card-section :style="'color:' + props.textColor + ';'">
      {{ props.label }}
    </q-card-section>
  </q-card>
</template>
