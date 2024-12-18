<script setup lang="ts">
import type { PropsIC } from '@/core/types/components/ui/DataTableInterface';
import FormsUtils from '@/core/utils/FormsUtils';
import { VueElement, computed, ref } from 'vue';
import XDate from 'xdate';
import { exportFile } from 'quasar';
import useNotify from '@/core/composables/useNotify';
import useDialogAlertStore from '@/core/stores/components/ui/dialogs/useDialogAlertStore';
import useUtils from '@/core/composables/useUtils';

/**
 * Imported
 */
const formsUtils = FormsUtils();
const notify = useNotify();
const utils = useUtils();
const dialogAlertStore = useDialogAlertStore();

/**
 * Filter
 */
const filter = ref<string>('');

/**
 * Props
 */
const props = withDefaults(defineProps<PropsIC>(), {
  exportableName: 'tabla',
  defaultPerPage: 10
});

/**
 * Slots
 */
defineSlots<{
  [columnName: string]: (item: any) => VueElement;
  buttons: () => VueElement;
}>();

/**
 * New Rows
 */
const newRows = computed<readonly any[]>(() => {
  if (!props.rows) return [];
  let newRows = props.rows;

  if (filter.value.length > 1) {
    newRows = newRows.filter((row) => {
      const values = Object.values(row);
      const valuesString = values.join(' ').toLowerCase();
      const filterString = filter.value.toLowerCase();

      return valuesString.includes(filterString);
    });
  }

  newRows = newRows?.map((item, index) => {
    return {
      index: index + 1,
      ...item
    };
  });

  return newRows;
});

/**
 * New Columns
 */
const newColumns = computed(() => {
  const newCols = props.columns.map((column) => {
    if (!column.align) column.align = 'left';
    //@ts-ignore
    if (!column.name && column.field) column.name = column.field;

    return column;
  });

  //add index column
  newCols.unshift({
    label: '#',
    field: 'index',
    align: 'left'
  });

  return newCols;
});

/**
 * Get Row
 */
const getRow = (row: any) => {
  const newRow = { ...row.row };
  return formsUtils.restoreObjectFromKeysValues(newRow);
};

/**
 * Wrap CSV Value
 */
function wrapCsvValue(val: any, formatFn?: Function, row?: object): string {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted = formatted === void 0 || formatted === null ? '' : String(formatted);

  formatted = formatted.split('"').join('""');
  return `"${formatted}"`;
}

/**
 * Download CSV
 */
const downloadCsv = async (): Promise<void> => {
  if (utils.isEmpty(newRows.value)) {
    dialogAlertStore.triggerDialogAlert('warning', 'Atencion', 'No hay datos para descargar');
    return;
  }

  let headers: string[] = [];
  newColumns.value.forEach((col) => {
    if (col.dontExport) return;

    const header = wrapCsvValue(col.label);
    headers.push(header);
  });

  let data: string[] = [];
  newRows.value.forEach((row) => {
    const dataString: string[] = [];
    newColumns.value.forEach((col) => {
      if (col.dontExport) return;

      const RowString = wrapCsvValue(
        typeof col.field === 'function'
          ? // @ts-ignore
            col.field(row)
          : // @ts-ignore
            row[col.field === void 0 ? col.name : col.field],
        col.format,
        row
      );

      dataString.push(RowString);
    });

    const lastData = dataString.join(',');
    data.push(lastData);
  });

  const content = [headers].concat(data).join('\r\n');
  const name = new XDate().toString('dd-MM-yyyy HH:mm:ss') + '.csv';

  try {
    const status = exportFile(props.exportableName + '_' + name, content, {
      encoding: 'utf-8',
      mimeType: 'text/csv',
      byteOrderMark: '\uFEFF'
    });

    if (!status) throw new Error();
  } catch (error: any) {
    notify.negativeNotify('Error al descargar CSV');
  }
};

/**
 * Type
 */
type Pagination = {
  /**
   * Column name (from column definition)
   */
  sortBy?: string | null;
  /**
   * Is sorting in descending order?
   */
  descending?: boolean;
  /**
   * Page number (1-based)
   */
  page?: number;
  /**
   * How many rows per page? 0 means Infinite
   */
  rowsPerPage?: number;
};

/**
 * Data
 */
const pagination = ref<Pagination>({
  sortBy: 'index',
  descending: false,
  page: 1,
  rowsPerPage: props.defaultPerPage
});

/**
 * Page
 */
const page = computed<number>(() => {
  return pagination.value.page || 1;
});

/**
 * Last Page
 */
const lastPage = computed<number>(() => {
  if (pagination.value.rowsPerPage === 0) return 1;
  if (!newRows.value) return 1;
  if (newRows.value.length === 0) return 1;
  if (!pagination.value.rowsPerPage) return 1;

  return Math.ceil(newRows.value.length / pagination.value.rowsPerPage);
});

/**
 * Has Previous Page
 */
const hasPreviousPage = computed<boolean>(() => {
  return page.value > 1;
});

/**
 * Has Next Page
 */
const hasNextPage = computed<boolean>(() => {
  return page.value < lastPage.value;
});

/**
 * From
 */
const from = computed<number>(() => {
  if (!newRows.value) return 0;
  if (newRows.value.length === 0) return 0;
  if (!pagination.value.rowsPerPage) return 0;

  return (page.value - 1) * pagination.value.rowsPerPage + 1;
});

/**
 * To
 */
const to = computed<number>(() => {
  if (!newRows.value) return 0;
  if (newRows.value.length === 0) return 0;
  if (!pagination.value.rowsPerPage) return 0;

  return Math.min(page.value * pagination.value.rowsPerPage, newRows.value.length);
});

/**
 * Total
 */
const total = computed<number>(() => {
  return newRows.value.length;
});
</script>

<template>
  <div>
    <div class="tw-m-3">
      <div class="tw-flex tw-justify-between tw-items-center">
        <div class="tw-flex tw-gap-3">
          <q-btn
            v-if="!props.notExportable"
            color="primary"
            icon="mdi-download"
            label="Descargar CSV"
            no-caps
            @click="downloadCsv"
          />

          <slot name="buttons" />
        </div>

        <div>
          <q-input v-model="filter" outlined dense debounce="100" placeholder="Buscar">
            <template v-slot:append>
              <q-icon name="mdi-magnify" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <!-- @vue-ignore -->
    <q-table
      :="props"
      separator="cell"
      flat
      bordered
      dense
      :rows="newRows"
      :columns="newColumns"
      v-model:pagination="pagination"
    >
      <template #top="table" v-if="total > 0">
        <div class="tw-w-full">
          <div class="tw-flex tw-items-center tw-justify-center">
            <div class="tw-flex tw-items-center tw-mr-4">
              <span class="tw-text-xs tw-mr-2">Filas por página:</span>
              <q-select
                dense
                v-model.sync="pagination.rowsPerPage"
                :options="[5, 10, 25, 50, 100, 250, 500]"
              />
            </div>

            <div>
              <span class="tw-text-xs tw-mr-2"> {{ from }}-{{ to }} de {{ total }} </span>

              <q-btn
                flat
                round
                dense
                size="3mm"
                icon="mdi-page-first"
                @click="table.firstPage()"
                :disable="!hasPreviousPage"
                v-if="lastPage > 2"
              >
                <q-tooltip v-if="table.pagination.page > 1"> Inicio </q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                size="3mm"
                icon="mdi-chevron-left"
                @click="table.prevPage()"
                :disable="!hasPreviousPage"
                v-if="lastPage > 1"
              >
                <q-tooltip v-if="hasPreviousPage"> Retroceder </q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                size="3mm"
                icon="mdi-chevron-right"
                @click="table.nextPage()"
                :disable="!hasNextPage"
                v-if="lastPage > 1"
              >
                <q-tooltip v-if="hasNextPage"> Avanzar </q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                size="3mm"
                icon="mdi-page-last"
                @click="table.lastPage()"
                :disable="!hasNextPage"
                v-if="lastPage > 2"
              >
                <q-tooltip v-if="table.pagination.page < lastPage"> Fin </q-tooltip>
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

      <template #bottom="table" v-if="total > 0">
        <div class="tw-w-full">
          <div class="tw-flex tw-items-center tw-justify-center">
            <div class="tw-flex tw-items-center tw-mr-4">
              <span class="tw-text-xs tw-mr-2">Filas por página:</span>
              <q-select
                dense
                v-model.sync="pagination.rowsPerPage"
                :options="[5, 10, 25, 50, 100, 250, 500]"
              />
            </div>

            <div>
              <span class="tw-text-xs tw-mr-2"> {{ from }}-{{ to }} de {{ total }} </span>

              <q-btn
                flat
                round
                dense
                size="3mm"
                icon="mdi-page-first"
                @click="table.firstPage()"
                :disable="!hasPreviousPage"
                v-if="lastPage > 2"
              >
                <q-tooltip v-if="table.pagination.page > 1"> Inicio </q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                size="3mm"
                icon="mdi-chevron-left"
                @click="table.prevPage()"
                :disable="!hasPreviousPage"
                v-if="lastPage > 1"
              >
                <q-tooltip v-if="hasPreviousPage"> Retroceder </q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                size="3mm"
                icon="mdi-chevron-right"
                @click="table.nextPage()"
                :disable="!hasNextPage"
                v-if="lastPage > 1"
              >
                <q-tooltip v-if="hasNextPage"> Avanzar </q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                size="3mm"
                icon="mdi-page-last"
                @click="table.lastPage()"
                :disable="!hasNextPage"
                v-if="lastPage > 2"
              >
                <q-tooltip v-if="table.pagination.page < lastPage"> Fin </q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>
