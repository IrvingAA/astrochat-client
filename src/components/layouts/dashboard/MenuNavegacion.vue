<script setup lang="ts">
import { ref, onMounted } from 'vue';
import StarIcon from '@/core/components/ui/StarIcon.vue';
import ChatRoomService from '@/services/chat-rooms.service';
import AstroChat from '@/assets/img/astrochat.png';

const chatRoomService = new ChatRoomService();
const formFilter = ref({ name: '' });
const chatRooms = ref<any[]>([]);

const fetchChatRooms = async () => {
  try {
    const response = await chatRoomService.index({
      name: formFilter.value.name,
      page: 1,
      limit: 500
    });
    chatRooms.value = response.items.map((item: any) => ({
      icon: item.icon || 'mdi-chat',
      label: item.name,
      badge: item.badge || false,
      click: () => console.log(`Sala seleccionada: ${item.name}`)
    }));
  } catch (error) {
    console.error('Error al cargar las salas:', error);
  }
};

const addNewRoom = () => {};

onMounted(() => {
  fetchChatRooms();
});
</script>
<template>
  <div class="tw-h-full tw-bg-gray-800 tw-text-white tw-flex tw-flex-col tw-shadow-lg">
    <div class="tw-py-4 tw-px-2 tw-flex tw-items-center tw-justify-between tw-bg-gray-900">
      <div class="tw-flex tw-items-center">
        <q-avatar size="lg" class="tw-mr-2">
          <img :src="AstroChat" alt="AstroChat Logo" draggable="false" />
        </q-avatar>
        <span class="tw-text-lg tw-font-semibold">AstroChat</span>
      </div>
      <q-btn
        dense
        flat
        icon="mdi-plus-circle"
        color="positive"
        size="sm"
        aria-label="Nueva Sala"
        @click="addNewRoom"
      >
        <q-tooltip>Crear Nueva Sala</q-tooltip>
      </q-btn>
    </div>

    <div class="tw-px-3 tw-py-2">
      <q-input
        v-model="formFilter.name"
        dense
        outlined
        dark
        placeholder="Buscar sala..."
        class="tw-w-full tw-rounded-md"
        input-class="tw-text-sm tw-text-white"
        color="white"
        @update:model-value="fetchChatRooms"
      >
        <template v-slot:prepend>
          <q-icon name="mdi-magnify" color="white" />
        </template>
      </q-input>
    </div>

    <div class="tw-flex-grow tw-overflow-auto tw-px-2 tw-mt-2">
      <q-item
        v-for="(room, index) in chatRooms"
        :key="index"
        clickable
        class="tw-rounded-lg tw-py-2 tw-mb-2 hover:tw-bg-gray-700 tw-transition-all tw-duration-300"
        @click="room.click"
      >
        <q-item-section avatar>
          <q-icon :name="room.icon || 'mdi-chat'" size="md" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="tw-text-sm tw-text-white tw-font-medium">{{
            room.label
          }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <StarIcon v-if="room.badge" :active="room.badge" />
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>

<style scoped>
.q-input ::v-deep(input) {
  color: white !important;
}
.q-item {
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}
.q-item:hover {
  transform: scale(1.02);
}
</style>
