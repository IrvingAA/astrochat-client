import type { IndexMessages, MessageIC } from '@/types/api/MessagesInterface';
import Api from './Api';
import type { ChatRoomIndexResponse, ChatRoomIC } from '@/types/api/ChatRoomsApi';

export default class MessagesApi extends Api {

  constructor() {
    super('messages')
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

  public async messages(payload: MessageIC): Promise<IndexMessages> {
    const { data } = await this.$get(`/chat-room/${payload.chatRoomUuid}`)
    return data
  }
}
