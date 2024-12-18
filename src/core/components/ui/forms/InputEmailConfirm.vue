<script setup lang="ts">
import InputEmail from '@/core/components/ui/forms/InputEmail.vue';
import type { InputEmailConfirmIC } from '@/core/types/components/ui/FormsInterface';
import type { ValidationRule } from 'quasar';
import { computed, watch } from 'vue';

/**
 * Props
 */
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] });
const modelEmail = defineModel<string | null>('modelEmail');
const props = withDefaults(defineProps<InputEmailConfirmIC>(), {
  label: 'Confirmar correo',
  required: false,
  dontCleanErrorMessagesOnChange: false
});

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: InputEmailConfirmIC['modelValue']): void;
  (e: 'update:errorMessages', value: InputEmailConfirmIC['errorMessages']): void;
}>();

/**
 * Model
 */
const model = computed({
  get() {
    return props.modelValue;
  },
  async set(value) {
    emits('update:modelValue', value);
    if (props.onChange) await props.onChange(value);
  }
});

/**
 * Watchers
 */
watch([model, modelEmail], (val) => {
  if (!props.dontCleanErrorMessagesOnChange) {
    emits('update:errorMessages', []);
  }

  if (val[0] !== val[1]) {
    emits('update:errorMessages', ['Los correos no coinciden']);
  }
});

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
  <InputEmail
    :="newProps"
    v-model="model"
    :rules="rules"
    @update:model-value="emits('update:modelValue', $event)"
    @update:error-messages="emits('update:errorMessages', $event)"
    dont-clean-error-messages-on-change
  />
</template>
