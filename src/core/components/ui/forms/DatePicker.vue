<script setup lang="ts">
import useFormRules from '@/core/composables/useFormRules';
import type { DatePickerIC } from '@/core/types/components/ui/FormsInterface';
import type { ValidationRule } from 'quasar';
import { computed } from 'vue';
import HelpTooltip from '@/core/components/ui/HelpTooltip.vue';

/**
 * Props
 */
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] });
const props = withDefaults(defineProps<DatePickerIC>(), {
  label: 'Editor',
  required: false,
  dontCleanErrorMessagesOnChange: false
});

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: DatePickerIC['modelValue']): void;
  (e: 'update:errorMessages', value: DatePickerIC['errorMessages']): void;
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

/**
 * Reset model
 */
const resetModel = () => {
  if (props.multiple) model.value = [];
  model.value = null;
};
</script>

<template>
  <div>
    <q-card flat bordered class="tw-bg-opacity-20">
      <q-card-section>
        <div class="tw-flex tw-justify-between tw-items-center">
          <div>
            <span :class="`${classRequiredLabel} tw-text-md`">
              {{ props.label }}
            </span>

            <HelpTooltip :show="Boolean(props.help)">
              {{ props.help }}
            </HelpTooltip>
          </div>

          <q-icon
            name="mdi-refresh"
            class="tw-ml-2 tw-cursor-pointer tw-bg-negative tw-rounded-full tw-p-1"
            size="6mm"
            color="white"
            @click="resetModel"
          >
            <q-tooltip>Limpiar Fecha(s)</q-tooltip>
          </q-icon>
        </div>

        <q-space class="tw-my-3" />

        <q-field
          v-model="model"
          :error="hasError"
          :error-message="errorMessage"
          :rules="rules"
          lazy-rules
          no-error-icon
        >
          <template #control="scope">
            <q-date
              :="newProps"
              type="text"
              v-model="scope.modelValue"
              @update:model-value="scope.emitValue"
              class="tw-w-full"
              flat
            />
          </template>
        </q-field>
      </q-card-section>
    </q-card>
  </div>
</template>
