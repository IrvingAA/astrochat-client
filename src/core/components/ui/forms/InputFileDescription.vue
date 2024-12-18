<script setup lang="ts">
import type {
  FileDescriptionIC,
  InputFileDescriptionIC
} from '@/core/types/components/ui/FormsInterface';
import type { ValidationRule } from 'quasar';
import { computed } from 'vue';
import InputFile from './InputFile.vue';
import InputText from './InputText.vue';

/**
 * Props
 */
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] });
const props = withDefaults(defineProps<InputFileDescriptionIC>(), {
  label: 'Input File Description',
  required: false,
  dontCleanErrorMessagesOnChange: false
});

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: InputFileDescriptionIC['modelValue']): void;
  (e: 'update:errorMessages', value: InputFileDescriptionIC['errorMessages']): void;
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
 * Model for InputFile
 */
const modelInputFile = computed<File | File[] | null>({
  get: () => {
    if (Array.isArray(model.value)) {
      // @ts-ignore
      const files: File[] = model.value.map((item) => {
        return item.file;
      });

      return files;
    }

    return model.value?.file as File | null;
  },
  set: (value) => {
    //Asignar los valores al model
    if (Array.isArray(value)) {
      const files: FileDescriptionIC[] = value.map((item) => {
        if (Array.isArray(model.value) && model.value.length > 0) {
          const find = model.value.find((file) => file.file === item);
          if (find) return find;
        }

        return {
          file: item,
          description: null
        };
      });

      model.value = files;
    } else {
      // @ts-ignore
      model.value = {
        file: value,
        description: null
      };
    }
  }
});

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
 * Replace props for descriptions
 */
// eslint-disable-next-line
const descriptionsProps = computed(() => {
  const modProps = { ...props.descriptionsProps };

  // @ts-ignore
  delete modProps.dontCleanErrorMessagesOnChange;

  // @ts-ignore
  delete modProps.modelValue;

  // @ts-ignore
  delete modProps.label;

  return modProps;
});
</script>

<template>
  <InputFile
    :="newProps"
    v-model="modelInputFile"
    :rules="rules"
    :error-messages="props.errorMessages"
    @update:error-messages="emits('update:errorMessages', $event)"
    dont-clean-error-messages-on-change
    :extra-columns="[
      {
        label: 'Descripcion',
        field: 'description',
        name: 'description',
        align: 'left'
      }
    ]"
  >
    <template #description="row">
      <template v-if="Array.isArray(model)">
        <InputText
          v-if="model.length > 0"
          :="descriptionsProps"
          v-model="model[row.key]['description']"
          label="Descripción"
        />
      </template>

      <template v-else>
        <InputText
          v-if="model"
          :="descriptionsProps"
          v-model="model.description"
          label="Descripción"
        />
      </template>
    </template>
  </InputFile>
</template>
