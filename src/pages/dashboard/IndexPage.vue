<script setup lang="ts">
import Chat from './partials/Chat.vue';

</script>

<template>
  <div class="q-pa-md flex flex-center" style="height: 100vh; background-color: #111827">
    <Chat
      card-title="AstroChat"
      :messages="[]"
      :newMessage="[]"
      :sendMessage="[]"
    />
  </div>
</template>

<style scoped>
.q-card {
  border-radius: 12px;
}

.q-chat-message {
  margin-bottom: 8px;
}

.q-card-section {
  padding: 0;
}

.q-card-actions {
  padding: 12px 16px;
}
</style>
