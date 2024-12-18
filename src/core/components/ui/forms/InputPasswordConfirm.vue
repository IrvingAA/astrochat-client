<script setup lang="ts">
import InputPassword from './InputPassword.vue';
import type { InputPasswordConfirmIC } from '@/core/types/components/ui/FormsInterface';
import type { ValidationRule } from 'quasar';
import { computed, watch } from 'vue';

/**
 * Props
 */
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] });
const modelPassword = defineModel<string | null>('modelPassword');
const props = withDefaults(defineProps<InputPasswordConfirmIC>(), {
  label: 'Confirmar contraseña',
  required: false,
  dontCleanErrorMessagesOnChange: false
});

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: InputPasswordConfirmIC['modelValue']): void;
  (e: 'update:errorMessages', value: InputPasswordConfirmIC['errorMessages']): void;
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
watch([model, modelPassword], (val) => {
  if (!props.dontCleanErrorMessagesOnChange) {
    emits('update:errorMessages', []);
  }

  if (val[0] !== val[1]) {
    emits('update:errorMessages', ['Las contraseñas no coinciden']);
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
  <InputPassword
    :="newProps"
    v-model="model"
    :rules="rules"
    @update:model-value="emits('update:modelValue', $event)"
    @update:error-messages="emits('update:errorMessages', $event)"
    dont-clean-error-messages-on-change
  />
</template>
