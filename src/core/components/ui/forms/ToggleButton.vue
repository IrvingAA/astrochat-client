<script setup lang="ts">
import useFormRules from '@/core/composables/useFormRules';
import type { ToggleButtonIC } from '@/core/types/components/ui/FormsInterface';
import type { ValidationRule } from 'quasar';
import { computed } from 'vue';
import HelpTooltip from '@/core/components/ui/HelpTooltip.vue';

/**
 * Props
 */
const props = withDefaults(defineProps<ToggleButtonIC>(), {
  label: 'Toggle button',
  disable: false
});

/**
 * Computed
 */
const hasError = computed<boolean>(() => Boolean(props.errorMessages?.length));
const errorMessage = computed<string>(() => props.errorMessages?.[0] ?? '');
const classRequiredLabel = computed<string>(() => (props.required ? 'input-required' : ''));

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:errorMessages', value: ToggleButtonIC['errorMessages']): void;
}>();

/**
 * Computed
 */
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] });
const model = computed<boolean>({
  get() {
    return props.modelValue;
  },
  async set(val: boolean) {
    if (!props.dontCleanErrorMessagesOnChange) {
      emits('update:errorMessages', []);
    }

    emits('update:modelValue', val);
    if (props.onChange) await props.onChange(model);
  }
});

/**
 * Rules
 */
const { required } = useFormRules();
if (props.required) rules.value.push(required);
</script>
<template>
  <div class="tw-flex tw-items-center tw-gap-2">
    <div>
      <HelpTooltip :show="Boolean(props.help)">
        {{ props.help }}
      </HelpTooltip>
    </div>

    <q-field
      v-model="model"
      :error="hasError"
      :error-message="errorMessage"
      :rules="rules"
      lazy-rules
      no-error-icon
      class="tw-w-full"
    >
      <template #control="control">
        <q-item tag="label" :disable="props.disable" class="tw-w-full">
          <q-item-section>
            <q-item-label class="tw-select-none" style="font-size: 1.1rem; line-height: 1.725rem">
              <div>
                <span :class="`${classRequiredLabel} tw-text-sm`">
                  {{ props.label }}
                </span>
              </div>
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
              :model-value="control.modelValue"
              @update:model-value="control.emitValue"
              unchecked-icon="mdi-close"
              checked-icon="mdi-check"
              color="positive"
              :disable="props.disable"
            />
          </q-item-section>
        </q-item>
      </template>
    </q-field>
  </div>
</template>
