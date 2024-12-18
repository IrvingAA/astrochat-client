<script setup lang="ts">
import type { SelectCatalogIC } from '@/core/types/components/ui/FormsInterface';
import useCatalogStore from '@/core/stores/config/useCatalogsStore';
import type { ValidationRule } from 'quasar';
import Select from './SelectComponent.vue';
import { computed } from 'vue';

/**
 * Imported
 */
const catalogStore = useCatalogStore();

/**
 * Props
 */
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] });
const props = withDefaults(defineProps<SelectCatalogIC>(), {
  label: 'Select Catalog',
  required: false,
  dontCleanErrorMessagesOnChange: false,
  metaHelp: 'description'
});

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: SelectCatalogIC['modelValue']): void;
  (e: 'update:errorMessages', value: SelectCatalogIC['errorMessages']): void;
}>();

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
const options = catalogStore.getCatalog(props.catalogEnum);

/**
 * Replace props
 */
// eslint-disable-next-line
const newProps = computed(() => {
  const modProps = { ...props };
  delete modProps.onChange;
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
