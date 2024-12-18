<script setup lang="ts">
import HeaderComponent from '@/core/components/ui/HeaderComponent.vue';
import useFormsStore from '@/core/stores/config/useFormsStore';
import DataTable from '@/core/components/ui/DataTable.vue';
import { VueElement, computed, onMounted, ref } from 'vue';
import FormsGeneratorTS from '@/core/components/generators/FormsGeneratorTS.vue';
import type {
  FormListModelIC,
  PropsIC
} from '@/core/types/components/generators/FormsListGeneratorInterface';
import type { GetFormListItemIC } from '@/core/types/components/generators/FormsListGeneratorInterface';
import useDialogAlertStore from '@/core/stores/components/ui/dialogs/useDialogAlertStore';
import FormsListDatabase from '@/core/databases/FormsListDatabase';
import useFormsListsStore from '@/core/stores/config/useFormsListsStore';
import useDialogConfirmStore from '@/core/stores/components/ui/dialogs/useDialogConfirmStore';
import FilesDatabase from '@/core/databases/FilesDatabase';
import FormsUtils from '@/core/utils/FormsUtils';
import useDialogLoaderStore from '@/core/stores/components/ui/dialogs/useDialogLoaderStore';
import useUtils from '@/core/composables/useUtils';
import type { FormGeneratorTsVueIC } from '@/core/types/components/generators/FormsGeneratorInterface';

/**
 * Imported
 */
const filesDatabase = new FilesDatabase();
const formsStore = useFormsStore();
const formsListDatabase = new FormsListDatabase();
const dialogAlertStore = useDialogAlertStore();
const formsListsStore = useFormsListsStore();
const confirmDialog = useDialogConfirmStore();
const formUtils = FormsUtils();
const dialogLoader = useDialogLoaderStore();
const utils = useUtils();

/**
 * Props
 */
const modelValue = defineModel<FormListModelIC<any>>('modelValue');
const props = withDefaults(defineProps<PropsIC>(), {
  //
});

/**
 * Computed
 */
const hideBtnEditar = computed<Boolean>(() => {
  if (!props.btnEditarHideOn) return false;
  return props.btnEditarHideOn();
});

const hideBtnEliminar = computed<Boolean>(() => {
  if (!props.btnEliminarHideOn) return false;
  return props.btnEliminarHideOn();
});

const hideBtnLimpiarLista = computed<Boolean>(() => {
  if (!props.btnLimpiarListaHideOn) return false;
  return props.btnLimpiarListaHideOn();
});

/**
 * Slots
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const slots = defineSlots<{
  actions_form_list: () => VueElement;
  //@ts-ignore
  [nameField: string]: () => VueElement;

  //@ts-ignore
  [nameColumn: string]: () => VueElement;
}>();

/**
 * Data
 */
const helpImage = ref<File | null>(null);
const icon = computed(() => modelValue.value?.icon ?? undefined);
const title = computed(() => modelValue.value?.title ?? '');

// @ts-ignore
const FGModel = computed<FormGeneratorTsVueIC<any>>(() => modelValue.value?.FGModel || {});
const formToUseName = computed(() => FGModel.value.formToUseName ?? '');

const formList = formsListsStore.getFormListComputed(formToUseName.value);
const rows = computed(() => {
  const reversed = formList.value.slice().reverse();
  return reversed;
});

const columns = computed(() => modelValue.value?.columns ?? []);
// @ts-ignore
const classForm = computed(() => modelValue.value?.classFG ?? '');

// @ts-ignore
const iconShowForm = computed(() =>
  formsListsStore.formsShow[formToUseName.value] ? 'mdi-close' : 'mdi-plus'
);

// @ts-ignore
const tooltipShowForm = computed(() =>
  formsListsStore.formsShow[formToUseName.value] ? 'Cancelar' : 'Nuevo'
);
const editFormListId = ref<string | null>(null);

const isLimited = computed<boolean>(() => {
  if (!modelValue.value?.limit) return false;
  return formList.value.length >= modelValue.value?.limit;
});

/**
 * On mounted
 */
onMounted(async () => {
  //helpImage.value = await utils.convertSourceToFileObject(helpImageSrc, 'help');
  const data = await formsListsStore.getFormListInOriginalFormat(formToUseName.value);
  await formsListsStore.setFormList(formToUseName.value, data);
});

/**
 * Reset form
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resetForm = async () => {
  const form = formsStore.getFormInOriginalFormat<any>(formToUseName.value);

  if (props.beforeResetFormMethod) {
    const res = await props.beforeResetFormMethod(form.value);
    if (!res) return;
  }

  if (editFormListId.value) {
    const item = await formsListDatabase.getItemOriginal(formToUseName.value, editFormListId.value);
    formsStore.setFields(formToUseName.value, item);
    return;
  }

  const formKeys = Object.keys(formUtils.recursiveObjectKeysValues(form.value));
  for (const key of formKeys) {
    await filesDatabase.clearFiles(formToUseName.value + '_' + key);
  }

  formsStore.resetForm(formToUseName.value);
  editFormListId.value = null;

  if (props.afterResetFormMethod) {
    await props.afterResetFormMethod();
  }
};

/**
 * Reset form list
 */
const resetFormList = async () => {
  if (props.beforeEveryFormListUpdateMethod) {
    await props.beforeEveryFormListUpdateMethod();
  }

  const confirm = await confirmDialog.triggerDialogConfirm(
    'Se eliminarán todos los datos de la lista'
  );
  if (!confirm) return;

  if (props.beforeResetFormListMethod) {
    const formList = await formsListDatabase.getFormListOriginal(formToUseName.value);
    const res = await props.beforeResetFormListMethod(formList);
    if (!res) return;
  }

  await formsListDatabase.clearFormList(formToUseName.value);
  await formsListsStore.setFormList(formToUseName.value, []);

  if (props.afterResetFormListMethod) {
    await props.afterResetFormListMethod();
  }

  if (props.afterEveryFormListUpdateMethod) {
    await props.afterEveryFormListUpdateMethod();
  }
};

/**
 * SaveForm
 */
const saveForm = async () => {
  if (props.beforeEveryFormListUpdateMethod) {
    await props.beforeEveryFormListUpdateMethod();
  }

  const form = formsStore.getFormInOriginalFormat<any>(formToUseName.value);

  if (props.beforeSaveFormMethod) {
    const res = await props.beforeSaveFormMethod(form.value);
    if (!res) return;
  }

  if (editFormListId.value) {
    await formsListDatabase.updateItem(formToUseName.value, editFormListId.value, form.value);
    if (props.afterUpdateRowMethod) {
      await props.afterUpdateRowMethod();
    }
  } else {
    await formsListDatabase.pushItem(formToUseName.value, form.value);
    if (props.afterSaveFormMethod) {
      await props.afterSaveFormMethod();
    }
  }

  const newData = await formsListsStore.getFormListInOriginalFormat(formToUseName.value);
  await formsListsStore.setFormList(formToUseName.value, newData);

  toggleFormAndReset();

  if (props.afterEveryFormListUpdateMethod) {
    await props.afterEveryFormListUpdateMethod();
  }
};

/**
 * Save FormList
 */
const saveFormList = async () => {
  if (isLimited.value) {
    await dialogAlertStore.triggerDialogAlert(
      'warning',
      'Atención',
      'Se ha alcanzado el límite de registros'
    );
    return;
  }

  if (props.beforeEveryFormListUpdateMethod) {
    await props.beforeEveryFormListUpdateMethod();
  }

  const formList = await formsListDatabase.getFormListOriginal(formToUseName.value);

  if (!formList.length) {
    await dialogAlertStore.triggerDialogAlert(
      'warning',
      'Atención',
      'No hay datos en la lista para guardar'
    );
    return;
  }

  if (props.saveFormListMethod) {
    await props.saveFormListMethod(formList);
  }

  await formsListsStore.setFormList(formToUseName.value, []);

  if (modelValue.value?.resetTableOnSave) {
    await resetFormList();
  }

  if (props.afterEveryFormListUpdateMethod) {
    await props.afterEveryFormListUpdateMethod();
  }
};

/**
 * Remove row
 */
const removeRow = async (formListId: string) => {
  if (props.beforeEveryFormListUpdateMethod) {
    await props.beforeEveryFormListUpdateMethod();
  }

  if (props.beforeDeleteRowMethod) {
    const item = await formsListDatabase.getItemOriginal(formToUseName.value, formListId);
    const res = await props.beforeDeleteRowMethod(item);
    if (!res) return;
  }

  await formsListDatabase.removeItem(formToUseName.value, formListId);

  const newData = await formsListsStore.getFormListInOriginalFormat(formToUseName.value);
  await formsListsStore.setFormList(formToUseName.value, newData);

  if (props.afterDeleteRowMethod) {
    await props.afterDeleteRowMethod();
  }

  if (props.afterEveryFormListUpdateMethod) {
    await props.afterEveryFormListUpdateMethod();
  }
};

/**
 * Edit row
 */
const editRow = async (formListId: string) => {
  dialogLoader.enableDialogLoader();
  window.scrollTo(0, 0);
  const item = await formsListDatabase.getItemOriginal(formToUseName.value, formListId);
  if (props.beforeEditRowMethod) {
    const res = await props.beforeEditRowMethod(item);
    if (!res) return;
  }

  editFormListId.value = formListId;
  const indexShowed = formsListsStore
    .getFormList(formToUseName.value)
    .findIndex((item) => item.formListId === formListId);
  formsListsStore.setFormShow(formToUseName.value, true, indexShowed);

  formsStore.setFields(formToUseName.value, item);

  dialogLoader.disableDialogLoader();
};

/**
 * Cancel form
 */
const toggleFormAndReset = () => {
  editFormListId.value = null;
  formsListsStore.toggleFormShow(formToUseName.value);

  setTimeout(async () => {
    await resetForm();
  }, 200);
};

const showDataTable = computed(() => {
  const val1 = !formsListsStore.formsShow[formToUseName.value];
  const val2 = modelValue.value?.showTable;
  const res = val1 || val2;
  return res;
});

const showForm = computed<boolean>(() => {
  const showFormStore = Boolean(formsListsStore.formsShow[formToUseName.value]);
  return showFormStore;
});
</script>

<template>
  <div>
    <HeaderComponent :icon="icon" :label="title">
      <template #buttons>
        <q-btn
          flat
          dense
          :icon="iconShowForm"
          @click="toggleFormAndReset"
          :disable="iconShowForm == 'mdi-plus' && isLimited"
        >
          <q-tooltip>{{ tooltipShowForm }}</q-tooltip>
        </q-btn>
      </template>
    </HeaderComponent>

    <div class="tw-px-3">
      <template v-if="showForm">
        <q-form @submit="saveForm" @reset="resetForm">
          <!-- @vue-ignore-->
          <FormsGeneratorTS v-model="FGModel" :class="classForm">
            <!-- @vue-skip -->
            <template v-for="(index, name) in $slots" v-slot:[`${name}`]="field" :key="index">
              <slot :name="name" v-bind="field" />
            </template>
          </FormsGeneratorTS>

          <q-space class="tw-my-4" />

          <div class="tw-flex tw-justify-end tw-gap-3">
            <q-btn
              color="negative"
              icon="mdi-close"
              label="Cancelar"
              @click="toggleFormAndReset"
              no-caps
            />
            <q-btn
              color="blue"
              icon="mdi-refresh"
              :label="editFormListId ? 'Reiniciar' : 'Limpiar'"
              type="reset"
              no-caps
            />
            <q-btn color="primary" icon="mdi-playlist-plus" label="Agregar" type="submit" no-caps>
              <q-tooltip
                >Al término de sus gestiones de clic en el botón flotante Guardar
                Clasificación</q-tooltip
              >
            </q-btn>
          </div>
        </q-form>
      </template>

      <template v-if="showDataTable">
        <!-- @vue-ignore-->
        <DataTable :rows="rows" :columns="columns" :exportable-name="title">
          <template #buttons>
            <template v-if="!hideBtnLimpiarLista">
              <q-btn
                color="blue"
                icon="mdi-refresh"
                label="Limpiar lista"
                no-caps
                @click="resetFormList"
              />
            </template>
          </template>

          <template #actions="item: GetFormListItemIC<any[]>">
            <div class="tw-text-center">
              <slot name="actions_form_list" v-bind="item" />

              <template v-if="!hideBtnEditar">
                <q-btn color="blue" flat dense icon="mdi-pencil" @click="editRow(item.formListId)">
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
              </template>

              <template v-if="!hideBtnEliminar">
                <q-btn
                  color="negative"
                  flat
                  dense
                  icon="mdi-delete-outline"
                  @click="removeRow(item.formListId)"
                >
                  <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
              </template>
            </div>
          </template>

          <!-- @vue-skip -->
          <template v-for="(index, name) in $slots" v-slot:[`${name}`]="field" :key="index">
            <slot :name="name" v-bind="field" />
          </template>
        </DataTable>

        <template v-if="modelValue?.hasSaveFormListButton">
          <q-space class="tw-my-4" />

          <div class="tw-flex tw-justify-end tw-gap-3">
            <q-btn
              color="primary"
              icon="mdi-content-save"
              label="Guardar Lista"
              @click="saveFormList"
              no-caps
            />
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
