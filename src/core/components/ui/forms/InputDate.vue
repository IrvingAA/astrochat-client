<script setup lang="ts">
import useFormRules from '@/core/composables/useFormRules';
import type { InputDateIC } from '@/core/types/components/ui/FormsInterface';
import type { ValidationRule } from 'quasar';
import { computed } from 'vue';
import HelpTooltip from '@/core/components/ui/HelpTooltip.vue';

/**
 * Props
 */
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] });
const props = withDefaults(defineProps<InputDateIC>(), {
  label: 'Date',
  required: false,
  dontCleanErrorMessagesOnChange: false
});

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: InputDateIC['modelValue']): void;
  (e: 'update:errorMessages', value: InputDateIC['errorMessages']): void;
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
const hasError = computed<boolean>(() => Boolean(props.errorMessages?.length));
const errorMessage = computed<string>(() => props.errorMessages?.[0] ?? '');
const classRequiredLabel = computed<string>(() => (props.required ? 'input-required' : ''));

/**
 * Rules
 */
const { required, date } = useFormRules();
if (props.required) rules.value.push(required);
rules.value.push(date);

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
  <q-input
    :="newProps"
    type="date"
    v-model="model"
    :error="hasError"
    :error-message="errorMessage"
    :rules="rules"
    :title="props.label"
    outlined
    lazy-rules
  >
    <template #prepend>
      <HelpTooltip :show="Boolean(props.help)">
        {{ props.help }}
      </HelpTooltip>
    </template>

    <template #label>
      <div>
        <span :class="`${classRequiredLabel} tw-text-sm`">
          {{ props.label }}
        </span>
      </div>
    </template>
  </q-input>
</template>
