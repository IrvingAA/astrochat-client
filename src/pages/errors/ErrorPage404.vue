<script setup lang="ts">
import ErrorComponent from '@/components/layouts/errors/ErrorComponent.vue'
</script>

<template>
  <ErrorComponent :code="404" message="La página no existe" />
</template>
