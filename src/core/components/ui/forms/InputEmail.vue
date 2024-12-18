<script setup lang="ts">
import useFormRules from '@/core/composables/useFormRules';
import type { InputEmailIC } from '@/core/types/components/ui/FormsInterface';
import type { ValidationRule } from 'quasar';
import { computed } from 'vue';
import HelpTooltip from '@/core/components/ui/HelpTooltip.vue';

/**
 * Props
 */
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] });
const props = withDefaults(defineProps<InputEmailIC>(), {
  label: 'Correo electrónico',
  required: false,
  dontCleanErrorMessagesOnChange: false
});

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: InputEmailIC['modelValue']): void;
  (e: 'update:errorMessages', value: InputEmailIC['errorMessages']): void;
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
const { required, email } = useFormRules();
if (props.required) rules.value.push(required);
rules.value.push(email);

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
    type="email"
    v-model="model"
    :error="hasError"
    :error-message="errorMessage"
    :rules="rules"
    :title="props.label"
    @copy.prevent
    @paste.prevent
    outlined
    lazy-rules
  >
    <template #prepend>
      <q-icon name="mdi-email" />

      <template v-if="props.help">
        <span class="tw-ml-2">|</span>
      </template>

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
