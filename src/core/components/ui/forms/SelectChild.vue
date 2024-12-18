<script setup lang="ts">
import type { SelectChildIC } from '@/core/types/components/ui/FormsInterface';
import type { ValidationRule } from 'quasar';
import { computed } from 'vue';
import Select from './SelectComponent.vue';
import { watch } from 'vue';

/**
 * Props
 */
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] });
const props = withDefaults(defineProps<SelectChildIC>(), {
  label: 'Select Catalog',
  required: false,
  dontCleanErrorMessagesOnChange: false
});

const modelFather = computed(() => props.modelFather);
const metaFather = computed(() => props.metaFather);

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: SelectChildIC['modelValue']): void;
  (e: 'update:errorMessages', value: SelectChildIC['errorMessages']): void;
}>();

/**
 * Cuando cambia el valor del padre
 */
watch(modelFather, () => {
  model.value = null;
});

/**
 * Model
 */
const model = computed({
  get() {
    return props.modelValue;
  },
  async set(value) {
    if (!props.dontCleanErrorMessagesOnChange) {
      emits('update:errorMessages', []);
    }

    emits('update:modelValue', value);
    if (props.onChange) await props.onChange(value);
  }
});

/**
 * Others
 */
const childOptions = computed(() => props.options);
const options = computed(() => {
  if (modelFather.value === null) {
    return [];
  }

  if (Array.isArray(modelFather.value)) {
    return childOptions.value.filter((item) => {
      // @ts-ignore
      if (!item.meta[metaFather.value] ||!modelFather.value.includes(item.meta[metaFather.value])) {
        return false;
      }

      return true;
    });
  }

  return childOptions.value.filter((item) => {
    // @ts-ignore
    if (
      !item.meta ||
      !item.meta[metaFather.value] ||
      item.meta[metaFather.value] !== modelFather.value
    ) {
      return false;
    }

    return true;
  });
});

/**
 * Replace props
 */
// eslint-disable-next-line
const newProps = computed(() => {
  const modProps = { ...props };
  delete modProps.onChange;

  // @ts-ignore
  delete modProps.metaFather;

  // @ts-ignore
  delete modProps.modelFather;

  return modProps;
});
</script>

<template>
  <Select
    :="newProps"
    v-model="model"
    :rules="rules"
    :error-messages="props.errorMessages"
    @update:error-messages="emits('update:errorMessages', $event)"
    :options="options"
    dont-clean-error-messages-on-change
  />
</template>
