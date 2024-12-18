<script setup lang="ts">
import TablesGeneratorTS from '@/core/components/generators/TablesGeneratorTS.vue'
import HeaderComponent from '@/core/components/ui/HeaderComponent.vue';
import useTestTable from '@/generators/tables/test/TestTable';

/**
 * Imported
 */
const testTable = useTestTable()

</script>

<template>
  <q-card color="white" flat>
    <HeaderComponent icon="mdi-git" label="Registros">
      <template #buttons>
        <q-btn flat to="/test/" icon="mdi-arrow-left">Regresar</q-btn>
      </template>
    </HeaderComponent>
    <q-card-section>
      <TablesGeneratorTS v-model="testTable.tableModel">
        <template #actions="item">
          <q-btn color="primary" flat icon="mdi-pen" >
            <q-tooltip>
              Editar Registro
            </q-tooltip>
          </q-btn>
          <q-btn flat color="primary" :icon="item.is_active ? 'mdi-check':'mdi-close'">
            <q-tooltip>
              Eliminar Registro
            </q-tooltip>
          </q-btn>
        </template>
        <template #name="item">
          {{ item.name }}
        </template>
        <template #email="item">
          <q-btn flat :href="'mailto:'+item.email">{{ item.email}}</q-btn>
        </template>
        <template #number="item">
          <q-btn flat :href="'tel:'+item.number">{{ item.number}}</q-btn>
        </template>
      </TablesGeneratorTS>
    </q-card-section>
  </q-card>
</template>

<style scoped lang="scss">

</style>
