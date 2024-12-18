<script setup lang="ts">
const props = defineProps({
  code: Number,
  message: String
})
</script>

<template>
  <div class="tw-text-center">
    <span style="font-size: 5rem">{{ props.code }}</span>
    <p style="font-size: 2rem">{{ props.message }}</p>
    <q-separator dark class="tw-my-5" />
    <q-btn color="teal" class="tw-mt-6" :to="{ name: 'dashboard.index' }">
      <span>Ir al inicio</span>
      <q-icon name="mdi-home" right />
    </q-btn>
  </div>
</template>
