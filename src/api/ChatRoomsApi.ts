import Api from './Api';
import type { ChatRoomIndexResponse, ChatRoomIC } from '@/types/api/ChatRoomsApi';

export default class ChatRoomsApi extends Api {

  constructor() {
    super('chat-rooms')
  }

  public async index(payload: ChatRoomIC): Promise<ChatRoomIndexResponse> {
    const { data } = await this.$get('/', {
      params: {
        limit: payload.limit,
        page: payload.page,
        name: payload.name ? payload.name : undefined,
        description: payload.description !== '' ? payload.description : undefined,
      },

    })
    return data
  }

  public async messages(payload: ChatRoomIC): Promise<ChatRoomIndexResponse> {
    const { data } = await this.$get(`/${payload.uuid}/messages`, {
      params: {
        limit: payload.limit,
        page: payload.page,
        name: payload.name ? payload.name : undefined,
        description: payload.description !== '' ? payload.description : undefined,
      },

    })
    return data
  }
}
