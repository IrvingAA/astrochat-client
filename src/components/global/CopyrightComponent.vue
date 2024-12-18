<script setup lang="ts">
import useEnv from '@/core/composables/useEnv'

const currentYear = new Date().getFullYear()
const env = useEnv()
</script>

<template>
  <span>&copy; {{ currentYear }} - {{ env.COMPANY_NAME }}.</span>
</template>
