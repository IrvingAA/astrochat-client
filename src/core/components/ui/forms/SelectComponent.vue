<script setup lang="ts">
import useFormRules from '@/core/composables/useFormRules';
import useUtils from '@/core/composables/useUtils';
import type { SelectIC, SelectOptionsIC } from '@/core/types/components/ui/FormsInterface'
import type { ValidationRule } from 'quasar';
import { computed, ref, onMounted } from 'vue';
import HelpTooltip from '@/core/components/ui/HelpTooltip.vue';
import { useRoute } from 'vue-router'
import { watch } from 'vue'

/**
 * Imported
 */
const utils = useUtils()

/**
 * Props
 */
const route = useRoute()
const rules = defineModel<ValidationRule[]>('rules', { default: () => [] })
const options = defineModel<SelectOptionsIC[]>('options', { default: () => [] })
const props = withDefaults(defineProps<SelectIC>(), {
  label: 'Select',
  noDataLabel: 'Sin opciones',
  required: false,
  dontCleanErrorMessagesOnChange: false,
  //@ts-ignore
  options: []
})

/**
 * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: SelectIC['modelValue']): void
  (e: 'update:errorMessages', value: SelectIC['errorMessages']): void
}>()

/**
 * Start component
 */
const startIsInUse = ref<boolean>(false)
const start = async () => {
  if (startIsInUse.value) return

  startIsInUse.value = true
  options.value = props.options

  //order options
  options.value = options.value.sort((a, b) => a.label.localeCompare(b.label))

  startIsInUse.value = false
}

/**
 * Watch route
 */
watch(
  () => route.path,
  async () => {
    await start()
  }
)

/**
 * On mounted
 */
onMounted(async () => {
  await start()
})

/**
 * Model
 */
const model = computed({
  get() {
    //si el valor o algunos de los valores no existe en lastOptions, ese valor deber ser quitado o ser null
    if (props.multiple && Array.isArray(props.modelValue)) {
      return props.modelValue?.filter((v) => optionsWithFilter.value.find((o) => o.value === v))
    }

    if (props.modelValue && !optionsWithFilter.value.find((o) => o.value === props.modelValue)) {
      return null
    }

    return props.modelValue
  },
  async set(value) {
    if (!props.dontCleanErrorMessagesOnChange) {
      emits('update:errorMessages', [])
    }

    //@ts-ignore
    emits('update:modelValue', value)
    if (props.onChange) await props.onChange(value)
  }
})

/**
 * Help label
 */
const helpLabel = computed<string | null>(() => {
  const prop = props.help
  if (prop) return prop

  if (props.metaHelp && props.multiple === false) {
    const option = props.options.filter((item) => item.value === model.value)
    if (option[0] && option[0]?.meta && option[0].meta[props.metaHelp]) {
      return option[0].meta[props.metaHelp]
    }
  }

  return null
})

/**
 * Computed
 */
const hasError = computed<boolean>(() => Boolean(props.errorMessages?.length))
const errorMessage = computed<string>(() => props.errorMessages?.[0] ?? '')
const classRequiredLabel = computed<string>(() => (props.required ? 'input-required' : ''))

/**
 * Options with filter
 */
const optionsWithFilter = computed(() => {
  if (props.filter) {
    const result = props.filter(options.value)
    return result
  }

  return options.value
})
/**
 * Search options
 */
const searchOptions = ref<SelectOptionsIC[]>(options.value)

/**
 * Methods
 */

const filterFn = (val: string, update: (fn: () => void) => void) => {
  if (props.filter) {
    searchOptions.value = props.filter(searchOptions.value)
  }

  if (val === '') {
    update(() => {
      searchOptions.value = optionsWithFilter.value
    })
    return
  }

  update(() => {
    const needle = utils.clearText(val)
    searchOptions.value = optionsWithFilter.value.filter(
      (v) => utils.clearText(v.label).indexOf(needle) > -1
    )
  })
}

/**
 * Rules
 */
const { required } = useFormRules()
if (props.required) rules.value.push(required)

/**
 * Replace props
 */
// eslint-disable-next-line
const newProps = computed(() => {
  const modProps = { ...props }
  //@ts-ignore
  delete modProps.onChange

  // @ts-ignore
  delete modProps.required

  if (!modProps.options?.length) {
    modProps.label = `${modProps.label} (${modProps.noDataLabel})`
  }

  /**
   * If multiple
   */
  if (modProps.multiple) {
    // @ts-ignore
    modProps.useChips = true
    // @ts-ignore
    modProps.stackLabel = true
  } else {
    // @ts-ignore
    modProps.hideSelected = false
  }

  return modProps
})

/**
 * Internal required
 */
const internalRequired = computed<boolean>(() => {
  if (!props.required) return false

  if (props.multiple) {
    return Array.isArray(model.value) && model.value.length === 0
  }

  return model.value === null
})

/**
 * Label
 */
const label = computed<string | string[]>(() => {
  if (props.multiple && Array.isArray(model.value)) {
    // @ts-ignore
    const optionsSelected = optionsWithFilter.value.filter((o) => model.value.includes(o.value))
    const labels = optionsSelected.map((o) => o.label)
    return labels
  }

  const optionSelected = optionsWithFilter.value.find((o) => o.value === model.value)
  const label = optionSelected?.label ?? ''
  return label
})

/**
 * Remove item
 */
 const removeItem = (item: string) => {
  //item is label
  const option = optionsWithFilter.value.find((o) => o.label === item)
  if (option) {
    // @ts-ignore
    const newValue = model.value.filter((v) => v !== option.value)
    model.value = newValue
  }
}
</script>

<template>
  <q-select
    :="newProps"
    v-model="model"
    :error="hasError"
    :error-message="errorMessage"
    :rules="rules"
    :title="props.label"
    :options="searchOptions"
    input-debounce="0"
    @filter="filterFn"
    :required="internalRequired"
    spellcheck="false"
    outlined
    lazy-rules
    clearable
    use-input
    emit-value
    map-options
  >
    <template #prepend>
      <template v-if="props.prependIcon">
        <q-icon :name="props.prependIcon" />
      </template>
      <template v-if="props.help && props.prependIcon">
        <span class="tw-ml-2">|</span>
      </template>

      <HelpTooltip :show="Boolean(helpLabel)">
        {{ helpLabel }}
      </HelpTooltip>
    </template>

    <template #append>
      <template v-if="props.appendIcon">
        <q-icon :name="props.appendIcon" />
      </template>

      <template v-else-if="props.appendText">
        <span class="tw-text-base tw-select-none">{{ props.appendText }}</span>
      </template>
    </template>

    <template #label>
      <div>
        <span :class="`${classRequiredLabel} tw-text-sm`">
          {{ props.label }}
        </span>
      </div>
    </template>

    <template #selected-item v-if="!Array.isArray(label)">
      <span>
        {{ label }}
      </span>
    </template>

    <template #selected v-else>
      <q-chip v-for="item in label" :key="item" removable @remove="removeItem(item)">
        {{ item }}
      </q-chip>
    </template>
  </q-select>
</template>
