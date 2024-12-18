
import CustomHandler from '@/core/config/CustomHandler';

//@ts-ignore
import messagesApi from '@/api/messagesApi';
import type { IndexMessages, MessageIC } from '@/types/api/MessagesInterface';

export default class MessagesService {
  private messagesApi: messagesApi

  constructor() {
    this.messagesApi = new messagesApi()
  }

  /**
   * Este metodo enlista un arreglo de personas
   * @param {MessageIC} payload
   * @returns {Promise<ChatRoomIndexResponse["data"]>}
   */
  public async index(payload: MessageIC): Promise<IndexMessages> {
    try {
      const { data } = await this.messagesApi.messages(payload)
      //@ts-ignore
      return data
    } catch (error: any) {
      throw new CustomHandler(error)
    }
  }

}
