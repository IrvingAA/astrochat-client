<script setup lang="ts">
import type { SelectCatalogChildIC } from '@/core/types/components/ui/FormsInterface';
import useCatalogStore from '@/core/stores/config/useCatalogsStore';
import type { ValidationRule } from 'quasar';
import { computed } from 'vue';
import SelectChild from './SelectChild.vue';

/**
 * Imported
 */
const { getCatalog } = useCatalogStore();

/**
 * Props
 */
const modelFather = defineModel<SelectCatalogChildIC['modelFather']>('modelFather');
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] });
const props = withDefaults(defineProps<SelectCatalogChildIC>(), {
  label: 'Select Catalog',
  required: false,
  dontCleanErrorMessagesOnChange: false,
  metaHelp: 'description'
});

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: SelectCatalogChildIC['modelValue']): void;
  (e: 'update:errorMessages', value: SelectCatalogChildIC['errorMessages']): void;
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
 * Computed
 */
const options = getCatalog(props.catalogEnum);

/**
 * Replace props
 */
// eslint-disable-next-line
const newProps = computed(() => {
  const modProps = { ...props };

  delete modProps.onChange;
  // @ts-ignore
  delete modProps.modelFather;

  return modProps;
});
</script>

<template>
  <!-- @vue-ignore -->
  <SelectChild
    :="newProps"
    v-model="model"
    :model-father="modelFather"
    :rules="rules"
    :error-messages="props.errorMessages"
    @update:error-messages="emits('update:errorMessages', $event)"
    :options="options"
    dont-clean-error-messages-on-change
  />
</template>
