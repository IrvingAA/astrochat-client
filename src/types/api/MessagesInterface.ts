import type { ApiResponseIC, StandardPaginationIC } from '@/core/types/api/ApiType';
import type { ApiPayloadIC } from './ApiInterface';

export type MessageIC = {
  uuid?: string
  content: string
  senderUuid: string
  receiverUuid?: string
  chatRoomUuid: string
}

export type MessagePayload = ApiPayloadIC<MessageIC>

export type IndexMessages = ApiResponseIC<MessageIC[]>
