<script setup lang="ts">
import useFormRules from '@/core/composables/useFormRules';
import type { RadioGroupIC } from '@/core/types/components/ui/FormsInterface';
import type { ValidationRule } from 'quasar';
import { computed } from 'vue';
import HelpTooltip from '@/core/components/ui/HelpTooltip.vue';

/**
 * Props
 */
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] });
const props = withDefaults(defineProps<RadioGroupIC>(), {
  label: 'Radio Group',
  required: false,
  dontCleanErrorMessagesOnChange: false
});

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: RadioGroupIC['modelValue']): void;
  (e: 'update:errorMessages', value: RadioGroupIC['errorMessages']): void;
}>();

/**
 * Model
 */
const model = computed({
  get() {
    //parse value to string
    if (typeof props.modelValue === 'number') {
      return props.modelValue.toString();
    }

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

  //Parse options values to string
  if (!modProps.options) modProps.options = [];
  modProps.options = modProps.options.map((option) => {
    if (typeof option.value === 'number') {
      option.value = option.value.toString();
    }
    return option;
  });

  return modProps;
});

/**
 * Reset model
 */
const resetModel = () => {
  model.value = null;
};
</script>

<template>
  <div>
    <q-card flat bordered class="tw-bg-opacity-20">
      <q-card-section>
        <div class="tw-mb-3 tw-flex tw-items-center tw-justify-between">
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
            <q-tooltip>Limpiar Opciones</q-tooltip>
          </q-icon>
        </div>

        <q-field
          v-model="model"
          :error="hasError"
          :error-message="errorMessage"
          :rules="rules"
          lazy-rules
          borderless
          no-error-icon
        >
          <template #control="scope">
            <q-option-group
              :="newProps"
              type="radio"
              dense
              v-model="scope.modelValue"
              @update:model-value="scope.emitValue"
            />
          </template>
        </q-field>
      </q-card-section>
    </q-card>
  </div>
</template>
