<script setup lang="ts">
import useFormRules from '@/core/composables/useFormRules';
import type { InputNumberIC } from '@/core/types/components/ui/FormsInterface';
import type { ValidationRule } from 'quasar';
import { computed } from 'vue';
import HelpTooltip from '@/core/components/ui/HelpTooltip.vue';

/**
 * Props
 */
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] });
const props = withDefaults(defineProps<InputNumberIC>(), {
  label: 'Número',
  required: false,
  dontCleanErrorMessagesOnChange: false
});

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: InputNumberIC['modelValue']): void;
  (e: 'update:errorMessages', value: InputNumberIC['errorMessages']): void;
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
const { required } = useFormRules();
if (props.required) rules.value.push(required);

/**
 * Replace props
 */
// eslint-disable-next-line
const newProps = computed(() => {
  const modProps = { ...props };
  delete modProps.onChange;

  return modProps;
});

const deleteIfZero = async () => {
  //@ts-ignore
  if (model.value === 0) {
    model.value = ''; // Borrar el 0
  }
};
const setZeroIfNull = async () => {
  if (model.value === '') {
    //@ts-ignore
    model.value = 0; // Restablecer a 0 si está vacío
  }
};
</script>

<template>
  <q-input
    :="newProps"
    type="number"
    v-model="model"
    :error="hasError"
    :error-message="errorMessage"
    :rules="rules"
    :title="props.label"
    outlined
    lazy-rules
    @focus="deleteIfZero"
    @blur="setZeroIfNull"
  >
    <template #prepend>
      <q-icon name="mdi-numeric" />

      <template v-if="props.help">
        <span class="tw-ml-2">|</span>
      </template>

      <template v-if="props.help">
        <HelpTooltip :help="props.help" />
      </template>
    </template>

    <template #label>
      <div>
        <span :class="`${classRequiredLabel} tw-text-sm`">
          {{ props.label }}
        </span>
      </div>
    </template>

    <template #error>
      <span>{{ props.errorMessages?.[0] }}</span>
    </template>
  </q-input>
</template>
