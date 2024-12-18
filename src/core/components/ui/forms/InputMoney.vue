<script setup lang="ts">
import useFormRules from '@/core/composables/useFormRules';
import type { InputMoneyIC } from '@/core/types/components/ui/FormsInterface';
import type { ValidationRule } from 'quasar';
import { computed, watch } from 'vue';
import { useCurrencyInput, CurrencyDisplay } from 'vue-currency-input';
import HelpTooltip from '@/core/components/ui/HelpTooltip.vue';

/**
 * Props
 */
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] });
const props = withDefaults(defineProps<InputMoneyIC>(), {
  label: 'Money',
  required: false,
  labelSlot: true,
  prependIcon: 'mdi-currency-usd',
  dontCleanErrorMessagesOnChange: false,
  currency: 'MXN',
  locale: 'es-MX',
  autoDecimalDigits: false
});

/**
 * Imported
 */
const { inputRef, formattedValue, numberValue, setValue } = useCurrencyInput(
  {
    currency: props.currency,
    locale: props.locale,
    currencyDisplay: CurrencyDisplay.hidden,
    autoDecimalDigits: props.autoDecimalDigits,
    precision: props.precision,
    hideGroupingSeparatorOnFocus: false
  },
  false
);

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: InputMoneyIC['modelValue']): void;
  (e: 'update:errorMessages', value: InputMoneyIC['errorMessages']): void;
}>();

/**
 * Watch
 */
watch(props, (val) => {
  setValue(val.modelValue);
});

/**
 * Watch
 */
watch(numberValue, async (val) => {
  if (!props.dontCleanErrorMessagesOnChange) {
    emits('update:errorMessages', []);
  }

  emits('update:modelValue', val);
  if (props.onChange) await props.onChange(val);
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
</script>

<template>
  <q-input
    :="newProps"
    ref="inputRef"
    v-model="formattedValue"
    :error="hasError"
    :error-message="errorMessage"
    :rules="rules"
    :title="props.label"
    outlined
    lazy-rules
  >
    <template #prepend>
      <template v-if="props.prependIcon">
        <q-icon :name="props.prependIcon" />
      </template>

      <template v-if="props.help && props.prependIcon">
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
