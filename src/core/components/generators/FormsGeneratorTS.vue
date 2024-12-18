<script setup lang="ts">
import FieldTypesEnum from '@/core/enums/FieldTypesEnum';
import InputText from '@/core/components/ui/forms/InputText.vue';
import InputEmail from '@/core/components/ui/forms/InputEmail.vue';
import InputPassword from '@/core/components/ui/forms/InputPassword.vue';
import InputDate from '@/core/components/ui/forms/InputDate.vue';
import ToggleButton from '@/core/components/ui/forms/ToggleButton.vue';
import useFormsStore from '@/core/stores/config/useFormsStore';
import Select from '@/core/components/ui/forms/SelectComponent.vue';
import SelectCatalog from '@/core/components/ui/forms/SelectCatalog.vue';
import InputPasswordConfirm from '@/core/components/ui/forms/InputPasswordConfirm.vue';
import TextArea from '@/core/components/ui/forms/TextArea.vue';
import InputNumber from '@/core/components/ui/forms/InputNumber.vue';
import InputTel from '@/core/components/ui/forms/InputTel.vue';
import { VueElement, computed } from 'vue';
import type {
  FormsGeneratorItem,
  FormGeneratorTsVueIC
} from '@/core/types/components/generators/FormsGeneratorInterface';
import InputSearch from '@/core/components/ui/forms/InputSearch.vue';
import SelectCatalogChild from '@/core/components/ui/forms/SelectCatalogChild.vue';
import SelectChild from '@/core/components/ui/forms/SelectChild.vue';
import InputFile from '@/core/components/ui/forms/InputFile.vue';
import InputRadioGroup from '@/core/components/ui/forms/InputRadioGroup.vue';
import InputCheckGroup from '@/core/components/ui/forms/InputCheckGroup.vue';
import InputMoney from '@/core/components/ui/forms/InputMoney.vue';
import Editor from '@/core/components/ui/forms/EditorComponent.vue';
import DatePicker from '@/core/components/ui/forms/DatePicker.vue';
import InputEmailConfirm from '@/core/components/ui/forms/InputEmailConfirm.vue';
import InputFileDescription from '@/core/components/ui/forms/InputFileDescription.vue';
import InfoCard from '@/core/components/ui/forms/InfoField.vue';
import InputTextDouble from '@/core/components/ui/forms/InputTextDouble.vue';

/**
 * Props
 */
const modelValue = defineModel<FormGeneratorTsVueIC<any>>();

/**
 * Imported
 */
const formsStore = useFormsStore();

/**
 * Computed
 */
const formToUseName = computed(() => modelValue.value?.formToUseName ?? null);

/**
 * Slots
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const slots = defineSlots<{
  [nameField: string]: () => VueElement;
}>();

/**
 * Metodo para inyectar las propiedades de un campo a un componente
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fieldProps = (field: FormsGeneratorItem<any>, extraFieldsToDelete?: string[]): object => {
  const props = { ...field, ...field.meta };

  const deleteDefaultList: string[] = ['meta', 'field_type', 'model', 'hideOn', 'disableOn'];

  /**
   * Se eliminan las propiedades que no se necesitan
   */
  if (extraFieldsToDelete) deleteDefaultList.push(...extraFieldsToDelete);
  deleteDefaultList.forEach((key) => {
    // @ts-ignore
    delete props[key];
  });

  /**
   * Se agregan las propiedades que se necesitan para el componente
   */
  const lastProps = {
    ...props,
    // @ts-ignore
    'error-messages': formsStore.formsErrors[formToUseName.value][field.model],
    // @ts-ignore
    disable: field.disableOn()
  };

  return lastProps;
};

/**
 * Actualiza los errores de un campo
 */
const updateFieldErrors = (fieldName: any, errors: string[]): void => {
  // @ts-ignore
  formsStore.setFieldsErrors<any>(formToUseName.value, {
    [fieldName]: errors
  });
};
</script>

<template>
  <div>
    <template v-for="(field, key) in modelValue?.fields" :key="key">
      <!-- @vue-ignore -->
      <template v-if="!field.hideOn()">
        <template v-if="field.field_type === FieldTypesEnum.CustomField && field.name">
          <!-- @vue-ignore -->
          <slot
            :name="field.name"
            v-bind="field"
            v-bind:formToUseName="formToUseName"
            :="fieldProps(field)"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.InputText">
          <!-- @vue-ignore -->
          <InputText
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.InputSearch">
          <!-- @vue-ignore -->
          <InputSearch
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.InputEmail">
          <!-- @vue-ignore -->
          <InputEmail
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.InputEmailConfirm">
          <!-- @vue-ignore -->
          <InputEmailConfirm
            :="fieldProps(field, ['modelEmail'])"
            v-model="formsStore.forms[formToUseName][field.model]"
            :model-email="formsStore.forms[formToUseName][field.meta?.modelEmail]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.InputPassword">
          <!-- @vue-ignore -->
          <InputPassword
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.InputPasswordConfirm">
          <!-- @vue-ignore -->
          <InputPasswordConfirm
            :="fieldProps(field, ['modelPassword'])"
            v-model="formsStore.forms[formToUseName][field.model]"
            :model-password="formsStore.forms[formToUseName][field.meta?.modelPassword]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.InputNumber">
          <!-- @vue-ignore -->
          <InputNumber
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.InputTel">
          <!-- @vue-ignore -->
          <InputTel
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.InputDate">
          <!-- @vue-ignore -->
          <InputDate
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.InputFile">
          <!-- @vue-ignore -->
          <InputFile
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
            :idFileList="formToUseName + '_' + field.model"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.InputFileDescription">
          <!-- @vue-ignore -->
          <InputFileDescription
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
            :idFileList="formToUseName + '_' + field.model"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.InputRadioGroup">
          <!-- @vue-ignore -->
          <InputRadioGroup
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.InputCheckGroup">
          <!-- @vue-ignore -->
          <InputCheckGroup
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.InputMoney">
          <!-- @vue-ignore -->
          <InputMoney
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.TextArea">
          <!-- @vue-ignore -->
          <TextArea
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.ToggleButton">
          <!-- @vue-ignore -->
          <ToggleButton
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.Select">
          <!-- @vue-ignore -->
          <Select
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.SelectChild">
          <!-- @vue-ignore -->
          <SelectChild
            :="fieldProps(field, ['modelFather'])"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
            :model-father="formsStore.forms[formToUseName][field.meta?.modelFather]"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.SelectCatalog">
          <!-- @vue-ignore -->
          <SelectCatalog
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.SelectCatalogChild">
          <!-- @vue-ignore -->
          <SelectCatalogChild
            :="fieldProps(field, ['modelFather'])"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
            :model-father="formsStore.forms[formToUseName][field.meta?.modelFather]"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.Editor">
          <!-- @vue-ignore -->
          <Editor
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.DatePicker">
          <!-- @vue-ignore -->
          <DatePicker
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
          />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.InfoField">
          <!-- @vue-ignore -->
          <InfoCard :="fieldProps(field)" />
        </template>

        <template v-if="field.field_type === FieldTypesEnum.InputTextDouble">
          <!-- @vue-ignore -->
          <InputTextDouble
            :="fieldProps(field)"
            v-model="formsStore.forms[formToUseName][field.model]"
            @update:error-messages="updateFieldErrors(field.model, $event)"
          />
        </template>
      </template>
    </template>
  </div>
</template>
