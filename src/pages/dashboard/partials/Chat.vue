<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { QCard, QCardSection, QCardActions, QBtn, QInput, QChatMessage } from 'quasar';
import MessagesService from '@/services/messages.service';
import { gql } from '@apollo/client/core';
import { useSubscription } from '@vue/apollo-composable';

const messagesContainer = ref<HTMLElement | null>(null);
const MESSAGE_SUBSCRIPTION = gql`
  subscription {
    newMessage
  }
`;

const { result } = useSubscription(MESSAGE_SUBSCRIPTION);

const cardTitle = ref('AstroChat');
const newMessage = ref('');
const messages = ref<any[]>([]);
let messagesCache: any[] = [];
const isAtBottom = ref(true);

const messagesService = new MessagesService();

const allMessages = computed(() => messages.value);

const fetchMessages = async () => {
  if (messagesCache.length) {
    messages.value = messagesCache;
    return;
  }

  try {
    const response = await messagesService.index({
      chatRoomUuid: '9de07712-30b1-4336-b86e-5b4febec2eb0',
      content: '',
      senderUuid: ''
    });

    messagesCache = response.items;
    messages.value = messagesCache;
  } catch (error) {
    console.error('Error al cargar mensajes:', error);
  }
};

const sendMessage = async () => {
  if (newMessage.value.trim()) {
    const message = {
      _id: Date.now(),
      senderUuid: { username: 'me' },
      avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
      content: newMessage.value,
      createdAt: new Date().toLocaleString(),
      sent: true,
      bgColor: 'amber-7'
    };

    if (!messages.value.some((msg) => msg.content === message.content)) {
      messages.value.push(message);
    }

    try {
      await messagesService.sendMessage({
        room: 'astrochat',
        sender: 'me',
        content: newMessage.value
      });
      newMessage.value = '';
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  }
};

// Scroll hacia abajo si es necesario
const scrollToBottom = () => {
  const container = messagesContainer.value;
  if (container && isAtBottom.value) {
    container.scrollTop = container.scrollHeight;
  }
};

const handleScroll = () => {
  const container = messagesContainer.value;
  if (container) {
    const atTop = container.scrollTop === 0;
    isAtBottom.value = container.scrollHeight - container.scrollTop === container.clientHeight;

    if (atTop) {
      loadOlderMessages();
    }
  }
};

const loadOlderMessages = async () => {
  const olderMessages = await messagesService.index({
    chatRoomUuid: '9de07712-30b1-4336-b86e-5b4febec2eb0',
    content: '',
    senderUuid: ''
  });

  messages.value = [...olderMessages.items, ...messages.value];
  await nextTick();
  scrollToBottom();
};

onMounted(async () => {
  await fetchMessages();
  await nextTick();
  scrollToBottom();
});

watch(result, async (newData) => {
  if (newData?.newMessage) {
    try {
      const parsedMessage = JSON.parse(newData.newMessage);
      const newMessageData = {
        _id: Date.now(),
        senderUuid: { username: parsedMessage.createdBy || 'Unknown' },
        avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
        content: parsedMessage.message,
        createdAt: parsedMessage.createdAt || new Date().toLocaleString(),
        sent: true,
        bgColor: 'green-7'
      };

      if (!messages.value.some((msg) => msg.content === newMessageData.content)) {
        messages.value.push(newMessageData);
        messagesCache.push(newMessageData);
      }
      await nextTick();
      scrollToBottom();
    } catch (error) {
      console.error('Error parsing live message:', error);
    }
  }
});

const setName = (senderUuid: any) => senderUuid?.name || senderUuid?.username || 'Unknown';
const parseDate = (date: string) => new Date(date).toLocaleString() || Date.now().toLocaleString();
</script>

<template>
  <q-card
    bordered
    class="bg-black text-white shadow-4"
    style="height: 90%; width: 90%; display: flex; flex-direction: column"
  >
    <q-card-section class="text-h5 text-center tw-font-bold q-pa-md bg-gray-800">
      {{ cardTitle }}
    </q-card-section>

    <q-card-section class="tw-flex-grow q-pa-md" style="height: 100%; overflow-y: hidden">
      <div
        ref="messagesContainer"
        @scroll="handleScroll"
        style="height: calc(100% - 60px); overflow-y: auto; display: flex; flex-direction: column"
      >
        <div class="tw-flex tw-flex-col tw-gap-4">
          <q-chat-message
            v-for="message in allMessages"
            :key="message._id"
            :name="setName(message.senderUuid)"
            :avatar="message.avatar || 'https://cdn.quasar.dev/img/avatar1.jpg'"
            :text="[message.content]"
            :stamp="parseDate(message.createdAt) || ''"
            :sent="message.sent || false"
            :bg-color="message.bgColor || 'green-7'"
            text-color="white"
            class="tw-mb-2"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-actions
      class="q-pa-md bg-gray-900 flex items-center justify-between"
      style="border-top: 1px solid #444"
    >
      <q-btn flat round icon="mdi-emoticon-happy-outline" color="white" size="md" />
      <q-input
        v-model="newMessage"
        placeholder="Escribe un mensaje..."
        outlined
        dense
        dark
        class="tw-flex-grow q-mx-md"
        @keyup.enter="sendMessage"
        style="min-width: 0; max-width: 100%"
      />
      <q-btn round unelevated color="positive" icon="mdi-send" size="md" @click="sendMessage" />
    </q-card-actions>
  </q-card>
</template>
