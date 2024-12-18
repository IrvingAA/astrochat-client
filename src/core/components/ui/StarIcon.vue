<script setup lang="ts">
/**
 * Props
 */
const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <q-icon v-if="props.active" class="shining" size="15px" name="mdi-star" color="warning" />
</template>

<style scoped lang="scss">
.shining {
  animation: shining 1s infinite;
}

@keyframes shining {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 2;
  }
  100% {
    opacity: 0.5;
  }
}
</style>
