
import CustomHandler from '@/core/config/CustomHandler';
import type { IndexPayload, ChatRoomIndexResponse, ChatRoomIC } from '@/types/api/ChatRoomsApi';
//@ts-ignore
import chatRooms from '@/api/ChatRoomsApi';

export default class ChatRoomService {
  private chatRooms: chatRooms

  constructor() {
    this.chatRooms = new chatRooms()
  }

  /**
   * Este metodo enlista un arreglo de personas
   * @param {IndexPayload} payload
   * @returns {Promise<ChatRoomIndexResponse["data"]>}
   */
  public async index(payload: ChatRoomIC): Promise<ChatRoomIndexResponse["data"]> {
    try {
      const { data } = await this.chatRooms.index(payload)
      return data
    } catch (error: any) {
      throw new CustomHandler(error)
    }
  }

}
