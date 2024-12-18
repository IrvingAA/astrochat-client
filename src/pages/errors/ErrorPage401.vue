<script setup lang="ts">
import ErrorComponent from '@/components/layouts/errors/ErrorComponent.vue'
</script>

<template>
  <ErrorComponent :code="401" message="No puedes acceder a esta página" />
</template>
