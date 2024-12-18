import useGenerators from '@/core/composables/useGenerators'
import useFormsStore from '@/core/stores/config/useFormsStore'
import FieldTypesEnum from '@/core/enums/FieldTypesEnum'
import useTestService from '@/services/TestService'
import type { IndexPayload } from '@/types/api/TestApiInterface'


/**
 * useGenerators
 */
const generator = useGenerators()

/**
 * formsStore
 */
const formsStore = useFormsStore()

/**
 * Service
 */
const service = new useTestService()

//const authStore = useAuthStore();

//console.log(authStore)

export default function UsuariosTable() {
  /**
   * form
   */

  /**
   * form
   */
  formsStore.makeForm<IndexPayload>('test_filter', {
    name: null,
    email: null
  })


  /**
   * formGeneratorModel
   */
  const filterModel = generator.makeFormGeneratorModel<IndexPayload>({
    formToUseName: 'test_filter', //cuando aparece en rojo , no se encuentra agregado en el formEnum.ts
    fields: [
      {
        label: 'Nombre',
        model: 'name',
        field_type: FieldTypesEnum.InputText
      },
      {
        label: 'Apellido Paterno',
        model: 'email',
        field_type: FieldTypesEnum.InputText
      },
    ]
  })

  /**
   * TableModel
   */
  const tableModel = generator.makeTableGeneratorModel({
    tableName: 'test_table', //cuando aparece en rojo , no se encuentra agregado en el tablesEnum.ts
    service: async (payload: IndexPayload, pagination) => {
      const data = await service.index({
        ...payload,
        rowsPerPage: pagination.perPage,
        page: pagination.page
      })
      return data
    },
    serverPagination: true,
    loadDataAtStart: true,
    hasFilters: true,
    searchOnFiltersChange: false,
    columns: [
      {
        field: null,
        label: 'Acciones',
        name: 'actions',
        align: 'center',
      },
      {
        field: 'name',
        label: 'Nombre '
      },
      {
        field: 'email',
        label: 'Email '
      },
    ],
    filtersFGModel: filterModel,
    showFiltersIfAbove: false,
    resetFiltersAtStart: true,
  })

  return {
    tableModel
  }
}
