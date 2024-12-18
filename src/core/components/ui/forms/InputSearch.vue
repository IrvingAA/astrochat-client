<script setup lang="ts">
import useFormRules from '@/core/composables/useFormRules';
import type { InputSearchIC } from '@/core/types/components/ui/FormsInterface';
import type { ValidationRule } from 'quasar';
import { computed } from 'vue';
import HelpTooltip from '@/core/components/ui/HelpTooltip.vue';

/**
 * Props
 */
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] });
const props = withDefaults(defineProps<InputSearchIC>(), {
  label: 'Text',
  required: false,
  labelSlot: true,
  dontCleanErrorMessagesOnChange: false
});

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: InputSearchIC['modelValue']): void;
  (e: 'update:errorMessages', value: InputSearchIC['errorMessages']): void;
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
 * Methods
 */
const search = () => {
  if (props.onSearch) props.onSearch(model.value);
};

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
    type="text"
    v-model="model"
    :error="hasError"
    :error-message="errorMessage"
    :rules="rules"
    :title="props.label"
    outlined
    lazy-rules
    @keydown.enter.prevent="search"
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

    <template #append>
      <q-icon name="mdi-magnify" class="tw-cursor-pointer hover:tw-text-info" @click="search" />
    </template>
  </q-input>
</template>
