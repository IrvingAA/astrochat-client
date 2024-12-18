<script setup lang="ts">
import useFormRules from '@/core/composables/useFormRules';
import type { InputFileIC } from '@/core/types/components/ui/FormsInterface';
import { useQuasar, type QTableProps, type ValidationRule } from 'quasar';
import { computed, ref, type InputHTMLAttributes, onBeforeMount } from 'vue';
import { mdiRefresh } from '@mdi/js';
import BlobUtils from '@/core/utils/BlobUtils';
import FilesDatabase from '@/core/databases/FilesDatabase';
import useDialogImageStore from '@/core/stores/components/ui/dialogs/useDialogImageStore';
import useDialogAlertStore from '@/core/stores/components/ui/dialogs/useDialogAlertStore';
import useDialogPdfStore from '@/core/stores/components/ui/dialogs/useDialogPdfStore';
import HelpTooltip from '@/core/components/ui/HelpTooltip.vue';

/**
 * Imported
 */
//
const blobUtils = BlobUtils();
const filesDatabase = new FilesDatabase();
const dialogImageStore = useDialogImageStore();
const dialogPdfStore = useDialogPdfStore();
const dialogAlert = useDialogAlertStore();

/**
 * OnBeforeMount
 */
onBeforeMount(async () => {
  /**
   * Cargar archivos antes de montar el componente
   */
  if (Array.isArray(model.value)) {
    if (model.value.length === 0) {
      await filesDatabase.setFiles(props.idFileList, []);
    } else {
      if (model.value.every((item) => item instanceof File)) {
        await filesDatabase.setFiles(props.idFileList, model.value);
      } else {
        model.value = await filesDatabase.getFiles(props.idFileList);
      }
    }
  } else {
    if (model.value === null) {
      await filesDatabase.setFiles(props.idFileList, null);
    } else {
      if (model.value instanceof File) {
        await filesDatabase.setFiles(props.idFileList, model.value);
      } else {
        model.value = await filesDatabase.getFiles(props.idFileList);
      }
    }
  }
});

/**
 * Data
 */
const inputRef = ref<InputHTMLAttributes>();
const inputId = ref<string>(`input-file-${Math.random().toString(36)}`);
const updateInputId = () => (inputId.value = `input-file-${Math.random().toString(36)}`);
const maxFiles = computed<number | null>(() => (props.multiple ? props.maxFiles || null : 1));
const filesUploaded = computed<number>(() => {
  if (Array.isArray(model.value)) {
    // @ts-ignore
    return model.value?.length ?? 0;
  } else {
    return model.value ? 1 : 0;
  }
});

const limitFiles = computed<boolean>(() => {
  if (maxFiles.value) {
    return filesUploaded.value >= maxFiles.value;
  } else {
    return false;
  }
});

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: InputFileIC['modelValue']): void;
  (e: 'update:errorMessages', value: InputFileIC['errorMessages']): void;
}>();

/**
 * Model
 */
const model = computed({
  get() {
    return props.modelValue;
  },
  async set(value) {
    if (value === undefined) value = null;
    if (props.multiple && value === null) value = [];

    if (!props.dontCleanErrorMessagesOnChange) {
      emits('update:errorMessages', []);
    }

    emits('update:modelValue', value);
    if (props.onChange) await props.onChange(value);
  }
});

/**
 * Props
 */
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] });
const props = withDefaults(defineProps<InputFileIC>(), {
  label: 'File(s)',
  required: false,
  dontCleanErrorMessagesOnChange: false
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
const { required, file } = useFormRules();
if (props.required) rules.value.push(required);
rules.value.push(file);

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
 * Props for hidden input
 */
// eslint-disable-next-line
const newPropsForHiddenInput = computed(() => {
  const modProps = { ...props };

  delete modProps.onChange;
  // @ts-ignore
  delete modProps.label;

  // @ts-ignore
  delete modProps.required;

  delete modProps.errorMessages;
  // @ts-ignore
  delete modProps.dontCleanErrorMessagesOnChange;
  delete modProps.maxFiles;
  // @ts-ignore
  delete modProps.idFileList;
  delete modProps.extraColumns;

  return modProps;
});

/**
 * Limpiar archivo(s)
 */
const clearFiles = async () => {
  let newFiles: null | [] | undefined = undefined;
  if (props.multiple) {
    newFiles = [];
  } else {
    newFiles = null;
  }

  model.value = newFiles;
  await filesDatabase.setFiles(props.idFileList, newFiles);
};

/**
 * Abrir File en una nueva pestaña
 */
const openFile = async (file: File): Promise<void> => {
  const isImage = file.type.includes('image');
  if (isImage) return dialogImageStore.show(file);

  const isPdf = file.type.includes('pdf');
  if (isPdf) return dialogPdfStore.show(file);

  const uri = URL.createObjectURL(file);
  window.open(uri, '_blank');
};

/**
 * Eliminar archivo
 */
const deleteFile = async (file: Blob) => {
  let newFiles: File[] | File | null | undefined = undefined;
  if (Array.isArray(model.value)) {
    newFiles = model.value.filter((item) => item !== file);
  } else {
    newFiles = null;
  }

  model.value = newFiles;
  await filesDatabase.setFiles(props.idFileList, newFiles);
};

/**
 * Rows para la tabla
 */
const rows = computed(() => {
  const rows = Array.isArray(model.value) ? model.value : [model.value];
  if (rows.length === 1 && !rows[0]) return [];
  return rows;
});

/**
 * Save file(s) in database
 */
const addFiles = async () => {
  updateInputId();
  if (limitFiles.value) return;

  // @ts-ignore
  const files: FileList = inputRef.value.files;

  //convert fileList to array of files
  let newFiles: File[] | File = [];
  for (let i = 0; i < files.length; i++) {
    newFiles.push(files[i]);
  }

  newFiles = props.multiple ? newFiles : newFiles[0];
  if (props.multiple) {
    // @ts-ignore
    newFiles = [...newFiles];
    const oldFiles = model.value;
    if (oldFiles) {
      if (Array.isArray(oldFiles)) {
        if (Array.isArray(newFiles)) {
          newFiles = [...oldFiles, ...newFiles];
        } else {
          newFiles = [...oldFiles, newFiles];
        }
      } else {
        if (Array.isArray(newFiles)) {
          newFiles = [oldFiles, ...newFiles];
        } else {
          newFiles = [oldFiles, newFiles];
        }
      }
    }

    if (maxFiles.value) {
      if (newFiles.length >= maxFiles.value + 1) {
        await dialogAlert.triggerDialogAlert(
          'warning',
          'Atención',
          `Solo se permiten ${maxFiles.value} archivos`
        );
        return;
      }
    }
  }

  await filesDatabase.setFiles(props.idFileList, newFiles);
  model.value = newFiles;

  //@ts-ignore
  inputRef.value.value = null;
};

/**
 * Get Row
 */
// eslint-disable-next-line
const getRow = (row: any) => {
  return {
    key: row.rowIndex
  };
};

/**
 * Columns
 */
const columns: QTableProps['columns'] = [
  { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
  { name: 'size', label: 'Tamaño', align: 'left', field: 'size' }
];

/**
 * Final columns
 */
const finalColumns = computed(() => {
  const newColumns: QTableProps['columns'] = [...columns];

  const extraColumns = props.extraColumns;

  if (extraColumns) {
    for (const column of extraColumns) {
      newColumns.push(column);
    }
  }

  newColumns.push({
    name: 'actions',
    label: 'Acciones',
    align: 'center',
    field: 'actions'
  });

  return newColumns;
});

/**
 * Wrap string if is too long
 */
const wrapString = (str: string) => {
  const max = ref<number>(0);
  const quasar = useQuasar();

  if (quasar.screen.xs) {
    max.value = 20;
  } else if (quasar.screen.sm) {
    max.value = 30;
  } else if (quasar.screen.md) {
    max.value = 40;
  } else if (quasar.screen.lg) {
    max.value = 50;
  } else if (quasar.screen.xl) {
    max.value = 60;
  }

  if (str.length <= max.value) return str;
  return str.slice(0, max.value) + '...';
};
</script>

<template>
  <div>
    <q-card flat bordered class="tw-bg-opacity-20">
      <q-card-section>
        <div class="tw-flex tw-justify-between">
          <div>
            <span :class="`${classRequiredLabel} tw-text-md`">
              {{ props.label }}
            </span>

            <HelpTooltip :show="Boolean(props.help)">
              {{ props.help }}
            </HelpTooltip>
          </div>

          <q-btn color="negative" round :icon="mdiRefresh" @click="clearFiles">
            <q-tooltip anchor="top middle" self="center middle"> Limpiar archivo(s) </q-tooltip>
          </q-btn>
        </div>

        <q-field
          v-model="model"
          :error="hasError"
          :error-message="errorMessage"
          :rules="rules"
          lazy-rules
          no-error-icon
        >
          <template #control>
            <input
              :="newPropsForHiddenInput"
              :id="inputId"
              :name="inputId"
              type="file"
              ref="inputRef"
              class="tw-hidden"
              @change="addFiles"
              :disabled="limitFiles"
            />

            <div class="tw-my-2 tw-flex tw-items-center tw-gap-3">
              <!-- @vue-ignore -->
              <q-btn
                color="primary"
                label="Cargar archivo(s)"
                icon="mdi-plus"
                @click="inputRef?.click()"
                no-caps
                :disable="limitFiles"
              />

              <template v-if="maxFiles">
                <span class="tw-text-right tw-text-md tw-text-negative tw-font-bold">
                  {{ filesUploaded }} / {{ maxFiles }}
                </span>
              </template>
            </div>
          </template>
        </q-field>

        <!-- @vue-ignore -->
        <q-table
          class="tw-mt-3"
          :rows="rows"
          :columns="finalColumns"
          separator="cell"
          flat
          bordered
          dense
          :rows-per-page-options="[5, 10, 15]"
        >
          ]">
          <template #body-cell-name="{ row }: { row: any }">
            <td class="tw-break-words">
              {{ wrapString(row.name) }}

              <q-tooltip
                anchor="top middle"
                self="center middle"
                style="width: 6cm !important; text-align: justify !important"
              >
                {{ row.name }}
              </q-tooltip>
            </td>
          </template>

          <template #body-cell-size="{ row }: { row: File }">
            <td>{{ blobUtils.blobSizeToMB(row) }} MB</td>
          </template>

          <!-- @vue-skip -->
          <template v-for="(index, name) in $slots" v-slot:[`body-cell-${name}`]="row" :key="index">
            <td>
              <slot :name="name" v-bind="getRow(row)" />
            </td>
          </template>

          <template #body-cell-actions="{ row }: { row: File }">
            <td>
              <div class="tw-flex tw-gap-1 tw-justify-center">
                <q-btn color="info" dense flat round icon="mdi-eye" @click="openFile(row)">
                  <q-tooltip anchor="top middle" self="center middle"> Ver </q-tooltip>
                </q-btn>

                <q-btn color="negative" dense flat round icon="mdi-close" @click="deleteFile(row)">
                  <q-tooltip anchor="top middle" self="center middle"> Eliminar </q-tooltip>
                </q-btn>
              </div>
            </td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>
