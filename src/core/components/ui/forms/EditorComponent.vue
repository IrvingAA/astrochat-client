<script setup lang="ts">
import useFormRules from '@/core/composables/useFormRules';
import type { EditorIC } from '@/core/types/components/ui/FormsInterface';
import type { ValidationRule } from 'quasar';
import { computed } from 'vue';
import HelpTooltip from '@/core/components/ui/HelpTooltip.vue';

/**
 * Props
 */
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] });
const props = withDefaults(defineProps<EditorIC>(), {
  label: 'Editor',
  required: false,
  dontCleanErrorMessagesOnChange: false
});

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: EditorIC['modelValue']): void;
  (e: 'update:errorMessages', value: EditorIC['errorMessages']): void;
}>();

/**
 * Model
 */
const model = computed({
  get() {
    if (!props.modelValue) return '';
    return props.modelValue;
  },
  async set(value: string | null) {
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
  model.value = null;
};
</script>

<template>
  <div>
    <q-card flat bordered class="tw-bg-opacity-20 bg-transparent">
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
            <q-tooltip>Limpiar Editor</q-tooltip>
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
            <q-editor
              :="newProps"
              type="text"
              v-model="scope.modelValue"
              @update:model-value="scope.emitValue"
              toolbar-rounded
              paragraph-tag="p"
              class="tw-w-full"
              :toolbar="[
                [
                  {
                    label: $q.lang.editor.align,
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    list: 'only-icons',
                    options: ['left', 'center', 'right', 'justify']
                  }
                ],
                ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                ['hr', 'link'],
                [
                  {
                    label: $q.lang.editor.formatting,
                    icon: $q.iconSet.editor.formatting,
                    list: 'no-icons',
                    options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
                  },
                  {
                    label: $q.lang.editor.fontSize,
                    icon: $q.iconSet.editor.fontSize,
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
                  }
                ],
                ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
                ['undo', 'redo']
              ]"
            />
          </template>
        </q-field>
      </q-card-section>
    </q-card>
  </div>
</template>
