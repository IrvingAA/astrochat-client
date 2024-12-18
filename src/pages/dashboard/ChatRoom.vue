<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Room List -->
    <div class="w-64 bg-white p-4 flex flex-col h-full border-r">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Rooms</h2>
        <q-btn round flat color="primary" icon="add" @click="isAddRoomModalOpen = true" />
      </div>
      <q-scroll-area class="flex-grow">
        <q-list>
          <q-item
            v-for="room in rooms"
            :key="room.id"
            clickable
            v-ripple
            @click="selectRoom(room.id)"
            :active="selectedRoom === room.id"
          >
            <q-item-section avatar>
              <q-icon :name="room.isPrivate ? 'lock' : 'tag'" />
            </q-item-section>
            <q-item-section>{{ room.name }}</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </div>

    <!-- Chat Area -->
    <div class="flex-1 flex flex-col h-full">
      <div v-if="selectedRoom" class="flex-1 flex flex-col">
        <q-scroll-area class="flex-1 p-4">
          <div v-for="message in messages" :key="message.id" class="mb-4">
            <div class="font-bold">{{ message.sender }}</div>
            <div>{{ message.content }}</div>
            <div class="text-xs text-gray-500">{{ message.timestamp }}</div>
          </div>
        </q-scroll-area>
        <q-form @submit="sendMessage" class="p-4 border-t flex">
          <q-input
            v-model="newMessage"
            dense
            outlined
            placeholder="Type a message..."
            class="flex-1 mr-2"
          />
          <q-btn type="submit" color="primary" icon="send" />
        </q-form>
      </div>
      <div v-else class="flex-1 flex items-center justify-center text-gray-500">
        Select a room to start chatting
      </div>
    </div>

    <!-- Add Room Modal -->
    <q-dialog v-model="isAddRoomModalOpen">
      <q-card class="p-4" style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Add New Room</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="newRoomName" label="Room Name" dense />
          <q-toggle v-model="newRoomIsPrivate" label="Private Room" class="mt-2" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn label="Add Room" color="primary" @click="addRoom" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

interface Room {
  id: string
  name: string
  isPrivate: boolean
}

interface Message {
  id: string
  content: string
  sender: string
  timestamp: string
}

const rooms = ref<Room[]>([
  { id: '1', name: 'General', isPrivate: false },
  { id: '2', name: 'Random', isPrivate: false },
  { id: '3', name: 'Private Room', isPrivate: true },
])

const selectedRoom = ref<string | null>(null)
const messages = ref<Message[]>([])
const isAddRoomModalOpen = ref(false)
const newRoomName = ref('')
const newRoomIsPrivate = ref(false)
const newMessage = ref('')

const selectRoom = (roomId: string) => {
  selectedRoom.value = roomId
  // In a real application, you would fetch messages for the selected room here
  messages.value = [
    { id: '1', content: 'Hello!', sender: 'User1', timestamp: '2023-04-20 10:00:00' },
    { id: '2', content: 'Hi there!', sender: 'User2', timestamp: '2023-04-20 10:01:00' },
  ]
}

const addRoom = () => {
  if (newRoomName.value.trim()) {
    const newRoom: Room = {
      id: Date.now().toString(),
      name: newRoomName.value.trim(),
      isPrivate: newRoomIsPrivate.value,
    }
    rooms.value.push(newRoom)
    newRoomName.value = ''
    newRoomIsPrivate.value = false
    $q.notify({
      message: `Room "${newRoom.name}" added successfully`,
      color: 'positive',
    })
  }
}

const sendMessage = () => {
  if (newMessage.value.trim() && selectedRoom.value) {
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage.value.trim(),
      sender: 'CurrentUser',
      timestamp: new Date().toLocaleString(),
    }
    messages.value.push(message)
    newMessage.value = ''
  }
}
</script>

<style scoped>
/* Add any additional component-specific styles here */
</style>
