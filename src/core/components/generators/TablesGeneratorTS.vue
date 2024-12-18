<script setup lang="ts">
import useUtils from '@/core/composables/useUtils';
import type {
  TGPropsIC,
  TGModelIC,
  TableTG
} from '@/core/types/components/generators/TablesGeneratorInterface';
import useDialogLoaderStore from '@/core/stores/components/ui/dialogs/useDialogLoaderStore';
import FormsUtils from '@/core/utils/FormsUtils';
import { VueElement, computed, onMounted, ref, watch } from 'vue';
import FormsGeneratorTS from './FormsGeneratorTS.vue';
import type { FormGeneratorTsVueIC } from '@/core/types/components/generators/FormsGeneratorInterface';
import useFormsStore from '@/core/stores/config/useFormsStore';
import useTablesStore from '@/core/stores/config/useTablesStore';
import HeaderComponent from '@/core/components/ui/HeaderComponent.vue';
import { useQuasar } from 'quasar';
import useDialogAlertStore from '@/core/stores/components/ui/dialogs/useDialogAlertStore';
import TablesEnum from '@/enums/TablesEnum';
import type { ArrayOfObjects } from '@/core/types/GlobalTypes';
import { watchDebounced } from '@vueuse/core';
import { axiosIsLoading } from '@/boot/axios';
import CustomHandler from '@/core/config/CustomHandler';
import useAbortStore from '@/core/stores/config/useAbortStore';

/**
 * Imported
 */
const abortStore = useAbortStore();
const { enableDialogLoader, disableDialogLoader } = useDialogLoaderStore();
const { recursiveObjectKeysValues, restoreObjectFromKeysValues } = FormsUtils();
const utils = useUtils();
const formsStore = useFormsStore();
const tablesStore = useTablesStore();
const quasar = useQuasar();
const dialogAlertStore = useDialogAlertStore();

/**
 * Model Value
 */
const modelValue = defineModel<TGModelIC<any>>('modelValue');

// @ts-ignore
const tableName = computed<keyof typeof TablesEnum>(() => modelValue.value?.tableName || '');

/**
 * On Mounted
 */
onMounted(async () => {
  qTablePagination.value.rowsPerPage = tablesStore.defaultPerPage;
  /**
   * Si debe reiniciar los filtros al iniciar
   */
  if (modelValue.value?.resetFiltersAtStart) {
    await resetFilters();
  }

  /**
   * Si no se debe persistir los datos
   */
  if (!modelValue.value?.persistData) {
    // @ts-ignore
    tablesStore.setTable(modelValue.value?.tableName, []);
  }

  /**
   * Si debe cargar datos al iniciar
   */
  if (modelValue.value?.loadDataAtStart) {
    if (!modelValue.value?.persistData) {
      // Si no debe persistir los datos
      await getData();
    } else {
      // Si debe persistir los datos
      // @ts-ignore
      const table = tablesStore.getTable(modelValue.value?.tableName);
      if (table.length === 0) {
        await getData();
      }
    }
  }

  loadedDataAtStart.value = true;

  /**
   * Mostrar los filtros si el tamaño de la pantalla es mayor a 'sm'
   */
  if (modelValue.value?.showFiltersIfAbove && quasar.screen.gt.xs) {
    showFilters.value = true;
  }
});

/**
 * Pagination
 */
const pagination = computed({
  get: () => tablesStore.getPagination(tableName.value),
  set: (value) => tablesStore.setPagination(tableName.value, value)
});

/**
 * Page
 */
const page = computed({
  get: () => tablesStore.getPage(tableName.value),
  set: (value) => tablesStore.setPage(tableName.value, value)
});

/**
 * Per page
 */
const perPage = computed({
  get: () => tablesStore.getPerPage(tableName.value),
  set: (value) => tablesStore.setPerPage(tableName.value, value)
});

// @ts-ignore
const FGModel = computed<FormGeneratorTsVueIC<any>>(() => modelValue.value?.filtersFGModel || {});
const showFilters = ref<boolean>(false);
const toggleShowFilters = () => (showFilters.value = !showFilters.value);
const formFilters = formsStore.getFormInOriginalFormat<{
  [key: string]: any;
}>(FGModel.value?.formToUseName || '');

/**
 * Slots
 */
defineSlots<{
  // @ts-ignore
  [nameField: string]: (item: any) => VueElement;

  // @ts-ignore
  [columnName: string]: (item: any) => VueElement;

  /**
   * Slot para los botones
   */
  buttonsSlot: () => VueElement;
}>();

/**
 * Props
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<TGPropsIC>(), {
  //
});

/**
 * Data
 */
const qTablePagination = ref<{
  rowsPerPage: number | undefined;
}>({
  rowsPerPage: modelValue.value?.defaultPerPage || tablesStore.defaultPerPage
});

watch(page, async () => {
  if (!modelValue.value?.serverPagination) return;
  await getData();
});

watch(perPage, async (value) => {
  if (!modelValue.value?.serverPagination) return;
  qTablePagination.value.rowsPerPage = value;
  await getDataAndResetPage();
});

const columns = computed(() => modelValue.value?.columns || []);
const loadedDataAtStart = ref<boolean>(false);
const noDataLabel = computed(() => {
  if (!loadedDataAtStart.value) return 'Consulte para mostrar datos';
  return 'No hay datos para mostrar';
});

/**
 * Watch para cargar los datos al cambiar los filtros
 */
 watchDebounced(
  () => formFilters.value,
  async (form) => {
    if (modelValue.value?.searchOnFiltersChange && !utils.isEmpty(form)) {
      await getData()
    }
  },
  {
    deep: true,
    debounce: 800
  }
)

/**
 * Watch para cancelar la búsqueda si se está cargando
 */
watch(
  () => formFilters.value,
  () => {
    if (axiosIsLoading.value && modelValue.value?.searchOnFiltersChange) {
      abortStore.abort()
    }
  }
)

/**
 * Has Form
 */
const hasFormFilters = (): boolean => {
  if (!FGModel.value?.formToUseName) return false;
  return true;
};

/**
 * Get Filters
 */
const getFilters = () => {
  if (!hasFormFilters()) return {};
  return formFilters.value;
};

/**
 * Reset Filters
 */
const resetFilters = async () => {
  if (!hasFormFilters()) return;
  await formsStore.resetForm(FGModel.value?.formToUseName);
};

/**
 * Has One Filter
 */
const hasOneFilter = (filters: { [key: string]: any }): boolean => {
  let hasOneFilter = false;
  const newFilters = { ...filters };

  Object.keys(newFilters).forEach((key) => {
    if (newFilters[key] !== undefined && newFilters[key] !== null && newFilters[key] !== '') {
      hasOneFilter = true;
    }
  });

  return hasOneFilter;
};

/**
 * Consume el servicio para obtener los datos y reiniciar la página
 */
const getDataAndResetPage = async <T extends ArrayOfObjects>(): Promise<TableTG<T> | undefined> => {
  page.value = 1;
  const data = await getData();
  // @ts-ignore
  return data;
};

/**
 * Consume el servicio para obtener los datos
 */
const getData = async <T extends ArrayOfObjects>(): Promise<TableTG<T> | undefined> => {
  try {
    /**
     * Filters
     */
    let filters = {};
    if (modelValue.value?.hasFilters && hasFormFilters()) {
      filters = getFilters();

      if (modelValue.value.oneFilterRequired && !hasOneFilter(filters)) {
        if (loadedDataAtStart.value) {
          dialogAlertStore.triggerDialogAlert(
            'warning',
            'Atención',
            'Debe ingresar al menos un filtro',
            true
          );
        }

        return;
      }
    }

    /**
     * Pagination
     */
    let paginationTable = undefined;
    if (modelValue.value?.serverPagination) {
      paginationTable = {
        page: page.value,
        perPage: perPage.value
      };
    }

    if (props.beforeGetData) {
      const beforeGetData = await props.beforeGetData(filters, paginationTable);
      if (!beforeGetData) return;
    }

    enableDialogLoader();

    /**
     * Fetch data
     */
    // @ts-ignore

    const res = await modelValue.value?.service(filters, paginationTable);

    // @ts-ignore
    let resData = undefined;
    if (modelValue.value?.serverPagination) {
      resData = res.items;
      pagination.value = res.pagination;
    } else {
      resData = res;
    }

    // @ts-ignore
    const initialIndex = modelValue.value?.serverPagination ? pagination.value?.from - 1 : 0;

    // @ts-ignore
    resData.forEach((item, index) => {
      item.index = initialIndex + index + 1;
    });

    // @ts-ignore
    const newData = resData.map((item) => recursiveObjectKeysValues(item));

    // @ts-ignore
    tablesStore.setTable(modelValue.value?.tableName, newData);
  } catch (error: any) {
    if (error instanceof Error) {
      if (error.message !== 'canceled') {
        // @ts-ignore
        tablesStore.setTable(modelValue.value?.tableName, []);

        const newError = new CustomHandler(error);
        quasar.notify({
          color: 'negative',
          message: newError.data.message,
          icon: 'mdi-alert-circle-outline',
          position: 'bottom',
          timeout: 5000
        });
      }
    }
  }

  disableDialogLoader();

  // @ts-ignore
  const dataOriginal = tablesStore.getTableInOriginalFormat(modelValue.value?.tableName);

  if (props.afterGetData) {
    await props.afterGetData(dataOriginal.value);
  }

  // @ts-ignore
  return dataOriginal.value;
};

/**
 * Get Row
 */
const getRow = (row: any) => {
  const newRow = { ...row.row };
  return restoreObjectFromKeysValues(newRow);
};

/**
 * Has previous page
 */
const hasPreviousPage = computed(() => {
  if (!pagination.value) return false;
  return page.value > 1;
});

/**
 * Next page
 */
const previousPage = () => {
  if (!hasPreviousPage.value) return;
  page.value = page.value - 1;
};

/**
 * Has next page
 */
const hasNextPage = computed(() => {
  if (!pagination.value) return false;
  return page.value < pagination.value.lastPage;
});

/**
 * Next page
 */
const nextPage = () => {
  if (!hasNextPage.value) return;
  page.value = page.value + 1;
};

/**
 * First page
 */
const firstPage = () => {
  if (!hasPreviousPage.value) return;
  page.value = 1;
};

/**
 * Last page
 */
const lastPage = () => {
  if (!pagination.value) return;
  if (!hasNextPage.value) return;
  page.value = pagination.value.lastPage;
};

/**
 * Expose
 */
defineExpose({
  getData,
  getDataAndResetPage
});
</script>

<template>
  <div>
    <template v-if="modelValue?.hasFilters">
      <q-drawer behavior="mobile" :width="300" side="right" bordered elevated v-model="showFilters">
        <div class="tw-p-2 tw-overflow-y-auto" style="z-index: 100 !important">
          <div class="tw-sticky tw-top-0">
            <HeaderComponent icon="mdi-filter" label="Consulta" />
          </div>

          <q-space class="tw-py-1" />

          <div class="tw-px-2">
            <q-form @submit="getDataAndResetPage" @reset="resetFilters">
              <FormsGeneratorTS v-model="FGModel" :class="modelValue?.filtersClass">
                <!-- @vue-skip -->
                <template v-for="(index, name) in $slots" v-slot:[`${name}`]="field" :key="index">
                  <slot :name="name" v-bind="field" />
                </template>
              </FormsGeneratorTS>

              <q-space class="tw-mb-12" />

              <div class="btn-container">
                <q-btn
                  fab-mini
                  dense
                  size="sm"
                  icon="mdi-arrow-collapse-right"
                  color="red"
                  @click="toggleShowFilters"
                >
                  <q-tooltip anchor="top middle" self="center middle"> Minimizar </q-tooltip>
                </q-btn>
                <q-btn fab-mini size="sm" icon="mdi-refresh" color="blue" type="reset">
                  <q-tooltip anchor="top middle" self="center middle"> Limpiar </q-tooltip>
                </q-btn>

                <template v-if="!axiosIsLoading">
                  <q-btn fab-mini size="sm" icon="mdi-magnify" color="primary" type="submit">
                    <q-tooltip anchor="top middle" self="center middle"> Buscar </q-tooltip>
                  </q-btn>
                </template>

                <template v-else>
                  <q-btn
                    fab-mini
                    size="sm"
                    icon="mdi-stop"
                    color="negative"
                    @click="abortStore.abort()"
                  >
                    <q-tooltip anchor="top middle" self="center middle">
                      Cancelar búsqueda
                    </q-tooltip>
                  </q-btn>
                </template>
              </div>
            </q-form>
          </div>
        </div>
      </q-drawer>
    </template>

    <div class="tw-px-3 tw-pb-2">
      <div class="tw-text-center md:tw-text-left">
        <q-btn-group push>
          <q-btn
            v-if="modelValue?.hasFilters"
            type="submit"
            color="positive"
            icon="mdi-filter"
            label="Consulta"
            no-caps
            @click="toggleShowFilters"
          />

          <slot name="buttonsSlot" />
        </q-btn-group>
      </div>
    </div>

    <!-- @vue-ignore-->
    <q-table
      v-model:pagination="qTablePagination"
      :rows="tablesStore.getTable(modelValue?.tableName)"
      :columns="columns"
      separator="cell"
      flat
      bordered
      dense
      :no-data-label="noDataLabel"
      :rows-per-page-options="[5, 10, 25, 50, 100, 250, 500, 0]"
    >
      <template #header="props">
        <q-tr :props="props" class="tw-bg-grey">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="tw-text-white"
            style="font-size: 0.9rem"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template #top v-if="modelValue?.serverPagination && pagination">
        <div class="tw-w-full">
          <div class="tw-flex tw-items-center tw-justify-center">
            <div class="tw-flex tw-items-center tw-mr-4">
              <span class="tw-text-xs tw-mr-2">Filas por página:</span>
              <q-select dense v-model="perPage" :options="[5, 10, 25, 50, 100, 250, 500]" />
            </div>

            <div>
              <span class="tw-text-xs tw-mr-2">
                {{ pagination.from }}-{{ pagination.to }} de {{ pagination.total }}
              </span>

              <q-btn
                flat
                round
                dense
                size="3mm"
                icon="mdi-page-first"
                @click="firstPage"
                :disable="!hasPreviousPage"
                v-if="pagination.lastPage > 2"
              >
                <q-tooltip v-if="pagination.currentPage > 1"> Inicio </q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                size="3mm"
                icon="mdi-chevron-left"
                @click="previousPage"
                :disable="!hasPreviousPage"
                v-if="pagination.lastPage > 1"
              >
                <q-tooltip v-if="hasPreviousPage"> Retroceder </q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                size="3mm"
                icon="mdi-chevron-right"
                @click="nextPage"
                :disable="!hasNextPage"
                v-if="pagination.lastPage > 1"
              >
                <q-tooltip v-if="hasNextPage"> Avanzar </q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                size="3mm"
                icon="mdi-page-last"
                @click="lastPage"
                :disable="!hasNextPage"
                v-if="pagination.lastPage > 2"
              >
                <q-tooltip v-if="pagination.currentPage < pagination.lastPage"> Fin </q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </template>

      <!-- @vue-skip -->
      <template v-for="(index, name) in $slots" v-slot:[`body-cell-${name}`]="row" :key="index">
        <td>
          <slot :name="name" v-bind="getRow(row)" />
        </td>
      </template>

      <template #bottom v-if="modelValue?.serverPagination && pagination">
        <div class="tw-w-full">
          <div class="tw-flex tw-items-center tw-justify-center">
            <div class="tw-flex tw-items-center tw-mr-4">
              <span class="tw-text-xs tw-mr-2">Filas por página:</span>
              <q-select dense v-model="perPage" :options="[5, 10, 25, 50, 100, 250, 500]" />
            </div>

            <div>
              <span class="tw-text-xs tw-mr-2">
                {{ pagination.from }}-{{ pagination.to }} de {{ pagination.total }}
              </span>

              <q-btn
                flat
                round
                dense
                size="3mm"
                icon="mdi-page-first"
                @click="firstPage"
                :disable="!hasPreviousPage"
                v-if="pagination.lastPage > 2"
              >
                <q-tooltip v-if="pagination.currentPage > 1"> Inicio </q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                size="3mm"
                icon="mdi-chevron-left"
                @click="previousPage"
                :disable="!hasPreviousPage"
                v-if="pagination.lastPage > 1"
              >
                <q-tooltip v-if="hasPreviousPage"> Retroceder </q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                size="3mm"
                icon="mdi-chevron-right"
                @click="nextPage"
                :disable="!hasNextPage"
                v-if="pagination.lastPage > 1"
              >
                <q-tooltip v-if="hasNextPage"> Avanzar </q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                size="3mm"
                icon="mdi-page-last"
                @click="lastPage"
                :disable="!hasNextPage"
                v-if="pagination.lastPage > 2"
              >
                <q-tooltip v-if="pagination.currentPage < pagination.lastPage"> Fin </q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<style scoped lang="scss">
.btn-container {
  position: fixed !important;
  bottom: 5mm !important;
  right: 0 !important;
  margin-right: 15px;
  display: flex !important;
  z-index: 10;
  gap: 8px;
}
</style>
