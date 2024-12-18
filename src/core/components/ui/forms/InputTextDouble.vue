<script setup lang="ts">
import type { InputTextDouble } from '@/core/types/components/ui/FormsInterface';
import type { ValidationRule } from 'quasar';
import InputText from './InputText.vue';
import { computed, ref } from 'vue';
import { watch } from 'vue';

/**
 * Props
 */
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] });
const props = withDefaults(defineProps<InputTextDouble>(), {
  label: 'Text',
  required: false,
  dontCleanErrorMessagesOnChange: false
});

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: InputTextDouble['modelValue']): void;
  (e: 'update:errorMessages', value: InputTextDouble['errorMessages']): void;
}>();

/**
 * Model dual
 */
const modelDual = ref<InputTextDouble['modelValue']>({
  a: null,
  b: null
});

/**
 * Model
 */
const model = computed<InputTextDouble['modelValue']>({
  get() {
    if (!props.modelValue) {
      return {
        a: null,
        b: null
      };
    }

    return props.modelValue;
  },
  async set(value) {
    if (!value) {
      value = {
        a: null,
        b: null
      };
    }

    if (!props.dontCleanErrorMessagesOnChange) {
      emits('update:errorMessages', []);
    }

    emits('update:modelValue', value);
    if (props.onChange) await props.onChange(value);
  }
});

watch(
  modelDual,
  (value) => {
    model.value = value;
  },
  { deep: true }
);

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
  <q-card>
    <q-card-section>
      {{ props.label }}
    </q-card-section>

    <q-card-section>
      <InputText
        :="newProps"
        v-model="modelDual.a"
        :label="props.label + '-A'"
        :rules="rules"
        dont-clean-error-messages-on-change
        @update:error-messages="emits('update:errorMessages', $event)"
      />

      <InputText
        :="newProps"
        v-model="modelDual.b"
        :label="props.label + '-B'"
        :rules="rules"
        dont-clean-error-messages-on-change
        @update:error-messages="emits('update:errorMessages', $event)"
      />
    </q-card-section>
  </q-card>
</template>
