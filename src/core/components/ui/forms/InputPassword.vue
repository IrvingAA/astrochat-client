<script setup lang="ts">
import useFormRules from '@/core/composables/useFormRules';
import type { InputPasswordIC } from '@/core/types/components/ui/FormsInterface';
import type { ValidationRule } from 'quasar';
import { ref, computed } from 'vue';
import HelpTooltip from '@/core/components/ui/HelpTooltip.vue';

/**
 * Props
 */
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] });
const props = withDefaults(defineProps<InputPasswordIC>(), {
  label: 'Contraseña',
  required: false,
  dontCleanErrorMessagesOnChange: false
});

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: InputPasswordIC['modelValue']): void;
  (e: 'update:errorMessages', value: InputPasswordIC['errorMessages']): void;
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
 * Reactive states
 */
const showPassword = ref<boolean>(false);
const toggleShowPassword = (): boolean => (showPassword.value = !showPassword.value);

/**
 * Computed
 */
const appendIcon = computed<string>(() => (showPassword.value ? 'mdi-eye-off' : 'mdi-eye'));
const typeInput = computed<'text' | 'password'>(() => (showPassword.value ? 'text' : 'password'));
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
    :type="typeInput"
    v-model="model"
    :error="hasError"
    :error-message="errorMessage"
    :rules="rules"
    :title="props.label"
    outlined
    lazy-rules
  >
    <template #prepend>
      <q-icon name="mdi-key" />

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

    <template #append>
      <q-icon
        :name="appendIcon"
        @click="toggleShowPassword"
        class="tw-cursor-pointer hover:tw-text-info"
      />
    </template>
  </q-input>
</template>
